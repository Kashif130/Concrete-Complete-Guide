"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { PERIODS, RISK_COLORS, earningsFor, fmtUsdShort, hfZone, usd, type Risk, type VaultId, type VaultLive } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import { useTabState } from "@/lib/vault/useTabState";
import { BarChart } from "../charts";
import { Panel, SectionTitle } from "../ui";
import { RiskScoreBadge } from "../RiskScoreBadge";
import { computeRiskScore } from "@/lib/vault/riskScore";
import type { TabProps } from "../types";

const MIN = 2;
const MAX = 3;
const BEST = "#2E7D5B";
const RISK_RANK: Record<Risk, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };

/** Deep link: /vault?tab=compare&cmp=ctusd,ctwbtc. Falls back to the selected vault + the next ones. */
function initialIds(vaults: VaultLive[], primary: VaultId): VaultId[] {
  if (typeof window !== "undefined") {
    const raw = new URLSearchParams(window.location.search).get("cmp");
    if (raw) {
      const valid = new Set<string>(vaults.map((x) => x.id));
      const ids = raw.split(",").filter((id, i, all) => valid.has(id) && all.indexOf(id) === i) as VaultId[];
      if (ids.length >= MIN) return ids.slice(0, MAX);
    }
  }
  const first = vaults.find((x) => x.id === primary);
  const rest = vaults.filter((x) => x.id !== primary);
  return [...(first ? [first] : []), ...rest].slice(0, MAX).map((x) => x.id);
}

/** Indexes holding the best value in a row — empty when everyone ties (nothing to highlight). */
function bestIdx(values: number[], higherIsBetter: boolean): Set<number> {
  const target = higherIsBetter ? Math.max(...values) : Math.min(...values);
  const hits = values.flatMap((n, i) => (n === target ? [i] : []));
  return hits.length === values.length ? new Set() : new Set(hits);
}

