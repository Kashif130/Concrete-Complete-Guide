"use client";

import { useMemo } from "react";
import { usd } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import { REBALANCE_MODES, emptyAllocation, optimalAllocation, weightedApy, type Allocation, type RebalanceMode } from "@/lib/vault/tools";
import { useTabState } from "@/lib/vault/useTabState";
import { Donut } from "../charts";
import { Eyebrow, Field, Metric, NumberField, Panel, SectionTitle, Segmented } from "../ui";
import type { TabProps } from "../types";

const MODE_KEY: Record<RebalanceMode, VKey> = {
  eff: "rbModeEff",
  risk: "rbModeRisk",
  balanced: "rbModeBal",
  apy: "rbModeApy",
};
const GAIN = "#2E7D5B";
const LOSS = "#B3261E";

export function RebalancerTab({ vaults }: TabProps) {
  const v = useVT();
  const [holdings, setHoldings] = useTabState<Allocation>("rb:holdings", emptyAllocation(vaults));
  const [mode, setMode] = useTabState<RebalanceMode>("rb:mode", "eff");

  const total = vaults.reduce((a, x) => a + (holdings[x.id] || 0), 0);
  const optimal = useMemo(() => optimalAllocation(vaults, total, mode), [vaults, total, mode]);
  const curApy = weightedApy(vaults, holdings);
  const optApy = weightedApy(vaults, optimal);
  const gain = optApy - curApy;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{v("rbTitle")}</h3>
        <p className="mt-1 max-w-prose text-sm text-inkfaint">{v("rbSub")}</p>
      </div>

      <section>
        <SectionTitle>{v("rbStep1")}</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {vaults.map((x) => (
            <Field key={x.id} label={v("rbHolding", { asset: x.short })} htmlFor={`rb-${x.id}`}>
              <NumberField
                id={`rb-${x.id}`}
                value={holdings[x.id] || 0}
                min={0}
                step={500}
                onChange={(n) => setHoldings((prev) => ({ ...prev, [x.id]: n }))}
              />
            </Field>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>{v("rbStep2")}</SectionTitle>
        <div className="mt-3">
          <Segmented
            label={v("rbTarget")}
            value={mode}
            onChange={setMode}
            options={REBALANCE_MODES.map((m) => ({ value: m, label: v(MODE_KEY[m]) }))}
          />
        </div>
      </section>

      {total > 0 ? (
        <>
          <section>
            <SectionTitle>{v("rbStep3")}</SectionTitle>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {vaults.map((x) => {
                const cur = holdings[x.id] || 0;
                const opt = optimal[x.id];
                const delta = opt - cur;
                const pct = (opt / total) * 100;
                return (
                  <Panel key={x.id} accent={x.color} className="!p-4">
                    <Eyebrow>{x.short}</Eyebrow>
                    <p className="mt-0.5 text-xs text-inkfaint">{v("rbPct", { pct: pct.toFixed(1) })}</p>
                    <dl className="mt-3 space-y-2">
                      <div>
                        <dt className="text-[11px] text-inkfaint">{v("rbCurrent")}</dt>
                        <dd className="font-display text-base text-ink">{usd(cur, 0)}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-inkfaint">{v("rbOptimal")}</dt>
                        <dd className="font-display text-lg font-semibold" style={{ color: x.color }}>
                          {usd(opt, 0)}
                        </dd>
                      </div>
                      <div className="rounded-sm border border-line bg-paper px-2 py-1.5">
                        <dt className="text-[11px] text-inkfaint">{v("rbAction")}</dt>
                        <dd className="font-mono text-sm font-semibold" style={{ color: delta >= 0 ? GAIN : LOSS }}>
                          {delta >= 0 ? "+" : "−"}
                          {usd(Math.abs(delta), 0)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3 h-1 rounded-full bg-line/60" aria-hidden>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: x.color }} />
                    </div>
                  </Panel>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkfaint">{v("rbCurAlloc")}</p>
              <Donut
                ariaLabel={v("rbCurAlloc")}
                size={150}
                thickness={20}
                slices={vaults.map((x) => ({ label: x.short, value: holdings[x.id] || 0, color: x.color }))}
                format={(val, t) => `${((val / t) * 100).toFixed(1)}%`}
              />
            </Panel>
            <Panel>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkfaint">{v("rbOptAlloc")}</p>
              <Donut
                ariaLabel={v("rbOptAlloc")}
                size={150}
                thickness={20}
                slices={vaults.map((x) => ({ label: x.short, value: optimal[x.id], color: x.color }))}
                format={(val, t) => `${((val / t) * 100).toFixed(1)}%`}
              />
            </Panel>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label={v("rbTotal")} value={usd(total, 0)} />
            <Metric label={v("rbCurApy")} value={`${curApy.toFixed(2)}%`} />
            <Metric label={v("rbOptApy")} value={`${optApy.toFixed(2)}%`} valueColor={GAIN} />
            <Metric
              label={v("rbApyDelta")}
              value={`${gain >= 0 ? "+" : "−"}${Math.abs(gain).toFixed(2)}%`}
              valueColor={gain >= 0 ? GAIN : LOSS}
            />
          </div>
        </>
      ) : (
        <div className="rounded-sm border border-line bg-paper2/60 px-6 py-10 text-center">
          <p aria-hidden className="text-2xl">🗿</p>
          <p className="mt-2 font-display text-base font-semibold text-ink">{v("rbEmptyTitle")}</p>
          <p className="mt-1 text-sm text-inkfaint">{v("rbEmptySub")}</p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-inkfaint">{v("rbNote")}</p>
    </div>
  );
}
