"use client";

import { useMemo } from "react";
import { RISK_COLORS, WINDOWS, genHistory, fmtUsdShort, usd, type Risk } from "@/lib/vault/data";
import { useVT } from "@/lib/vault/dictionary";
import { Donut, LineChart } from "../charts";
import { Eyebrow, Metric, Panel, SectionTitle } from "../ui";
import { RiskScoreBadge } from "../RiskScoreBadge";
import type { TabProps } from "../types";

const RISK_LEVEL: Record<Risk, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

function RiskBar({ label, level, color }: { label: string; level: number; color: string }) {
  return (
    <div className="rounded-sm border border-line bg-paper p-3">
      <p className="mb-2 text-xs text-inkfaint">{label}</p>
      <div className="flex gap-1" role="img" aria-label={`${label}: ${level}/3`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 flex-1 rounded-sm" style={{ background: i < level ? color : "#C9C2B2", opacity: i < level ? 1 : 0.45 }} />
        ))}
      </div>
    </div>
  );
}

export function OverviewTab({ vault, s }: TabProps) {
  const v = useVT();
  const days = WINDOWS.find((w) => w.key === s.window)?.days ?? 30;

  const hist = useMemo(
    () => genHistory(vault.apy, Math.max(days, 7), vault.id, vault.tvl),
    [vault.apy, vault.id, vault.tvl, days],
  );
  const labels = useMemo(
    () => hist.dates.map((d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    [hist],
  );

  const riskWord = v(`risk${vault.risk}` as "riskLOW");
  const riskSub = vault.risk === "LOW" ? v("ovRiskStable") : vault.risk === "MEDIUM" ? v("ovRiskModerate") : v("ovRiskHigh");
  const riskColor = RISK_COLORS[vault.risk];
  const level = RISK_LEVEL[vault.risk];
  const liqLevel = vault.risk === "LOW" ? 1 : vault.risk === "HIGH" ? 3 : 2;
  const mktLevel = vault.risk === "LOW" ? 1 : 2;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label={v("ovTvl")} value={fmtUsdShort(vault.tvl)} sub={v("ovTvlSub")} />
        <Metric label={v("ovDaily")} value={usd(vault.dailyYield, 0)} sub={v("ovDailySub")} />
        <Metric label={v("ovRisk")} value={riskWord} sub={riskSub} valueColor={riskColor} subColor={riskColor} />
        <Metric label={v("ovEff")} value={vault.efficiencyIdx} sub={v("ovEffSub", { vol: vault.apyVolatility.toFixed(2) })} />
        <Metric label={v("rsShort")} value={<RiskScoreBadge vault={vault} size="lg" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel>
          <SectionTitle>{v("ovHistoryTitle", { window: s.window, asset: vault.asset })}</SectionTitle>
          <div className="mt-3">
            <LineChart
              series={[{ name: "APY", color: vault.color, values: hist.apys, fill: true }]}
              labels={labels}
              height={230}
              yFormat={(n) => `${n.toFixed(1)}%`}
              tipFormat={(n) => `${n.toFixed(2)}%`}
              ariaLabel={v("ovHistoryTitle", { window: s.window, asset: vault.asset })}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-inkfaint">{v("ovModelled")}</p>
        </Panel>

        <Panel accent={vault.color}>
          <Eyebrow>{v("ovDetails")}</Eyebrow>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs text-inkfaint">{v("ovStrategy")}</dt>
              <dd className="mt-0.5 text-sm leading-snug text-ink">{vault.strategy}</dd>
            </div>
            <div>
              <dt className="text-xs text-inkfaint">{v("ovLiveApy")}</dt>
              <dd className="mt-0.5 font-display text-3xl font-medium" style={{ color: vault.color }}>
                {vault.apy}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-inkfaint">{v("ovUtil")}</dt>
              <dd className="mt-1.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-line/60">
                  <div className="h-full rounded-full" style={{ width: `${Math.round(vault.utilStability * 100)}%`, background: vault.color }} />
                </div>
                <p className="mt-1 font-mono text-xs text-inkfaint">{Math.round(vault.utilStability * 100)}%</p>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-inkfaint">{v("ovProtection")}</dt>
              <dd className="mt-0.5 text-sm text-rebar">{v("ovBuffer")}</dd>
            </div>
          </dl>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle>{v("ovAllocation")}</SectionTitle>
          <div className="mt-4">
            <Donut
              ariaLabel={v("ovAllocation")}
              size={160}
              slices={[
                { label: v("ovLending"), value: 40, color: vault.color, opacity: 1 },
                { label: v("ovLiquidity"), value: 28, color: vault.color, opacity: 0.7 },
                { label: v("ovCapProt"), value: 20, color: vault.color, opacity: 0.45 },
                { label: v("ovReserve"), value: 12, color: vault.color, opacity: 0.25 },
              ]}
            />
          </div>
          <p className="mt-3 text-xs text-inkfaint">{v("ovAllocNote")}</p>
        </Panel>

        <Panel>
          <SectionTitle>{v("ovRiskInd")}</SectionTitle>
          <div className="mt-4 space-y-2">
            <RiskBar label={v("ovSmart")} level={level} color={riskColor} />
            <RiskBar label={v("ovLiqRisk")} level={liqLevel} color={riskColor} />
            <RiskBar label={v("ovMktRisk")} level={mktLevel} color={riskColor} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
