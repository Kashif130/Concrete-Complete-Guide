"use client";

import { useMemo } from "react";
import { WINDOWS, fmtUsdShort, genHistory, usd } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import { BarChart, Donut, LineChart } from "../charts";
import { DataTable, Panel, SectionTitle } from "../ui";
import type { TabProps } from "../types";

export function AnalyticsTab({ vaults, s }: TabProps) {
  const v = useVT();
  const days = Math.max(WINDOWS.find((w) => w.key === s.window)?.days ?? 30, 7);

  const trend = useMemo(() => vaults.map((x) => ({ x, hist: genHistory(x.apy, days, x.id, x.tvl) })), [vaults, days]);
  const labels = useMemo(
    () => trend[0].hist.dates.map((d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    [trend],
  );

  const rows = vaults.map((x) => {
    const y1 = 10_000 * (Math.pow(1 + x.apy / 100, 1) - 1);
    return [
      x.name,
      `${x.apy}%`,
      fmtUsdShort(x.tvl),
      v(`risk${x.risk}` as VKey),
      x.healthFactor.toFixed(2),
      String(x.efficiencyIdx),
      `${x.apyVolatility.toFixed(2)}%`,
      usd(y1),
      usd(10_000 + y1),
    ];
  });

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-semibold text-ink">{v("anTitle", { window: s.window })}</h3>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="lg:min-h-[3rem]"><SectionTitle>{v("anApyBars")}</SectionTitle></div>
          <div className="mt-3">
            <BarChart
              ariaLabel={v("anApyBars")}
              items={vaults.map((x) => ({ label: x.short, value: x.apy, color: x.color }))}
              valueFormat={(n) => `${n}%`}
            />
          </div>
        </Panel>
        <Panel>
          <div className="lg:min-h-[3rem]"><SectionTitle>{v("anEffBars")}</SectionTitle></div>
          <div className="mt-3">
            <BarChart
              ariaLabel={v("anEffBars")}
              items={vaults.map((x) => ({ label: x.short, value: x.efficiencyIdx, color: x.color }))}
              valueFormat={(n) => String(n)}
            />
          </div>
        </Panel>
      </div>

      <section>
        <SectionTitle>{v("anMatrix")}</SectionTitle>
        <div className="mt-3">
          <DataTable
            headers={[v("colVault"), v("colApy"), v("colTvl"), v("colRisk"), v("colHf"), v("colEff"), v("colVol"), v("col1y"), v("colTotalValue")]}
            rows={rows}
          />
        </div>
      </section>

      <section>
        <SectionTitle>{v("anTvlTrend")}</SectionTitle>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkfaint">{v("anTvlDist")}</p>
            <Donut
              ariaLabel={v("anTvlDist")}
              size={150}
              thickness={20}
              slices={vaults.map((x) => ({ label: x.short, value: x.tvl, color: x.color }))}
              format={(val, total) => `${((val / total) * 100).toFixed(1)}%`}
            />
          </Panel>
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkfaint">{v("anTrend", { window: s.window })}</p>
            <LineChart
              ariaLabel={v("anTrend", { window: s.window })}
              series={trend.map(({ x, hist }) => ({ name: x.short, color: x.color, values: hist.apys }))}
              labels={labels}
              height={220}
              yFormat={(n) => `${n.toFixed(0)}%`}
              tipFormat={(n) => `${n.toFixed(2)}%`}
            />
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-inkfaint">
              {vaults.map((x) => (
                <li key={x.id} className="flex items-center gap-1.5">
                  <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: x.color }} />
                  {x.short}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </div>
  );
}
