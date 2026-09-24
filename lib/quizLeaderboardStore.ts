// Server-side storage for the quiz leaderboard. Same REST-Redis approach as
// lib/help/store.ts (Vercel KV or Upstash Redis over REST — no client
// package, works on Edge/serverless alike), and deliberately reads the same
// env vars that module already looks for (KV_REST_API_URL/TOKEN or
// UPSTASH_REDIS_REST_URL/TOKEN) so nothing new has to be configured if
// that's already set up for the help-bot. Without it, callers get
// `quizStorageConfigured() === false` and should degrade gracefully.

import { QUIZ_BATCHES } from "@/content/quiz";

type Cmd = Array<string | number>;

function redisCfg(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

export function quizStorageConfigured(): boolean {
  return redisCfg() !== null;
}

async function pipeline(cmds: Cmd[]): Promise<Array<{ result?: unknown; error?: string }> | null> {
  const cfg = redisCfg();
  if (!cfg) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
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

const ZSET_KEY = "quiz:leaderboard";
const META_PREFIX = "quiz:lb:meta:"; // + clientId -> JSON blob

export type QuizLeaderboardEntry = {
  clientId: string;
  name: string;
  weightedScore: number;
  totalCorrect: number;
  tierKey: string;
  streak: number;
  updatedAt: number;
};

export type QuizLeaderboardRow = {
  rank: number;
  name: string;
  weightedScore: number;
  totalCorrect: number;
  tierKey: string;
  streak: number;
};

const MAX_POSSIBLE_CORRECT = QUIZ_BATCHES.reduce((s, b) => s + b.questions.length, 0);
const MAX_POSSIBLE_WEIGHTED = QUIZ_BATCHES.reduce((s, b) => s + b.questions.length * b.level, 0);

/**
 * Anti-cheat core: recomputes weightedScore/totalCorrect server-side from a
 * client-submitted `{batchId: bestCorrect}` map, clamping every batch's
 * count to that batch's real question count and its weight to the real
 * batch level (pulled from content/quiz.ts, not the client). A spoofed
 * client can inflate individual batch counts but can never submit more
 * than the real question bank allows in total.
 */
export function scoreFromBestByBatch(
  bestByBatch: Record<string, number>
): { weightedScore: number; totalCorrect: number } {
  let weighted = 0;
  let correct = 0;
  for (const batch of QUIZ_BATCHES) {
    const raw = bestByBatch[batch.id];
    const n = Math.max(0, Math.min(Number(raw) || 0, batch.questions.length));
    weighted += n * batch.level;
    correct += n;
  }
  return {
    weightedScore: Math.min(weighted, MAX_POSSIBLE_WEIGHTED),
    totalCorrect: Math.min(correct, MAX_POSSIBLE_CORRECT),
  };
}

export async function submitScore(entry: QuizLeaderboardEntry): Promise<boolean> {
  const cmds: Cmd[] = [
    ["ZADD", ZSET_KEY, entry.weightedScore, entry.clientId],
    [
      "SET",
      META_PREFIX + entry.clientId,
      JSON.stringify({
        name: entry.name,
        totalCorrect: entry.totalCorrect,
        tierKey: entry.tierKey,
        streak: entry.streak,
        updatedAt: entry.updatedAt,
      }),
    ],
  ];
  const out = await pipeline(cmds);
  return out !== null;
}

export async function getTop(limit: number): Promise<QuizLeaderboardRow[]> {
  const out = await pipeline([["ZREVRANGE", ZSET_KEY, 0, Math.max(0, limit - 1), "WITHSCORES"]]);
  const flat = (out?.[0]?.result as string[] | undefined) ?? [];
  const ids: Array<{ id: string; score: number }> = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    ids.push({ id: flat[i], score: Number(flat[i + 1]) || 0 });
  }
  if (ids.length === 0) return [];

  const metaOut = await pipeline(ids.map(({ id }): Cmd => ["GET", META_PREFIX + id]));
  return ids.map(({ id, score }, i) => {
    let meta: { name?: string; totalCorrect?: number; tierKey?: string; streak?: number } = {};
    try {
      const raw = metaOut?.[i]?.result;
      if (typeof raw === "string") meta = JSON.parse(raw);
    } catch {
      // ignore malformed meta, fall back to defaults below
    }
    return {
      rank: i + 1,
      name: meta.name?.slice(0, 24) || `Anon-${id.slice(0, 4)}`,
      weightedScore: score,
      totalCorrect: meta.totalCorrect ?? 0,
      tierKey: meta.tierKey ?? "novice",
      streak: meta.streak ?? 0,
    };
  });
}