export function CompareTab({ vaults, vault, s }: TabProps) {
  const v = useVT();
  const [ids, setIds] = useTabState<VaultId[]>("cmp:ids", initialIds(vaults, vault.id));

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("cmp", ids.join(","));
    window.history.replaceState(null, "", url.toString());
  }, [ids]);

  const toggle = (id: VaultId) =>
    setIds((prev) => {
      if (prev.includes(id)) return prev.length > MIN ? prev.filter((x) => x !== id) : prev;
      return prev.length < MAX ? [...prev, id] : prev;
    });

  // Columns keep the terminal's vault order regardless of the order they were ticked in.
  const sel = useMemo(() => vaults.filter((x) => ids.includes(x.id)), [vaults, ids]);
  const days = PERIODS.find((p) => p.key === s.period)?.days ?? 365;
  const periodLabel = v(`p${s.period}` as VKey);
  const anyFees = sel.some((x) => x.fees);

  const cols = sel.length;
  const hint = ids.length >= MAX ? v("cmpHintMax") : ids.length <= MIN ? v("cmpHintMin") : v("cmpHintOk");

  type Row = { label: string; cells: ReactNode[]; best?: Set<number> };

  const zone = (x: VaultLive) => hfZone(x.healthFactor);

  const performance: Row[] = [
    { label: v("apyLabel"), cells: sel.map((x) => `${x.apy}%`), best: bestIdx(sel.map((x) => x.apy), true) },
    {
      label: v("cmpEarn", { period: periodLabel }),
      cells: sel.map((x) => usd(earningsFor(s.principal, x.apy, days, s.compound))),
    },
    { label: v("tvl"), cells: sel.map((x) => fmtUsdShort(x.tvl)) },
    { label: v("colEff"), cells: sel.map((x) => String(x.efficiencyIdx)), best: bestIdx(sel.map((x) => x.efficiencyIdx), true) },
  ];

  const risk: Row[] = [
    {
      label: v("colRiskScore"),
      cells: sel.map((x) => (
        <span key={x.id} className="inline-flex items-center gap-1.5">
          <RiskScoreBadge vault={x} size="sm" showTooltip={false} />
          {computeRiskScore(x).score}
        </span>
      )),
      best: bestIdx(sel.map((x) => computeRiskScore(x).score), true),
    },
    {
      label: v("risk"),
      cells: sel.map((x) => (
        <span key={x.id} className="font-semibold" style={{ color: RISK_COLORS[x.risk] }}>
          {v(`risk${x.risk}` as VKey)}
        </span>
      )),
      best: bestIdx(sel.map((x) => RISK_RANK[x.risk]), false),
    },
    {
      label: v("colHf"),
      cells: sel.map((x) => (
        <span key={x.id} style={{ color: zone(x).color }}>
          {x.healthFactor.toFixed(2)} · {v(`zone${zone(x).name}` as VKey)}
        </span>
      )),
      best: bestIdx(sel.map((x) => x.healthFactor), true),
    },
    { label: v("cmpVol"), cells: sel.map((x) => `${x.apyVolatility.toFixed(2)}%`), best: bestIdx(sel.map((x) => x.apyVolatility), false) },
    { label: v("cmpLiq"), cells: sel.map((x) => `${x.liquidityDepth} / 100`), best: bestIdx(sel.map((x) => x.liquidityDepth), true) },
  ];

  const details: Row[] = [
    { label: v("cmpAsset"), cells: sel.map((x) => x.asset) },
    { label: v("cmpStrategy"), cells: sel.map((x) => <span key={x.id} className="font-sans">{x.strategy}</span>) },
    {
      label: v("contract"),
      cells: sel.map((x) => (
        <span key={x.id} className="break-all" title={x.address}>
          {x.address.slice(0, 10)}…{x.address.slice(-6)}
        </span>
      )),
    },
  ];

  const th = "border-b border-line px-3 py-2 text-left align-top text-xs font-semibold text-inkfaint";
  const td = "border-b border-line/60 px-3 py-2 align-top font-mono text-xs text-ink";

  const renderRows = (rows: Row[]) =>
    rows.map((r) => (
      <tr key={r.label} className="bg-paper">
        <th scope="row" className={`${th} sticky left-0 z-[1] bg-paper`}>
          {r.label}
        </th>
        {r.cells.map((c, i) => {
          const isBest = r.best?.has(i);
          return (
            <td key={sel[i].id} className={`${td} ${isBest ? "bg-[#2E7D5B]/10 font-semibold" : ""}`}>
              {c}
              {isBest && (
                <>
                  <span aria-hidden className="ml-1.5" style={{ color: BEST }}>
                    ●
                  </span>
                  <span className="sr-only"> ({v("cmpBest")})</span>
                </>
              )}
            </td>
          );
        })}
      </tr>
    ));

  const group = (label: string) => (
    <tr>
      <th colSpan={cols + 1} scope="colgroup" className="bg-blueprint px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-paper">
        {label}
      </th>
    </tr>
  );

  const spanRow = (label: string, text: string) => (
    <tr key={label} className="bg-paper">
      <th scope="row" className={`${th} sticky left-0 z-[1] bg-paper`}>
        {label}
      </th>
      <td colSpan={cols} className={`${td} font-sans`}>
        {text}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{v("cmpTitle")}</h3>
        <p className="mt-1 max-w-prose text-sm text-inkfaint">{v("cmpSub")}</p>
      </div>

      <section>
        <SectionTitle>{v("cmpPick")}</SectionTitle>
        <div role="group" aria-label={v("cmpPick")} className="mt-3 flex flex-wrap gap-2">
          {vaults.map((x) => {
            const on = ids.includes(x.id);
            const locked = !on && ids.length >= MAX;
            return (
              <button
                key={x.id}
                type="button"
                aria-pressed={on}
                disabled={locked}
                onClick={() => toggle(x.id)}
                className={`focus-ring flex items-center gap-2 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  on ? "border-blueprint bg-blueprint text-paper" : "border-line bg-paper text-ink/80 hover:border-blueprint/50 hover:text-ink"
                }`}
              >
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border border-paper/60" style={{ background: x.color }} />
                {x.name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-inkfaint" aria-live="polite">
          {hint}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle>{v("cmpChartApy")}</SectionTitle>
          <div className="mt-3">
            <BarChart
              ariaLabel={v("cmpChartApy")}
              height={200}
              items={sel.map((x) => ({ label: x.short, value: x.apy, color: x.color }))}
              valueFormat={(n) => `${n}%`}
            />
          </div>
        </Panel>
        <Panel>
          <SectionTitle>{v("cmpChartHf")}</SectionTitle>
          <div className="mt-3">
            <BarChart
              ariaLabel={v("cmpChartHf")}
              height={200}
              items={sel.map((x) => ({ label: x.short, value: x.healthFactor, color: x.color }))}
              valueFormat={(n) => n.toFixed(2)}
            />
          </div>
        </Panel>
      </div>

      <div className="overflow-x-auto rounded-sm border border-line">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className={`${th} sticky left-0 z-[1] bg-paper2`}>
                {v("cmpMetric")}
              </th>
              {sel.map((x) => (
                <th key={x.id} scope="col" className="border-b border-line bg-paper2 px-3 py-2.5 text-left align-bottom" style={{ borderTop: `3px solid ${x.color}` }}>
                  <span className="block font-display text-sm font-semibold text-ink">{x.name}</span>
                  <span className="text-xs font-normal text-inkfaint">{x.short}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group(v("cmpGroupPerf"))}
            {renderRows(performance)}
            {group(v("cmpGroupRisk"))}
            {renderRows(risk)}
            {group(v("cmpGroupFees"))}
            {spanRow(v("cmpFeeDeposit"), v("cmpNone"))}
            {spanRow(v("cmpFeeWithdraw"), v("cmpNone"))}
            {anyFees
              ? renderRows([
                  {
                    label: v("cmpFeeMgmt"),
                    cells: sel.map((x) => (x.fees ? `${x.fees.management}%/yr` : "—")),
                    best: bestIdx(sel.map((x) => x.fees?.management ?? Infinity), false),
                  },
                  {
                    label: v("cmpFeePerf"),
                    cells: sel.map((x) => (x.fees ? `${x.fees.performance}%` : "—")),
                    best: bestIdx(sel.map((x) => x.fees?.performance ?? Infinity), false),
                  },
                ])
              : [spanRow(v("cmpFeeMgmt"), v("cmpFeeMgmtDefault")), spanRow(v("cmpFeePerf"), v("cmpFeePerfDefault"))]}
            {group(v("cmpGroupDetails"))}
            {renderRows(details)}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 text-xs leading-relaxed text-inkfaint">
        <p>
          <span aria-hidden style={{ color: BEST }}>
            ●
          </span>{" "}
          {v("cmpBest")}
        </p>
        <p>
          {v("cmpFeeNote")}{" "}
          <Link href="/docs/01-beginner/06-fees" className="focus-ring font-semibold text-blueprint underline hover:text-rebar">
            {v("cmpFeeGuide")}
          </Link>
        </p>
        <p>{v("cmpDataNote")}</p>
      </div>
    </div>
  );
}
