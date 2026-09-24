import { NextRequest, NextResponse } from "next/server";
import type { ChainKey } from "@/lib/chains";
import { readVaultSharePrice } from "@/lib/vaultSharePrice";
import { sendTelegramMessage, telegramConfigured } from "@/lib/telegram";
import { sendDiscordDM, discordConfigured } from "@/lib/discordApi";
import {
  listAllChatIds,
  listSubscriptions,
  setLastCrossed,
  telegramStorageConfigured,
  type TelegramSubscription,
} from "@/lib/telegramStore";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// This mirrors /api/alert-check's own "no background cron" situation —
// see the comment there. Point a free external cron (cron-job.org,
// EasyCron, a GitHub Actions schedule, etc.) at this URL every few
// minutes. If TELEGRAM_CRON_SECRET is set, callers must pass it as
// ?secret=... or the check is refused — keeps randoms from spamming this
// (rate-limited but still costs RPC/API calls) without you needing to
// keep the URL itself secret.
function secretOk(req: NextRequest): boolean {
  const required = process.env.TELEGRAM_CRON_SECRET;
  if (!required) return true;
  return new URL(req.url).searchParams.get("secret") === required;
}

function crossed(sub: TelegramSubscription, value: number | null): boolean {
  if (value === null) return false;
  return sub.direction === "above" ? value >= sub.threshold : value <= sub.threshold;
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!telegramStorageConfigured()) {
    return NextResponse.json({
      status: "not_configured",
      message: "Set KV_REST_API_URL/TOKEN (or UPSTASH_REDIS_REST_URL/TOKEN) to enable alerts.",
    });
  }
  const canTelegram = telegramConfigured();
  const canDiscord = discordConfigured();
  if (!secretOk(req)) {
    return NextResponse.json({ status: "error", message: "Invalid or missing secret." }, { status: 401 });
  }

  const origin = new URL(req.url).origin;

  const chatIds = await listAllChatIds();
  const allSubs: TelegramSubscription[] = [];
  for (const chatId of chatIds) {
    const subs = await listSubscriptions(chatId);
    if (subs) allSubs.push(...subs);
  }

  if (allSubs.length === 0) {
    return NextResponse.json({ status: "ok", checked: 0, notified: 0 });
  }

  // Fetch each distinct data source once, not once per subscription.
  const priceSubs = allSubs.filter((s) => s.kind === "price" && s.chain && s.vaultAddress);
  const apySubs = allSubs.filter((s) => s.kind === "apy" && s.vaultId);
  const ctSubs = allSubs.filter((s) => s.kind === "ct");

  const priceCache = new Map<string, number | null>();
  for (const s of priceSubs) {
    const key = `${s.chain}:${s.vaultAddress!.toLowerCase()}`;
    if (!priceCache.has(key)) {
      try {
        priceCache.set(key, await readVaultSharePrice(s.chain as ChainKey, s.vaultAddress!));
      } catch {
        priceCache.set(key, null);
      }
    }
  }

  let apyByVault: Record<string, number> | null = null;
  if (apySubs.length > 0) {
    const market = await fetchJson(`${origin}/api/market`);
    if (market?.vaults) {
      apyByVault = {};
      for (const [id, v] of Object.entries<any>(market.vaults)) apyByVault[id] = v.apy;
    }
  }

  let ctPriceUsd: number | null = null;
  if (ctSubs.length > 0) {
    const ct = await fetchJson(`${origin}/api/ct-price`);
    if (ct?.trading) ctPriceUsd = ct.usd;
  }

  let notified = 0;
  for (const sub of allSubs) {
    let value: number | null = null;
    if (sub.kind === "price" && sub.chain && sub.vaultAddress) {
      value = priceCache.get(`${sub.chain}:${sub.vaultAddress.toLowerCase()}`) ?? null;
    } else if (sub.kind === "apy" && sub.vaultId) {
      value = apyByVault?.[sub.vaultId] ?? null;
    } else if (sub.kind === "ct") {
      value = ctPriceUsd;
    }

    const isCrossed = crossed(sub, value);
    if (isCrossed && !sub.lastCrossed) {
      const unit = sub.kind === "apy" ? "%" : sub.kind === "ct" ? " USD" : "";
      const valueStr = value?.toFixed(4) ?? "";
      const isDiscord = sub.chatId.startsWith("discord:");
      let sent = false;
      if (isDiscord && canDiscord) {
        const discordUserId = sub.chatId.slice("discord:".length);
        const msg = `🔔 **Alert triggered**\n${sub.label}: now **${valueStr}${unit}** (${sub.direction} ${sub.threshold}${unit})`;
        sent = await sendDiscordDM(discordUserId, msg);
      } else if (!isDiscord && canTelegram) {
        const msg = `🔔 <b>Alert triggered</b>\n${sub.label}: now <b>${valueStr}${unit}</b> (${sub.direction} ${sub.threshold}${unit})`;
        sent = await sendTelegramMessage(sub.chatId, msg);
      }
      if (sent) {
        await setLastCrossed(sub, true);
        notified++;
      }
    } else if (!isCrossed && sub.lastCrossed) {
      // Reset silently so it can fire again on the next real crossing.
      await setLastCrossed(sub, false);
    }
  }

  return NextResponse.json({ status: "ok", checked: allSubs.length, notified });
}
