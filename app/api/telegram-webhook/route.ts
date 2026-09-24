import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { isChainKey } from "@/lib/chains";
import { VAULT_BASE } from "@/lib/vault/data";
import { sendTelegramMessage, telegramConfigured } from "@/lib/telegram";
import { getUserPoints, FuulNotConfiguredError } from "@/lib/fuul";
import { parsePoints } from "@/lib/points";
import { getWalletVaultPositions } from "@/lib/vaultPositions";
import { docs as ALL_DOCS } from "@/content/docs.generated";
import { renderDocToChunks } from "@/lib/docsText";
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
  consumePendingLink,
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

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const VAULT_IDS = VAULT_BASE.map((v) => v.id);

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

const HELP = `<b>Concrete Guide alerts bot</b>
Watches vault share prices, the Vault Terminal's modeled APY, and $CT price — pings you here the moment a threshold is crossed.

<b>Commands</b>
/watchprice &lt;chain&gt; &lt;vault_address&gt; &lt;above|below&gt; &lt;price&gt;
  e.g. /watchprice ethereum 0x0e609b710da5e0aa476224b6c0e5445ccc21251e above 1.05
/watchapy &lt;vault&gt; &lt;above|below&gt; &lt;apy&gt;
  vault is one of: ${VAULT_IDS.join(", ")}
  e.g. /watchapy ctusd below 6
/watchct &lt;above|below&gt; &lt;usd_price&gt;
  e.g. /watchct above 1.00
/myalerts — list your active alerts
/unwatch &lt;id&gt; — remove one alert (id shown in /myalerts)
/stop — remove all your alerts

<b>Wallet</b>
/link &lt;wallet_address&gt; — remember a wallet for this chat
/unlink — forget it
/points [wallet] — points balance + leaderboard rank (uses linked wallet if omitted)
/myvaults [wallet] — your live positions across every known Concrete vault

<b>Docs</b> (${ALL_DOCS.length} pages, ${locales.length} languages)
/lang &lt;code&gt; — set your language: ${locales.join(", ")}
/docs — list every doc
/docs &lt;number&gt; — read one, e.g. /docs 1

<b>Quiz</b>
/quiz — list levels
/quiz &lt;level_id&gt; — start a level, then just reply A/B/C/D
/quizrank — top 10 leaderboard

/help — show this message

You'll only get a message when a threshold is <i>newly</i> crossed, not on every check.`;

function parseDirection(s: string | undefined): Direction | null {
  if (s === "above" || s === "below") return s;
  return null;
}

async function reply(chatId: number | string, text: string) {
  await sendTelegramMessage(chatId, text);
}

async function replyChunks(chatId: number | string, chunks: string[]) {
  for (const chunk of chunks) {
    await sendTelegramMessage(chatId, chunk);
  }
}

function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

const SECTION_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  ecosystem: "Ecosystem",
  reference: "Reference",
};

function docsListText(): string {
  const lines = [`<b>Concrete Guide docs (${ALL_DOCS.length})</b>`, "Send /docs &lt;number&gt; to read one."];
  let lastSection = "";
  ALL_DOCS.forEach((doc, i) => {
    if (doc.section !== lastSection) {
      lines.push(`\n<b>${SECTION_LABELS[doc.section] ?? doc.section}</b>`);
      lastSection = doc.section;
    }
    lines.push(`${i + 1}. ${doc.title}`);
  });
  return lines.join("\n");
}

function quizListText(): string {
  const lines = [`<b>Concrete Guide Quiz</b>`, "Send /quiz &lt;level_id&gt; to start, e.g. /quiz beginner\n"];
  for (const batch of QUIZ_BATCHES) {
    lines.push(`<b>${batch.id}</b> — ${batch.title} (${batch.questions.length}Q)\n${batch.tagline}`);
  }
  return lines.join("\n\n");
}

function questionText(batch: (typeof QUIZ_BATCHES)[number], qIndex: number): string {
  const q = batch.questions[qIndex];
  const letters = ["A", "B", "C", "D", "E", "F"];
  const options = q.options.map((opt, i) => `${letters[i]}) ${opt}`).join("\n");
  return `<b>${batch.title}</b> — Q${qIndex + 1}/${batch.questions.length}\n${q.prompt}\n\n${options}\n\nReply with the letter.`;
}

