"use client";

import { RISK_COLORS, hfZone } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import { Gauge, RadarChart, type GaugeBand } from "../charts";
import { Eyebrow, Panel, SectionTitle } from "../ui";
import { RiskScoreBadge } from "../RiskScoreBadge";
import type { TabProps } from "../types";

const BANDS: GaugeBand[] = [
  { from: 1.0, to: 1.1, color: "#B3261E" },
  { from: 1.1, to: 1.5, color: "#C1571C" },
  { from: 1.5, to: 2.0, color: "#B7791F" },
  { from: 2.0, to: 3.0, color: "#8A7A12" },
  { from: 3.0, to: 5.0, color: "#2E7D5B" },
];

const LEGEND = [
  { zone: "SAFE", range: ">3.0", color: "#2E7D5B" },
  { zone: "LOW", range: "2.0–3.0", color: "#8A7A12" },
  { zone: "MEDIUM", range: "1.5–2.0", color: "#B7791F" },
  { zone: "HIGH", range: "1.1–1.5", color: "#C1571C" },
  { zone: "CRITICAL", range: "<1.1", color: "#B3261E" },
] as const;

export function HealthRadarTab({ vault, vaults }: TabProps) {
  const v = useVT();
  const axes = [v("axYield"), v("axLiquidity"), v("axDiversity"), v("axMaturity"), v("axUtil"), v("axEff")];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{v("hrTitle")}</h3>
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-inkfaint">{v("hrNote")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {vaults.map((x) => {
          const zone = hfZone(x.healthFactor);
          const selected = x.id === vault.id;
          const zoneLabel = v(`zone${zone.name}` as VKey);
          return (
            <div
              key={x.id}
              className="rounded-sm border bg-paper p-3"
              style={{ borderColor: selected ? x.color : "#C9C2B2", borderTopWidth: 2, borderTopColor: x.color }}
            >
              <div className="flex items-center justify-center gap-2">
                <p className="text-center font-display text-sm font-semibold text-ink">{x.short}</p>
                <RiskScoreBadge vault={x} size="sm" />
              </div>
              <p className="text-center text-xs font-semibold" style={{ color: zone.color }}>
                {zoneLabel}
              </p>
              <Gauge
                value={Math.min(x.healthFactor, 5)}
                min={1}
                max={5}
                bands={BANDS}
                color={zone.color}
                ticks={[1, 2, 3, 4, 5]}
                display={x.healthFactor.toFixed(2)}
                ariaLabel={`${x.name}: ${v("hrHf")} ${x.healthFactor.toFixed(2)} (${zoneLabel})`}
              />
              <div className="mt-1 border-t border-line pt-2 text-center">
                <Eyebrow>{v("hrHf")}</Eyebrow>
                <p className="mt-1 break-all font-mono text-[10px] text-inkfaint">{x.address.slice(0, 20)}…</p>
              </div>
            </div>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label={v("hrHf")}>
        {LEGEND.map((l) => (
          <li key={l.zone} className="flex items-center gap-2 text-xs text-inkfaint">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm" style={{ background: l.color }} />
            {v(`zone${l.zone}` as VKey)} ({l.range})
          </li>
        ))}
      </ul>

      <section className="border-t border-line pt-6">
        <SectionTitle>{v("dnaTitle")}</SectionTitle>
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-inkfaint">{v("dnaSub")}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {vaults.map((x) => {
            const values = [
              x.yieldConsistency,
              x.liquidityDepth,
              x.strategyDiversity,
              x.protocolMaturity,
              Math.round(x.utilStability * 100),
              Math.min(Math.floor(x.efficiencyIdx), 100),
            ];
            return (
              <Panel key={x.id} accent={x.color}>
                <p className="text-center font-display text-sm font-semibold" style={{ color: x.color }}>
                  {x.name}
                </p>
                <RadarChart axes={axes} values={values} color={x.color} ariaLabel={`${v("dnaTitle")} — ${x.name}`} />
                <p className="text-center text-[11px]" style={{ color: RISK_COLORS[x.risk] }}>
                  {v("risk")}: {v(`risk${x.risk}` as VKey)}
                </p>
              </Panel>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-inkfaint">{v("dnaNote")}</p>
      </section>
    </div>
  );
}
