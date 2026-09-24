"use client";

import type { QuizResult } from "./quiz";

/** Fire-and-forget submit of the current best-ever-per-batch map to the leaderboard. Silently no-ops on any network/storage failure — the leaderboard is a bonus, never a blocker for playing the quiz. */
export async function submitLeaderboardScore(args: {
  clientId: string;
  name: string;
  bestByBatch: Record<string, QuizResult>;
  tierKey: string;
  streak: number;
}): Promise<void> {
  try {
    const bestByBatch: Record<string, number> = {};
    for (const [batchId, r] of Object.entries(args.bestByBatch)) {
      bestByBatch[batchId] = r.bestCorrect;
    }
    await fetch("/api/quiz-leaderboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        clientId: args.clientId,
        name: args.name,
        bestByBatch,
        tierKey: args.tierKey,
        streak: args.streak,
      }),
    });
  } catch {
    // best-effort only
  }
}
