// Server-side storage for the Telegram bot's /quiz flow. Same Upstash/
// Vercel KV REST pattern as telegramStore.ts and quizLeaderboardStore.ts —
// reads the same env vars, nothing new to configure.
//
// Two pieces of state per chat:
//  - a short-lived "session" (which batch, which question, running streak)
//    for the quiz currently in progress — expires on its own if abandoned.
//  - a durable "best per batch" map, so a chat's all-time leaderboard score
//    reflects its best-ever run of each level, same rule the website's
//    localStorage-backed version uses (see lib/quiz.ts).

type Cmd = Array<string | number>;

function redisCfg(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
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

export type TelegramQuizSession = {
  batchId: string;
  qIndex: number; // 0-based index into that batch's questions
  correct: number; // correct answers so far this run
  streak: number; // current consecutive-correct streak this run
  startedAt: number;
};

const SESSION_TTL_SECONDS = 1800; // abandoned sessions expire after 30 min
const sessionKey = (chatId: string) => `tg:quiz:session:${chatId}`;
const bestKey = (chatId: string) => `tg:quiz:best:${chatId}`;

export async function startSession(chatId: string, batchId: string): Promise<boolean> {
  const session: TelegramQuizSession = { batchId, qIndex: 0, correct: 0, streak: 0, startedAt: Date.now() };
  const out = await pipeline([["SET", sessionKey(chatId), JSON.stringify(session), "EX", String(SESSION_TTL_SECONDS)]]);
  return out !== null;
}

export async function getSession(chatId: string): Promise<TelegramQuizSession | null> {
  const out = await pipeline([["GET", sessionKey(chatId)]]);
  const raw = out?.[0]?.result as string | null | undefined;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TelegramQuizSession;
  } catch {
    return null;
  }
}

export async function saveSession(chatId: string, session: TelegramQuizSession): Promise<boolean> {
  const out = await pipeline([["SET", sessionKey(chatId), JSON.stringify(session), "EX", String(SESSION_TTL_SECONDS)]]);
  return out !== null;
}

export async function clearSession(chatId: string): Promise<boolean> {
  const out = await pipeline([["DEL", sessionKey(chatId)]]);
  return out !== null;
}

export async function getBestByBatch(chatId: string): Promise<Record<string, number>> {
  const out = await pipeline([["GET", bestKey(chatId)]]);
  const raw = out?.[0]?.result as string | null | undefined;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

/** Records this run's correct count against the batch's all-time best (max, never decreases). Returns the updated map. */
export async function recordBest(chatId: string, batchId: string, correct: number): Promise<Record<string, number>> {
  const best = await getBestByBatch(chatId);
  best[batchId] = Math.max(best[batchId] ?? 0, correct);
  await pipeline([["SET", bestKey(chatId), JSON.stringify(best)]]);
  return best;
}
