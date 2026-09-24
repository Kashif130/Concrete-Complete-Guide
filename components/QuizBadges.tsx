"use client";

import { QUIZ_BADGES } from "@/lib/quizStats";

/** Compact grid of every badge — unlocked ones lit up in brass, locked ones dimmed. Hover/long-press shows the description via the native title tooltip. */
export default function QuizBadges({ unlocked }: { unlocked: Record<string, number> }) {
  return (
    <div className="mb-6 border border-concreteMuted/30 bg-base px-4 py-3">
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-inkMuted">
        Badges ({Object.keys(unlocked).length}/{QUIZ_BADGES.length})
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUIZ_BADGES.map((b) => {
          const on = !!unlocked[b.key];
          return (
            <span
              key={b.key}
              title={on ? `${b.description} — unlocked` : `${b.description} (locked)`}
              className={`border px-2 py-1 text-[11px] ${
                on
                  ? "border-brass bg-brass/15 font-medium text-brass"
                  : "border-concreteMuted/30 text-inkMuted opacity-50"
              }`}
            >
              {b.emoji} {b.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