export async function POST(req: NextRequest) {
  if (!telegramConfigured() || !telegramStorageConfigured()) {
    // No token/storage configured on this deployment — accept the webhook
    // silently (Telegram retries on non-2xx) but do nothing.
    return NextResponse.json({ ok: true });
  }

  let update: any;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update?.message;
  const chatId: number | undefined = message?.chat?.id;
  const text: string | undefined = message?.text;
  if (!chatId || typeof text !== "string") {
    return NextResponse.json({ ok: true });
  }

  const parts = text.trim().split(/\s+/);
  const cmd = (parts[0] || "").toLowerCase().replace(/@\w+$/, ""); // strip @BotName in group chats

  try {
    if (cmd === "/start" && parts[1]) {
      const pending = await consumePendingLink(parts[1]);
      if (!pending) {
        await reply(chatId, "That link has expired or was already used — go back to the website and generate a new one.");
      } else {
        const sub: TelegramSubscription = {
          id: shortId(),
          chatId: String(chatId),
          lastCrossed: false,
          createdAt: Date.now(),
          ...pending,
        };
        const result = await addSubscription(sub);
        if (result === "limit") {
          await reply(chatId, "You've hit the 20-alert limit per chat — remove one with /unwatch first.");
        } else if (result === "error") {
          await reply(chatId, "Couldn't save that alert right now — try again in a moment.");
        } else {
          await reply(
            chatId,
            `✅ Linked! Watching: ${sub.label} ${sub.direction} ${sub.threshold}${sub.kind === "apy" ? "%" : sub.kind === "ct" ? " USD" : ""}\nid: <code>${sub.id}</code>`
          );
        }
      }
    } else if (cmd === "/start" || cmd === "/help") {
      await reply(chatId, HELP);
    } else if (cmd === "/watchprice") {
      const [, chain, vaultAddress, dir, priceStr] = parts;
      const direction = parseDirection(dir);
      const threshold = Number(priceStr);
      if (!chain || !isChainKey(chain) || !vaultAddress || !isAddress(vaultAddress) || !direction || !Number.isFinite(threshold)) {
        await reply(
          chatId,
          "Usage: /watchprice &lt;chain&gt; &lt;vault_address&gt; &lt;above|below&gt; &lt;price&gt;\nchain is ethereum, arbitrum, or base."
        );
      } else {
        const sub: TelegramSubscription = {
          id: shortId(),
          chatId: String(chatId),
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
        if (result === "limit") {
          await reply(chatId, "You've hit the 20-alert limit per chat — remove one with /unwatch first.");
        } else if (result === "error") {
          await reply(chatId, "Couldn't save that alert right now — try again in a moment.");
        } else {
          await reply(chatId, `✅ Watching: share price ${direction} ${threshold} on ${sub.label}\nid: <code>${sub.id}</code>`);
        }
      }
    } else if (cmd === "/watchapy") {
      const [, vaultId, dir, apyStr] = parts;
      const direction = parseDirection(dir);
      const threshold = Number(apyStr);
      if (!vaultId || !VAULT_IDS.includes(vaultId as any) || !direction || !Number.isFinite(threshold)) {
        await reply(chatId, `Usage: /watchapy &lt;vault&gt; &lt;above|below&gt; &lt;apy&gt;\nvault is one of: ${VAULT_IDS.join(", ")}`);
      } else {
        const vaultName = VAULT_BASE.find((v) => v.id === vaultId)?.name ?? vaultId;
        const sub: TelegramSubscription = {
          id: shortId(),
          chatId: String(chatId),
          kind: "apy",
          direction,
          threshold,
          vaultId,
          label: `${vaultName} APY`,
          lastCrossed: false,
          createdAt: Date.now(),
        };
        const result = await addSubscription(sub);
        if (result === "limit") {
          await reply(chatId, "You've hit the 20-alert limit per chat — remove one with /unwatch first.");
        } else if (result === "error") {
          await reply(chatId, "Couldn't save that alert right now — try again in a moment.");
        } else {
          await reply(chatId, `✅ Watching: ${sub.label} ${direction} ${threshold}%\nid: <code>${sub.id}</code>`);
        }
      }
    } else if (cmd === "/watchct") {
      const [, dir, priceStr] = parts;
      const direction = parseDirection(dir);
      const threshold = Number(priceStr);
      if (!direction || !Number.isFinite(threshold)) {
        await reply(chatId, "Usage: /watchct &lt;above|below&gt; &lt;usd_price&gt;");
      } else {
        const sub: TelegramSubscription = {
          id: shortId(),
          chatId: String(chatId),
          kind: "ct",
          direction,
          threshold,
          label: "$CT price",
          lastCrossed: false,
          createdAt: Date.now(),
        };
        const result = await addSubscription(sub);
        if (result === "limit") {
          await reply(chatId, "You've hit the 20-alert limit per chat — remove one with /unwatch first.");
        } else if (result === "error") {
          await reply(chatId, "Couldn't save that alert right now — try again in a moment.");
        } else {
          await reply(
            chatId,
            `✅ Watching: $CT price ${direction} $${threshold}\nid: <code>${sub.id}</code>\nNote: $CT has no TGE yet — this fires the moment CoinGecko starts pricing it and the threshold is met.`
          );
        }
      }
    } else if (cmd === "/myalerts") {
      const subs = await listSubscriptions(String(chatId));
      if (!subs || subs.length === 0) {
        await reply(chatId, "No active alerts. Use /watchprice, /watchapy, or /watchct to add one.");
      } else {
        const lines = subs.map(
          (s) => `<code>${s.id}</code> — ${s.label} ${s.direction} ${s.threshold}${s.kind === "apy" ? "%" : s.kind === "ct" ? " USD" : ""}`
        );
        await reply(chatId, `<b>Your alerts (${subs.length}):</b>\n${lines.join("\n")}`);
      }
    } else if (cmd === "/unwatch") {
      const id = parts[1];
      if (!id) {
        await reply(chatId, "Usage: /unwatch &lt;id&gt; — get the id from /myalerts.");
      } else {
        await removeSubscription(String(chatId), id);
        await reply(chatId, `Removed alert <code>${id}</code> (if it existed).`);
      }
    } else if (cmd === "/stop") {
      await removeAllForChat(String(chatId));
      await reply(chatId, "All your alerts have been removed.");
    } else if (cmd === "/link") {
      const wallet = parts[1];
      if (!wallet || !isAddress(wallet)) {
        await reply(chatId, "Usage: /link &lt;wallet_address&gt;\ne.g. /link 0xabc...123");
      } else {
        await setLinkedWallet(String(chatId), wallet);
        await reply(
          chatId,
          `✅ Linked wallet ${wallet.slice(0, 6)}…${wallet.slice(-4)} to this chat.\nNow /points and /myvaults will use it automatically.`
        );
      }
    } else if (cmd === "/unlink") {
      await clearLinkedWallet(String(chatId));
      await reply(chatId, "Wallet unlinked from this chat.");
    } else if (cmd === "/points") {
      const wallet = parts[1] || (await getLinkedWallet(String(chatId)));
      if (!wallet || !isAddress(wallet)) {
        await reply(
          chatId,
          "No wallet to check. Either /link &lt;wallet_address&gt; once, or send /points &lt;wallet_address&gt;."
        );
      } else {
        try {
          const result = await getUserPoints(wallet);
          const parsed = parsePoints(result.raw);
          if (!parsed || parsed.totalAmount === null) {
            await reply(chatId, `No points record found for ${wallet.slice(0, 6)}…${wallet.slice(-4)} yet.`);
          } else {
            const lines = [
              `<b>Points — ${wallet.slice(0, 6)}…${wallet.slice(-4)}</b>`,
              `Balance: ${parsed.totalAmount.toLocaleString()}`,
            ];
            if (parsed.rank !== null) lines.push(`Leaderboard rank: #${parsed.rank.toLocaleString()}`);
            if (parsed.totalAttributions !== null) lines.push(`Attributions: ${parsed.totalAttributions}`);
            await reply(chatId, lines.join("\n"));
          }
        } catch (err) {
          if (err instanceof FuulNotConfiguredError) {
            await reply(chatId, "Points lookup isn't configured on this deployment (missing FUUL_API_KEY).");
          } else {
            await reply(chatId, "Couldn't fetch points right now — try again in a moment.");
          }
        }
      }
    } else if (cmd === "/myvaults") {
      const wallet = parts[1] || (await getLinkedWallet(String(chatId)));
      if (!wallet || !isAddress(wallet)) {
        await reply(
          chatId,
          "No wallet to check. Either /link &lt;wallet_address&gt; once, or send /myvaults &lt;wallet_address&gt;."
        );
      } else {
        try {
          const positions = await getWalletVaultPositions(wallet);
          if (positions.length === 0) {
            await reply(chatId, `No open positions found for ${wallet.slice(0, 6)}…${wallet.slice(-4)} in any known Concrete vault.`);
          } else {
            const lines = positions.map(
              (p) =>
                `• <b>${p.label}</b> (${p.chain})\n  ${p.sharesHeldFormatted} ${p.symbol ?? "shares"} ≈ ${p.underlyingValueFormatted} ${p.underlyingSymbol ?? ""}`
            );
            await reply(chatId, `<b>Vault positions — ${wallet.slice(0, 6)}…${wallet.slice(-4)}</b>\n\n${lines.join("\n")}`);
          }
        } catch {
          await reply(chatId, "Couldn't read vault positions right now — try again in a moment.");
        }
      }
    } else if (cmd === "/lang") {
      const code = (parts[1] || "").toLowerCase();
      if (!code || !isLocale(code)) {
        await reply(
          chatId,
          `Usage: /lang &lt;code&gt;\n${locales.map((l) => `${l} — ${localeNames[l]}`).join("\n")}`
        );
      } else {
        await setChatLocale(String(chatId), code);
        await reply(chatId, `✅ Language set to ${localeNames[code]}. /docs will use it from now on.`);
      }
    } else if (cmd === "/docs" && !parts[1]) {
      await reply(chatId, docsListText());
    } else if (cmd === "/docs") {
      const arg = parts[1];
      const n = Number(arg);
      const doc =
        Number.isInteger(n) && n >= 1 && n <= ALL_DOCS.length
          ? ALL_DOCS[n - 1]
          : ALL_DOCS.find((d) => d.slug === arg || d.slug.endsWith(`/${arg}`));
      if (!doc) {
        await reply(chatId, `No doc matches "${arg}". Send /docs to see the numbered list.`);
      } else {
        const localeStored = await getChatLocale(String(chatId));
        const locale: Locale = localeStored && isLocale(localeStored) ? localeStored : defaultLocale;
        const chunks = renderDocToChunks(doc, locale);
        await replyChunks(chatId, chunks);
      }
    } else if (cmd === "/quiz" && !parts[1]) {
      await reply(chatId, quizListText());
    } else if (cmd === "/quiz") {
      const batchId = parts[1];
      const batch = QUIZ_BATCHES.find((b) => b.id === batchId);
      if (!batch) {
        await reply(chatId, `No quiz level "${batchId}". Send /quiz to see the list.`);
      } else {
        await startQuizSession(String(chatId), batch.id);
        await reply(chatId, questionText(batch, 0));
      }
    } else if (/^\/?answer\s*([a-fA-F])$/i.test(text.trim()) || /^[a-fA-F]$/.test(text.trim())) {
      const m = /^\/?answer\s*([a-fA-F])$/i.exec(text.trim()) || /^([a-fA-F])$/.exec(text.trim());
      const letter = (m?.[1] ?? "").toUpperCase();
      const session = await getQuizSession(String(chatId));
      const batch = session ? QUIZ_BATCHES.find((b) => b.id === session.batchId) : null;
      if (!session || !batch) {
        await reply(chatId, "No active quiz. Send /quiz to see the levels.");
      } else {
        const q = batch.questions[session.qIndex];
        const pickedIndex = letter.charCodeAt(0) - 65;
        const isCorrect = pickedIndex === q.correctIndex;
        const letters = ["A", "B", "C", "D", "E", "F"];
        const feedback = isCorrect
          ? "✅ Correct!"
          : `❌ Not quite — correct answer: <b>${letters[q.correctIndex]}) ${q.options[q.correctIndex]}</b>`;
        await reply(chatId, `${feedback}\n${q.explanation}`);

        const nextIndex = session.qIndex + 1;
        const correct = session.correct + (isCorrect ? 1 : 0);
        const streak = isCorrect ? session.streak + 1 : 0;

        if (nextIndex >= batch.questions.length) {
          await clearQuizSession(String(chatId));
          const bestMap = await recordQuizBest(String(chatId), batch.id, correct);
          const { weightedScore, totalCorrect } = scoreFromBestByBatch(bestMap);
          const tier = tierForScore(totalCorrect);
          const name = message?.from?.username || message?.from?.first_name || `chat-${chatId}`;
          await submitScore({
            clientId: `tg:${chatId}`,
            name: String(name).slice(0, 24),
            weightedScore,
            totalCorrect,
            tierKey: tier.key,
            streak,
            updatedAt: Date.now(),
          }).catch(() => {});
          await reply(
            chatId,
            `🏁 <b>${batch.title}</b> finished: ${correct}/${batch.questions.length} correct.\n${tier.emoji} Tier: ${tier.label} (${totalCorrect} correct all-time)\nSend /quiz for another level, or /quizrank for the leaderboard.`
          );
        } else {
          await saveQuizSession(String(chatId), { ...session, qIndex: nextIndex, correct, streak });
          await reply(chatId, questionText(batch, nextIndex));
        }
      }
    } else if (cmd === "/quizrank") {
      const top = await getTop(10);
      if (top.length === 0) {
        await reply(chatId, "No quiz scores yet — be the first with /quiz.");
      } else {
        const lines = top.map((r) => `${r.rank}. ${r.name} — ${r.weightedScore} pts (${r.tierKey})`);
        await reply(chatId, `<b>Quiz leaderboard</b>\n${lines.join("\n")}`);
      }
    } else {
      await reply(chatId, "Unrecognized command. Send /help to see what I can do.");
    }
  } catch {
    // Never let a malformed update or a downstream failure surface as a
    // 500 to Telegram (it'll just keep retrying the same bad update).
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "This endpoint expects Telegram webhook POSTs. See /developers for setup.",
  });
}
