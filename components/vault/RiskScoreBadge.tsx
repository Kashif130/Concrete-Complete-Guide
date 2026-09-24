"use client";

import { useState } from "react";
import type { VaultBase, VaultLive } from "@/lib/vault/data";
import { computeRiskScore } from "@/lib/vault/riskScore";
import { useVT } from "@/lib/vault/dictionary";

export function RiskScoreBadge({
  vault,
  size = "md",
  showTooltip = true,
}: {
  vault: VaultBase | VaultLive;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}) {
  const v = useVT();
  const [open, setOpen] = useState(false);
  const result = computeRiskScore(vault);

  const dims =
    size === "lg"
      ? "h-10 w-10 text-base"
      : size === "sm"
        ? "h-6 w-6 text-[11px]"
        : "h-8 w-8 text-sm";

  return (
    <span className="relative inline-flex items-center gap-2">
      <span
        role={showTooltip ? "button" : undefined}
        tabIndex={showTooltip ? 0 : undefined}
        onMouseEnter={() => showTooltip && setOpen(true)}
        onMouseLeave={() => showTooltip && setOpen(false)}
        onFocus={() => showTooltip && setOpen(true)}
        onBlur={() => showTooltip && setOpen(false)}
        onClick={() => showTooltip && setOpen((o) => !o)}
        aria-label={`${v("rsTitle")}: ${result.grade} (${result.score}/100)`}
        className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-full border-2 font-display font-bold text-paper`}
        style={{ background: result.color, borderColor: result.color }}
      >
        {result.grade}
      </span>
      {showTooltip && open && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-10 mt-2 w-64 rounded-sm border border-line bg-paper p-3 text-left shadow-lg"
        >
          <p className="font-display text-xs font-semibold text-ink">
            {v("rsTitle")} — {result.grade} · {result.score}/100
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-inkfaint">{v("rsNote")}</p>
          <ul className="mt-2 space-y-1">
            {result.factors.map((f) => (
              <li key={f.key} className="flex items-center justify-between gap-2 text-[11px] text-ink/80">
                <span>{f.label}</span>
                <span className="font-mono">{Math.round(f.score)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </span>
  );
}
