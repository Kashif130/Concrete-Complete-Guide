"use client";

import { useEffect, useState } from "react";
import { QUIZ_TIERS } from "@/lib/quiz";

type Row = {
  rank: number;
  name: string;
  weightedScore: number;
  totalCorrect: number;
  tierKey: string;
  streak: number;
};
type Resp = { status: "ok" | "not_configured" | "error"; rows?: Row[]; message?: string };

function tierEmoji(key: string): string {
  return QUIZ_TIERS.find((t) => t.key === key)?.emoji ?? "🪨";
}

/** Global quiz leaderboard, ranked by weighted score (harder levels count for more). Hides itself entirely if server-side KV storage isn't configured, rather than showing an error. */
export default function QuizLeaderboard({ refreshKey }: { refreshKey?: number }) {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/quiz-leaderboard?limit=50")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData({ status: "error", message: "Couldn't load leaderboard." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (data?.status === "not_configured") return null;

  return (
    <section className="mt-6 border border-concreteMuted/40 bg-surface">
      <header className="border-b border-concreteMuted/40 px-6 py-4">
        <h2 className="text-lg text-ink">🏆 Global quiz leaderboard</h2>
        <p className="text-xs text-inkMuted">
          Ranked by weighted score — a correct answer on a harder Level counts for more.
        </p>
      </header>

      <div className="px-6 py-5">
        {loading && <p className="text-sm text-inkMuted">Loading…</p>}

        {data?.status === "error" && <p className="font-mono text-sm text-rust">{data.message}</p>}

        {data?.status === "ok" && (
          <div className="space-y-0.5 font-mono text-xs">
            {(data.rows ?? []).map((r) => (
              <div
                key={r.rank}
                className="flex items-center justify-between gap-4 px-2 py-1.5 text-inkMuted"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="inline-block w-8 shrink-0">#{r.rank}</span>
                  <span className="truncate text-ink">{r.name}</span>
                  <span className="shrink-0">{tierEmoji(r.tierKey)}</span>
                  {r.streak > 1 && <span className="shrink-0 text-brass">🔥{r.streak}</span>}
                </span>
                <span className="shrink-0 text-brass">{r.weightedScore.toLocaleString()} pts</span>
              </div>
            ))}
            {(data.rows ?? []).length === 0 && (
              <p className="text-inkMuted">No scores yet — finish a batch to be the first on the board.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
