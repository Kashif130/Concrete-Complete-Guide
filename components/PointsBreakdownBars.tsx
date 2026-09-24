"use client";

import type { PointsBreakdownItem } from "@/lib/points";

export default function PointsBreakdownBars({
  items,
}: {
  items: PointsBreakdownItem[];
}) {
  if (items.length === 0) return null;
  const total = items.reduce((sum, it) => sum + it.amount, 0) || 1;
  const max = Math.max(...items.map((it) => it.amount), 0.0001);

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={`${it.label}-${i}`}>
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="truncate text-ink">{it.label}</span>
            <span className="whitespace-nowrap font-mono text-inkMuted">
              {it.amount.toLocaleString()} · {((it.amount / total) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden bg-slab">
            <div
              className="h-full bg-gradient-to-r from-steel to-brass"
              style={{ width: `${(it.amount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
