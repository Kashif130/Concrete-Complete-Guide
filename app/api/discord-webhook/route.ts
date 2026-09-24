import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { isChainKey } from "@/lib/chains";
import { VAULT_BASE } from "@/lib/vault/data";
import { getUserPoints, FuulNotConfiguredError } from "@/lib/fuul";
import { parsePoints } from "@/lib/points";
import { getWalletVaultPositions } from "@/lib/vaultPositions";
import { docs as ALL_DOCS } from "@/content/docs.generated";
import { locales, localeNames, defaultLocale, type Locale } from "@/lib/i18n";
import { QUIZ_BATCHES } from "@/content/quiz";
import { tierForScore } from "@/lib/quizTier";
import { scoreFromBestByBatch, submitScore, getTop } from "@/lib/quizLeaderboardStore";
import {
  clearSession as clearQuizSession,
  getSession as getQuizSession,
  recordBest as recordQuizBest,
  saveSession as saveQuizSession,
  startSession as startQuizSession,
} from "@/lib/telegramQuizStore";
import {
  addSubscription,
  clearLinkedWallet,
  getChatLocale,
  getLinkedWallet,
  listSubscriptions,
  removeAllForChat,
  removeSubscription,
  setChatLocale,
  setLinkedWallet,
  telegramStorageConfigured,
  type Direction,
  type TelegramSubscription,
} from "@/lib/telegramStore";
import {
  actionRow,
  discordInteractionsConfigured,
  INTERACTION_CHANNEL_MESSAGE,
  INTERACTION_DEFERRED_CHANNEL_MESSAGE,
  INTERACTION_PONG,
  INTERACTION_UPDATE_MESSAGE,
  runInBackground,
  sendInteractionFollowup,
  verifyDiscordRequest,
} from "@/lib/discordApi";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

function parseDirection(s: string | undefined): Direction | null {
  return s === "above" || s === "below" ? s : null;
}

function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

function getOpt(data: any, name: string): string | number | undefined {
  return data?.options?.find((o: any) => o.name === name)?.value;
}

function json(body: unknown) {
  return NextResponse.json(body);
}

// Discord message flag 64 = EPHEMERAL: only the person who ran the command can see the reply.
const EPHEMERAL = 64;

function messageResponse(content: string, components?: unknown[], ephemeral = false) {
  return json({
    type: INTERACTION_CHANNEL_MESSAGE,
    data: { content, components, ...(ephemeral ? { flags: EPHEMERAL } : {}) },
  });
}

const QUIZ_LETTERS = ["A", "B", "C", "D", "E", "F"];

