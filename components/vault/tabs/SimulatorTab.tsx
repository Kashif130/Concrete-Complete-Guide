"use client";

import { useMemo } from "react";
import { PERIODS, VOLATILITY, earningsFor, projectValue, usd } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import { LineChart } from "../charts";
import { DataTable, Eyebrow, Metric, Panel, SectionTitle } from "../ui";
import type { TabProps } from "../types";

export function SimulatorTab({ vault, s }: TabProps) {
  const v = useVT();
  const { apy, color, asset, priceUsd } = vault;
  const { principal, compound } = s;

  const days = PERIODS.find((p) => p.key === s.period)?.days ?? 365;
  const volMult = VOLATILITY.find((x) => x.key === s.marketVol)?.mult ?? 1.5;
  const volLabel = v(`vol${s.marketVol[0].toUpperCase()}${s.marketVol.slice(1)}` as VKey);
  const periodLabel = v(`p${s.period}` as VKey);

  const earnings = earningsFor(principal, apy, days, compound);
  const totalVal = principal + earnings;
  const dailyEarn = (principal * apy) / 100 / 365;
  const ctTokens = priceUsd > 0 ? principal / priceUsd : 0;
  const stabRatio = apy / volMult;

  const projLabels = useMemo(() => Array.from({ length: 12 }, (_, i) => `M${i + 1}`), []);
  const projValues = useMemo(
    () => projLabels.map((_, i) => projectValue(principal, apy, i + 1, compound)),
    [projLabels, principal, apy, compound],
  );

  const rows = PERIODS.map((p) => {
    const e = earningsFor(principal, apy, p.days, compound);
    return [v(`p${p.key}` as VKey), usd(e), usd(principal + e), usd(e / p.days)];
  });

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-semibold text-ink">{v("simTitle", { asset })}</h3>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Panel>
            <Eyebrow>{v("simEquation")}</Eyebrow>
            <p className="mt-3 text-sm text-inkfaint">{v("simEqText")}</p>
            <p className="mt-1">
              <span className="font-display text-2xl font-medium text-rebar">{stabRatio.toFixed(2)}</span>{" "}
              <span className="text-xs text-inkfaint">{v("simAtVol", { vol: volLabel.toLowerCase() })}</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-sm border border-line bg-paper p-3">
                <Eyebrow>{v("simStandard")}</Eyebrow>
                <p className="mt-1 font-display text-xl font-medium text-[#B3261E]">{stabRatio.toFixed(2)}%</p>
                <p className="text-xs text-inkfaint">{v("simRiskDiv", { x: volMult })}</p>
              </div>
              <div className="rounded-sm border bg-paper p-3" style={{ borderColor: `${color}66` }}>
                <Eyebrow>{v("simProtected")}</Eyebrow>
                <p className="mt-1 font-display text-xl font-medium" style={{ color }}>
                  {(apy * 0.95).toFixed(2)}%
                </p>
                <p className="text-xs text-inkfaint">{v("simFloor")}</p>
              </div>
            </div>
          </Panel>

          <Panel accent={color}>
            <Eyebrow>{v("simTokens", { asset })}</Eyebrow>
            <p className="mt-2 break-all font-display text-3xl font-medium" style={{ color }}>
              {ctTokens.toFixed(6)}
            </p>
            <p className="mt-2 text-xs text-inkfaint">{v("simForDeposit", { amount: usd(principal, 0) })}</p>
            <p className="mt-0.5 text-xs text-inkfaint">{v("simPriceNote", { asset, price: usd(priceUsd) })}</p>
            <p className="mt-2 text-xs text-rebar">{v("simShares")}</p>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel accent={color}>
            <Eyebrow>{v("simProjected")}</Eyebrow>
            <p className="mt-2 break-all font-display text-4xl font-medium leading-none" style={{ color }}>
              +{usd(earnings)}
            </p>
            <p className="mt-3 text-xs text-inkfaint">
              {v("simOver", { period: periodLabel.toLowerCase(), apy, mode: compound ? v("simCompounded") : v("simSimple") })}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-sm border border-line bg-paper p-3">
                <Eyebrow>{v("simTotal")}</Eyebrow>
                <p className="mt-1 break-all font-display text-base font-medium text-ink">{usd(totalVal)}</p>
              </div>
              <div className="rounded-sm border border-line bg-paper p-3">
                <Eyebrow>{v("simDaily")}</Eyebrow>
                <p className="mt-1 break-all font-display text-base font-medium" style={{ color }}>
                  {usd(dailyEarn)}
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionTitle>{v("simProj12")}</SectionTitle>
            <div className="mt-3">
              <LineChart
                series={[{ name: v("simTotal"), color, values: projValues, fill: true, markers: true }]}
                labels={projLabels}
                height={200}
                yFormat={(n) => `$${Math.round(n).toLocaleString("en-US")}`}
                tipFormat={(n) => usd(n)}
                ariaLabel={v("simProj12")}
              />
            </div>
          </Panel>
        </div>
      </div>

      <section>
        <SectionTitle>{v("simMulti")}</SectionTitle>
        <div className="mt-3">
          <DataTable headers={[v("colPeriod"), v("colEarnings"), v("colTotal"), v("colDailyAvg")]} rows={rows} />
        </div>
      </section>

      <section>
        <SectionTitle>{v("simVsTitle")}</SectionTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Metric label={v("simStdYield")} value={`${stabRatio.toFixed(2)}%`} sub={v("simHighExposure")} valueColor="#B3261E" subColor="#B3261E" />
          <Metric label={v("simConcYield")} value={`${(apy * 0.95).toFixed(2)}%`} sub={v("simSolid")} valueColor="#2E7D5B" subColor="#2E7D5B" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-inkfaint">{v("simModelNote")}</p>
      </section>
    </div>
  );
}
