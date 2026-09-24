"use client";

import { useMemo, useState } from "react";
import { usd } from "@/lib/vault/data";
import { useVT } from "@/lib/vault/dictionary";
import { buildCalendar, monthlyBreakdown } from "@/lib/vault/tools";
import { useTabState } from "@/lib/vault/useTabState";
import { ColumnChart, LineChart } from "../charts";
import { DataTable, Eyebrow, Field, Metric, Panel, SectionTitle } from "../ui";
import type { TabProps } from "../types";

const dayLabel = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
const shortDay = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const monthYear = (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

// Token amounts span from ~0.13 (WBTC) to thousands (USDC), so pick decimals by magnitude.
const fmtUnits = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: Math.abs(n) >= 100 ? 2 : Math.abs(n) >= 1 ? 4 : 6 });

export function YieldCalendarTab({ vault, s }: TabProps) {
  const v = useVT();
  const [months, setMonths] = useTabState<number>("cal:months", 12);
  const [startMs] = useState(() => Date.now());
  const { apy, color, asset, priceUsd } = vault;
  const { principal, compound } = s;

  const cal = useMemo(() => buildCalendar(principal, apy, months, compound, startMs), [principal, apy, months, compound, startMs]);
  const rows = useMemo(() => monthlyBreakdown(cal, months, startMs), [cal, months, startMs]);

  const last = cal.values.length - 1;
  const earned = cal.cumulative[last] ?? 0;
  const finalValue = cal.values[last] ?? principal;
  const roi = principal > 0 ? (earned / principal) * 100 : 0;
  const peak = cal.daily.length ? Math.max(...cal.daily) : 0;

  const labels = useMemo(() => cal.dates.map(dayLabel), [cal]);
  const next30 = cal.daily.slice(0, 30);
  const next30Labels = cal.dates.slice(0, 30).map(shortDay);

  const units = (val: number) => (priceUsd > 0 ? val / priceUsd : 0);
  const tokens = units(principal);
  const tokenSeries = useMemo(() => cal.values.map((x) => (priceUsd > 0 ? x / priceUsd : 0)), [cal, priceUsd]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{v("calTitle")}</h3>
        <p className="mt-1 text-sm text-inkfaint">{v("calNote")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_1fr]">
        <Panel>
          <Field label={v("calMonths", { months })} htmlFor="cal-months">
            <input
              id="cal-months"
              type="range"
              min={1}
              max={24}
              step={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full"
            />
          </Field>
          <p className="mt-3 text-xs text-inkfaint">
            {asset} · {apy}% APY · {usd(principal, 0)}
          </p>
        </Panel>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label={v("calEarned")} value={usd(earned)} valueColor={color} />
          <Metric label={v("calFinal")} value={usd(finalValue)} />
          <Metric label={v("calRoi")} value={`+${roi.toFixed(2)}%`} />
          <Metric label={v("calPeak")} value={usd(peak)} />
        </div>
      </div>

      <Panel accent={color}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkfaint">{v("calGrowth", { asset, months, apy })}</p>
        <LineChart
          ariaLabel={v("calGrowth", { asset, months, apy })}
          series={[
            { name: v("calValue"), color, values: cal.values, fill: true },
            { name: v("calPrincipal"), color: "#8A8578", values: cal.values.map(() => principal), dashed: true, noTip: true },
          ]}
          labels={labels}
          height={260}
          yFormat={(n) => `$${Math.round(n).toLocaleString("en-US")}`}
          tipFormat={(n) => usd(n)}
        />
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-inkfaint">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
            {v("calValue")}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-0.5 w-4 bg-[#8A8578]" />
            {v("calPrincipal")}
          </li>
        </ul>
      </Panel>

      <section>
        <SectionTitle>{v("calMonthly")}</SectionTitle>
        <div className="mt-3">
          <DataTable
            headers={[v("calColMonth"), v("calColYield"), v("calColCum"), v("calColValue")]}
            rows={rows.map((r) => [
              v("calMonthLabel", { n: String(r.month).padStart(2, "0"), date: monthYear(r.endDate) }),
              usd(r.earned),
              usd(r.cumulative),
              usd(r.value),
            ])}
          />
        </div>
      </section>

      <section>
        <SectionTitle>{v("calDaily30")}</SectionTitle>
        <Panel className="mt-3">
          <ColumnChart
            ariaLabel={v("calDaily30")}
            values={next30}
            labels={next30Labels}
            color={color}
            height={200}
            yFormat={(n) => `$${n.toFixed(2)}`}
            tipFormat={(n) => `$${n.toFixed(4)}`}
          />
        </Panel>
      </section>

      <section>
        <SectionTitle>{v("calTokTitle", { asset })}</SectionTitle>
        <Panel className="mt-3">
          <LineChart
            ariaLabel={v("calTokTitle", { asset })}
            series={[{ name: `ct${asset}`, color: "#B7791F", values: tokenSeries, fill: true }]}
            labels={labels}
            height={200}
            yFormat={fmtUnits}
            tipFormat={(n) => `${n.toFixed(6)} ${asset}`}
          />
        </Panel>
        <div className="mt-3 rounded-sm border border-[#B7791F]/40 bg-[#B7791F]/10 p-4">
          <Eyebrow className="!text-[#8A5A12]">{v("calTokInfo", { asset })}</Eyebrow>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
            {v("calTokText", {
              amount: usd(principal, 0),
              tokens: tokens.toFixed(6),
              asset,
              months,
              apy,
              value: usd(finalValue),
            })}
          </p>
        </div>
      </section>
    </div>
  );
}