function questionMessage(batch: (typeof QUIZ_BATCHES)[number], qIndex: number) {
  const q = batch.questions[qIndex];
  const content = `**${batch.title}** — Q${qIndex + 1}/${batch.questions.length}\n${q.prompt}`;
  const buttons = q.options.slice(0, 6).map((opt, i) => ({ customId: `quizans:${QUIZ_LETTERS[i]}`, label: `${QUIZ_LETTERS[i]}) ${opt}`.slice(0, 80) }));
  // Discord allows max 5 buttons per action row — chunk into rows of 5.
  const rows: unknown[] = [];
  for (let i = 0; i < buttons.length; i += 5) rows.push(...actionRow(buttons.slice(i, i + 5)));
  return { content, components: rows };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!discordInteractionsConfigured()) {
    return NextResponse.json({ error: "Discord bot not configured on this deployment." }, { status: 503 });
  }

  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");
  if (!verifyDiscordRequest(rawBody, signature, timestamp)) {
    return NextResponse.json({ error: "Invalid request signature." }, { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  if (interaction.type === 1) {
    return json({ type: INTERACTION_PONG });
  }

  if (!telegramStorageConfigured()) {
    return messageResponse("Storage isn't configured on this deployment yet — ask the bot owner to set it up.");
  }

  const userId: string | undefined = interaction.member?.user?.id ?? interaction.user?.id;
  const displayName: string =
    interaction.member?.user?.username ?? interaction.user?.username ?? `user-${userId ?? "unknown"}`;
  if (!userId) return messageResponse("Couldn't identify you — try again.");
  const identity = `discord:${userId}`;
  const applicationId: string = interaction.application_id;
  const token: string = interaction.token;

  // Discord gives only 3 seconds for the first reply. For slow commands we
  // answer instantly with "thinking…" (type 5), then finish the work in the
  // background and post the result as a follow-up (valid for 15 minutes).
  const defer = (work: (reply: (text: string) => Promise<boolean>) => Promise<void>, ephemeral = false) => {
    const reply = (text: string) => sendInteractionFollowup(applicationId, token, text);
    runInBackground(
      (async () => {
        try {
          await work(reply);
        } catch {
          await reply("Something went wrong handling that — try again in a moment.");
        }
      })()
    );
    // Follow-ups inherit the ephemeral flag from this initial deferred response.
    return json({ type: INTERACTION_DEFERRED_CHANNEL_MESSAGE, ...(ephemeral ? { data: { flags: EPHEMERAL } } : {}) });
  };

  try {
    // --- Button clicks (quiz answers) --------------------------------
    if (interaction.type === 3) {
      const customId: string = interaction.data?.custom_id ?? "";
      const m = /^quizans:([A-F])$/.exec(customId);
      if (!m) return json({ type: INTERACTION_UPDATE_MESSAGE, data: { content: "Unrecognized action.", components: [] } });

      const letter = m[1];
      const session = await getQuizSession(identity);
      const batch = session ? QUIZ_BATCHES.find((b) => b.id === session.batchId) : null;
      if (!session || !batch) {
        return json({ type: INTERACTION_UPDATE_MESSAGE, data: { content: "This quiz session expired. Run /quiz to start a new one.", components: [] } });
      }

      const q = batch.questions[session.qIndex];
      const pickedIndex = letter.charCodeAt(0) - 65;
      const isCorrect = pickedIndex === q.correctIndex;
      const feedback = isCorrect
        ? "✅ Correct!"
        : `❌ Not quite — correct answer: **${QUIZ_LETTERS[q.correctIndex]}) ${q.options[q.correctIndex]}**`;

      const nextIndex = session.qIndex + 1;
      const correct = session.correct + (isCorrect ? 1 : 0);
      const streak = isCorrect ? session.streak + 1 : 0;

      if (nextIndex >= batch.questions.length) {
        await clearQuizSession(identity);
        const bestMap = await recordQuizBest(identity, batch.id, correct);
        const { weightedScore, totalCorrect } = scoreFromBestByBatch(bestMap);
        const tier = tierForScore(totalCorrect);
        await submitScore({
          clientId: identity,
          name: displayName.slice(0, 24),
          weightedScore,
          totalCorrect,
          tierKey: tier.key,
          streak,
          updatedAt: Date.now(),
        }).catch(() => {});
        return json({
          type: INTERACTION_UPDATE_MESSAGE,
          data: {
            content: `${feedback}\n${q.explanation}\n\n🏁 **${batch.title}** finished: ${correct}/${batch.questions.length} correct.\n${tier.emoji} Tier: ${tier.label} (${totalCorrect} correct all-time)\nRun /quiz for another level, or /quizrank for the leaderboard.`,
            components: [],
          },
        });
      }

      await saveQuizSession(identity, { ...session, qIndex: nextIndex, correct, streak });
      const next = questionMessage(batch, nextIndex);
      return json({
        type: INTERACTION_UPDATE_MESSAGE,
        data: { content: `${feedback}\n${q.explanation}\n\n${next.content}`, components: next.components },
      });
    }

    // --- Slash commands -------------------------------------------------
    if (interaction.type !== 2) return json({ type: INTERACTION_PONG });
    const name: string = interaction.data?.name;
    const data = interaction.data;

    if (name === "help") {
      return messageResponse(
        `**Concrete Guide bot**\n\n` +
          `**Alerts**\n/watchprice /watchapy /watchct /myalerts /unwatch /stop\n\n` +
          `**Wallet**\n/link /unlink /points /myvaults\n\n` +
          `**Docs** (${ALL_DOCS.length} pages, ${locales.length} languages)\n/lang /docs\n\n` +
          `**Quiz**\n/quiz /quizrank`
      );
    }

    if (name === "watchprice") {
      const chain = String(getOpt(data, "chain") ?? "");
      const vaultAddress = String(getOpt(data, "vault") ?? "");
      const direction = parseDirection(String(getOpt(data, "direction") ?? ""));
      const threshold = Number(getOpt(data, "price"));
      if (!isChainKey(chain) || !isAddress(vaultAddress) || !direction || !Number.isFinite(threshold)) {
        return messageResponse("Invalid arguments. chain must be ethereum, arbitrum, or base.");
      }
      const sub: TelegramSubscription = {
        id: shortId(),
        chatId: identity,
        kind: "price",
        direction,
        threshold,
        chain,
        vaultAddress,
        label: `${vaultAddress.slice(0, 8)}… share price (${chain})`,
        lastCrossed: false,
        createdAt: Date.now(),
      };
      const result = await addSubscription(sub);
      return messageResponse(
        result === "limit"
          ? "You've hit the 20-alert limit — remove one with /unwatch first."
          : result === "error"
          ? "Couldn't save that alert right now — try again."
          : `✅ Watching: share price ${direction} ${threshold} on ${sub.label}\nid: \`${sub.id}\``
      );
    }

    if (name === "watchapy") {
      const vaultId = String(getOpt(data, "vault") ?? "");
      const direction = parseDirection(String(getOpt(data, "direction") ?? ""));
      const threshold = Number(getOpt(data, "apy"));
      const vaultIds: string[] = VAULT_BASE.map((v) => v.id);
      if (!vaultIds.includes(vaultId) || !direction || !Number.isFinite(threshold)) {
        return messageResponse(`vault must be one of: ${vaultIds.join(", ")}`);
      }
      const vaultName = VAULT_BASE.find((v) => v.id === vaultId)?.name ?? vaultId;
      const sub: TelegramSubscription = {
        id: shortId(),
        chatId: identity,
        kind: "apy",
        direction,
        threshold,
        vaultId,
        label: `${vaultName} APY`,
        lastCrossed: false,
        createdAt: Date.now(),
      };
      const result = await addSubscription(sub);
      return messageResponse(
        result === "limit"
          ? "You've hit the 20-alert limit — remove one with /unwatch first."
          : result === "error"
          ? "Couldn't save that alert right now — try again."
          : `✅ Watching: ${sub.label} ${direction} ${threshold}%\nid: \`${sub.id}\`` +
            (VAULT_BASE.find((v) => v.id === vaultId)?.reference
              ? "\nℹ️ This vault's APY is a reference figure from Concrete's Earn page, not a live feed. For live movement use /watchprice with the vault address."
              : "")
      );
    }

    if (name === "watchct") {
      const direction = parseDirection(String(getOpt(data, "direction") ?? ""));
      const threshold = Number(getOpt(data, "price"));
      if (!direction || !Number.isFinite(threshold)) return messageResponse("Invalid arguments.");
      const sub: TelegramSubscription = {
        id: shortId(),
        chatId: identity,
        kind: "ct",
        direction,
        threshold,
        label: "$CT price",
        lastCrossed: false,
        createdAt: Date.now(),
      };
      const result = await addSubscription(sub);
      return messageResponse(
        result === "limit"
          ? "You've hit the 20-alert limit — remove one with /unwatch first."
          : result === "error"
          ? "Couldn't save that alert right now — try again."
          : `✅ Watching: $CT price ${direction} $${threshold}\nid: \`${sub.id}\``
      );
    }

    if (name === "myalerts") {
      const subs = await listSubscriptions(identity);
      if (!subs || subs.length === 0) return messageResponse("No active alerts. Use /watchprice, /watchapy, or /watchct.", undefined, true);
      const lines = subs.map((s) => `\`${s.id}\` — ${s.label} ${s.direction} ${s.threshold}${s.kind === "apy" ? "%" : s.kind === "ct" ? " USD" : ""}`);
      return messageResponse(`**Your alerts (${subs.length}):**\n${lines.join("\n")}`, undefined, true);
    }

    if (name === "unwatch") {
      const id = String(getOpt(data, "id") ?? "");
      if (!id) return messageResponse("Usage: /unwatch id:<id from /myalerts>");
      await removeSubscription(identity, id);
      return messageResponse(`Removed alert \`${id}\` (if it existed).`);
    }

    if (name === "stop") {
      await removeAllForChat(identity);
      return messageResponse("All your alerts have been removed.");
    }

    if (name === "link") {
      const wallet = String(getOpt(data, "wallet") ?? "");
      if (!isAddress(wallet)) return messageResponse("Usage: /link wallet:<0x address>", undefined, true);
      await setLinkedWallet(identity, wallet);
      return messageResponse(`✅ Linked wallet ${wallet.slice(0, 6)}…${wallet.slice(-4)}.\nNow /points and /myvaults use it automatically.`, undefined, true);
    }

    if (name === "unlink") {
      await clearLinkedWallet(identity);
      return messageResponse("Wallet unlinked.", undefined, true);
    }

    if (name === "points") {
      const wallet = String(getOpt(data, "wallet") ?? "") || (await getLinkedWallet(identity));
      if (!wallet || !isAddress(wallet)) return messageResponse("No wallet to check. /link one first, or pass wallet:<address>.", undefined, true);
      return defer(async (reply) => {
        try {
          const result = await getUserPoints(wallet);
          const parsed = parsePoints(result.raw);
          if (!parsed || parsed.totalAmount === null) {
            await reply(`No points record found for ${wallet.slice(0, 6)}…${wallet.slice(-4)} yet.`);
            return;
          }
          const lines = [`**Points — ${wallet.slice(0, 6)}…${wallet.slice(-4)}**`, `Balance: ${parsed.totalAmount.toLocaleString()}`];
          if (parsed.rank !== null) lines.push(`Leaderboard rank: #${parsed.rank.toLocaleString()}`);
          if (parsed.totalAttributions !== null) lines.push(`Attributions: ${parsed.totalAttributions}`);
          await reply(lines.join("\n"));
        } catch (err) {
          await reply(err instanceof FuulNotConfiguredError ? "Points lookup isn't configured on this deployment." : "Couldn't fetch points right now.");
        }
      }, true);
    }

    if (name === "myvaults") {
      const wallet = String(getOpt(data, "wallet") ?? "") || (await getLinkedWallet(identity));
      if (!wallet || !isAddress(wallet)) return messageResponse("No wallet to check. /link one first, or pass wallet:<address>.", undefined, true);
      return defer(async (reply) => {
        try {
          const positions = await getWalletVaultPositions(wallet);
          if (positions.length === 0) {
            await reply(`No open positions found for ${wallet.slice(0, 6)}…${wallet.slice(-4)}.`);
            return;
          }
          const lines = positions.map((p) => `• **${p.label}** (${p.chain})\n  ${p.sharesHeldFormatted} ${p.symbol ?? "shares"} ≈ ${p.underlyingValueFormatted} ${p.underlyingSymbol ?? ""}`);
          await reply(`**Vault positions — ${wallet.slice(0, 6)}…${wallet.slice(-4)}**\n\n${lines.join("\n")}`);
        } catch {
          await reply("Couldn't read vault positions right now.");
        }
      }, true);
    }

    if (name === "lang") {
      const code = String(getOpt(data, "code") ?? "").toLowerCase();
      if (!isLocale(code)) return messageResponse(`Usage: /lang code:<${locales.join("|")}>`);
      await setChatLocale(identity, code);
      return messageResponse(`✅ Language set to ${localeNames[code]}. /docs will use it from now on.`);
    }

    if (name === "docs") {
      const n = getOpt(data, "number");
      if (n === undefined) {
        const lines = [`**Concrete Guide docs (${ALL_DOCS.length})**`, "Run /docs number:<n> to read one."];
        let lastSection = "";
        ALL_DOCS.forEach((doc, i) => {
          if (doc.section !== lastSection) {
            lines.push(`\n**${doc.section}**`);
            lastSection = doc.section;
          }
          lines.push(`${i + 1}. ${doc.title}`);
        });
        return messageResponse(lines.join("\n").slice(0, 1900));
      }
      const idx = Number(n);
      const doc = idx >= 1 && idx <= ALL_DOCS.length ? ALL_DOCS[idx - 1] : null;
      if (!doc) return messageResponse(`No doc #${n}. Run /docs to see the numbered list.`);
      // Doc pages can span several messages and need the (large) translations
      // bundle, so answer instantly and post the pages in the background.
      return defer(async (reply) => {
        const localeStored = await getChatLocale(identity);
        const locale: Locale = localeStored && isLocale(localeStored) ? localeStored : defaultLocale;
        const { renderDocToDiscordChunks } = await import("@/lib/discordFormat");
        const chunks = renderDocToDiscordChunks(doc, locale);
        for (const chunk of chunks) await reply(chunk);
      });
    }

    if (name === "quiz") {
      const level = getOpt(data, "level");
      if (level === undefined) {
        const lines = [`**Concrete Guide Quiz**`, "Run /quiz level:<id> to start.\n"];
        for (const batch of QUIZ_BATCHES) lines.push(`**${batch.id}** — ${batch.title} (${batch.questions.length}Q)\n${batch.tagline}`);
        return messageResponse(lines.join("\n\n").slice(0, 1900));
      }
      const batch = QUIZ_BATCHES.find((b) => b.id === String(level));
      if (!batch) return messageResponse(`No quiz level "${level}". Run /quiz with no arguments to see the list.`);
      await startQuizSession(identity, batch.id);
      const first = questionMessage(batch, 0);
      return messageResponse(first.content, first.components);
    }

    if (name === "quizrank") {
      const top = await getTop(10);
      if (top.length === 0) return messageResponse("No quiz scores yet — be the first with /quiz.");
      const lines = top.map((r) => `${r.rank}. ${r.name} — ${r.weightedScore} pts (${r.tierKey})`);
      return messageResponse(`**Quiz leaderboard**\n${lines.join("\n")}`);
    }

    return messageResponse("Unrecognized command.");
  } catch {
    return messageResponse("Something went wrong handling that — try again in a moment.");
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "This endpoint expects Discord interaction POSTs. See /developers for setup." });
}
