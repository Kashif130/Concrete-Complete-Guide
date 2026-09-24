// Server-side storage for Telegram alert subscriptions. Same Upstash/
// Vercel KV REST pattern as lib/quizLeaderboardStore.ts and
// lib/reviewsStore.ts — reads the same env vars, nothing new to
// configure if one of those is already set up.
//
// Unlike /api/alert-check (deliberately stateless, re-fires every check —
// see the comment at the top of that route), subscriptions here track
// `lastCrossed` so a message only sends on the transition into a crossed
// state, not on every cron tick while it stays crossed.

export type SubKind = "price" | "apy" | "ct";
export type Direction = "above" | "below";

export type TelegramSubscription = {
  id: string;
  chatId: string;
  kind: SubKind;
  direction: Direction;
  threshold: number;
  label: string; // human-readable, shown in /myalerts and in alert messages
  chain?: string; // kind: "price"
  vaultAddress?: string; // kind: "price"
  vaultId?: string; // kind: "apy" — one of VAULT_BASE's ids
  lastCrossed: boolean;
  createdAt: number;
};

type Cmd = Array<string | number>;

function redisCfg(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

export function telegramStorageConfigured(): boolean {
  return redisCfg() !== null;
}

async function pipeline(cmds: Cmd[]): Promise<Array<{ result?: unknown; error?: string }> | null> {
  const cfg = redisCfg();
  if (!cfg) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${cfg.token}`, "content-type": "application/json" },
      body: JSON.stringify(cmds),
    });
    if (!res.ok) return null;
    return (await res.json()) as Array<{ result?: unknown; error?: string }>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const CHATS_SET = "tg:chats";
const subsKey = (chatId: string) => `tg:subs:${chatId}`;

const MAX_PER_CHAT = 20;

export async function addSubscription(sub: TelegramSubscription): Promise<"ok" | "limit" | "error"> {
  const existing = await listSubscriptions(sub.chatId);
  if (existing !== null && existing.length >= MAX_PER_CHAT) return "limit";
  const out = await pipeline([
    ["HSET", subsKey(sub.chatId), sub.id, JSON.stringify(sub)],
    ["SADD", CHATS_SET, sub.chatId],
  ]);
  return out !== null ? "ok" : "error";
}

export async function listSubscriptions(chatId: string): Promise<TelegramSubscription[] | null> {
  const out = await pipeline([["HGETALL", subsKey(chatId)]]);
  if (out === null) return null;
  const flat = (out[0]?.result as string[] | undefined) ?? [];
  const subs: TelegramSubscription[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    try {
      subs.push(JSON.parse(flat[i + 1]) as TelegramSubscription);
    } catch {
      // skip malformed entry
    }
  }
  return subs.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeSubscription(chatId: string, id: string): Promise<boolean> {
  const out = await pipeline([["HDEL", subsKey(chatId), id]]);
  if (out === null) return false;
  const remaining = await listSubscriptions(chatId);
  if (remaining && remaining.length === 0) {
    await pipeline([["SREM", CHATS_SET, chatId]]);
  }
  return true;
}

export async function removeAllForChat(chatId: string): Promise<boolean> {
  const out = await pipeline([
    ["DEL", subsKey(chatId)],
    ["SREM", CHATS_SET, chatId],
  ]);
  return out !== null;
}

export async function listAllChatIds(): Promise<string[]> {
  const out = await pipeline([["SMEMBERS", CHATS_SET]]);
  return (out?.[0]?.result as string[] | undefined) ?? [];
}

/** Rewrites one subscription's lastCrossed flag in place. */
export async function setLastCrossed(sub: TelegramSubscription, crossed: boolean): Promise<void> {
  await pipeline([["HSET", subsKey(sub.chatId), sub.id, JSON.stringify({ ...sub, lastCrossed: crossed })]]);
}

// --- Website → Telegram linking ------------------------------------------
// Telegram has no concept of "username" you can just message — the bot only
// gets a chat_id once the user opens a chat with it. So the website can't
// subscribe someone directly; it stages the alert here under a short-lived
// code, then sends the person to a `t.me/<bot>?start=<code>` deep link. When
// they tap it, Telegram auto-sends "/start <code>" to the bot, which resolves
// the code back to this pending alert and finally has a real chat_id to save.

export type PendingAlert = {
  kind: SubKind;
  direction: Direction;
  threshold: number;
  label: string;
  chain?: string;
  vaultAddress?: string;
  vaultId?: string;
};

const PENDING_TTL_SECONDS = 600; // link code is valid for 10 minutes
const pendingKey = (code: string) => `tg:pending:${code}`;

export async function createPendingLink(code: string, alert: PendingAlert): Promise<boolean> {
  const out = await pipeline([["SET", pendingKey(code), JSON.stringify(alert), "EX", String(PENDING_TTL_SECONDS)]]);
  return out !== null;
}

/** One-time read: fetches and deletes the pending alert atomically (GETDEL), so a code can't be replayed. */
export async function consumePendingLink(code: string): Promise<PendingAlert | null> {
  const out = await pipeline([["GETDEL", pendingKey(code)]]);
  if (out === null) return null;
  const raw = out[0]?.result as string | null | undefined;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingAlert;
  } catch {
    return null;
  }
}

// --- Per-chat wallet link ---------------------------------------------------
// Separate from the alert subscriptions above: one wallet address remembered
// per chat, set with /link, so /points and /myvaults don't need the address
// re-typed on every call. Deliberately just one wallet at a time — /link
// again overwrites it. Not a proof of ownership, just a convenience the user
// typed in themselves (same trust model as pasting a wallet into the
// website's own points/vault lookup boxes).

const walletKey = (chatId: string) => `tg:wallet:${chatId}`;

export async function setLinkedWallet(chatId: string, wallet: string): Promise<boolean> {
  const out = await pipeline([["SET", walletKey(chatId), wallet]]);
  return out !== null;
}

export async function getLinkedWallet(chatId: string): Promise<string | null> {
  const out = await pipeline([["GET", walletKey(chatId)]]);
  if (out === null) return null;
  return (out[0]?.result as string | null | undefined) ?? null;
}

export async function clearLinkedWallet(chatId: string): Promise<boolean> {
  const out = await pipeline([["DEL", walletKey(chatId)]]);
  return out !== null;
}

// --- Per-chat language preference -------------------------------------------
// Set with /lang, read by /docs so translated docs come back in the chat's
// preferred language without it being retyped on every call. Falls back to
// English wherever a doc has no translation for the chosen locale yet.

const localeKeyFor = (chatId: string) => `tg:locale:${chatId}`;

export async function setChatLocale(chatId: string, locale: string): Promise<boolean> {
  const out = await pipeline([["SET", localeKeyFor(chatId), locale]]);
  return out !== null;
}

export async function getChatLocale(chatId: string): Promise<string | null> {
  const out = await pipeline([["GET", localeKeyFor(chatId)]]);
  if (out === null) return null;
  return (out[0]?.result as string | null | undefined) ?? null;
}
