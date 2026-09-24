"use client";

import { usd } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import {
  GAS_DEPOSIT_SIZES,
  GAS_OPS,
  GAS_THRESHOLD_PCT,
  GAS_TIERS,
  gasCostEth,
  gasCostUsd,
  type GasTierKey,
} from "@/lib/vault/tools";
import { useGas } from "@/lib/vault/useGas";
import { useTabState } from "@/lib/vault/useTabState";
import { LineChart } from "../charts";
import { DataTable, Eyebrow, Field, Panel, SectionTitle, Segmented } from "../ui";
import type { TabProps } from "../types";

const SRC_KEY = { live: "gasLive", simulated: "gasSim", loading: "gasLoading" } as const;
const SRC_TONE = {
  live: "border-[#2E7D5B]/40 bg-[#2E7D5B]/10 text-[#2E7D5B]",
  simulated: "border-line bg-paper text-inkfaint",
  loading: "border-line bg-paper text-inkfaint",
} as const;

export function GasFeesTab({ market }: TabProps) {
  const v = useVT();
  const gas = useGas();
  const [tier, setTier] = useTabState<GasTierKey>("gas:tier", "Normal");

  const ethUsd = market.prices.WETH;
  const mult = GAS_TIERS.find((t) => t.key === tier)?.mult ?? 1;
  const effective = Math.round(gas.gwei * mult * 100) / 100;

  const rows = GAS_OPS.map((op) => {
    const cost = gasCostUsd(op.gas, effective, ethUsd);
    return [
      v(`gasOp${op.key}` as VKey),
      op.gas.toLocaleString("en-US"),
      `${gasCostEth(op.gas, effective).toFixed(6)} ETH`,
      usd(cost),
      `${((cost / 10_000) * 100).toFixed(4)}%`,
    ];
  });

  const depositCost = gasCostUsd(GAS_OPS[0].gas, effective, ethUsd);
  const impact = GAS_DEPOSIT_SIZES.map((d) => Math.round((depositCost / d) * 100 * 1000) / 1000);
  const minDeposit = depositCost / (GAS_THRESHOLD_PCT / 100);

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-semibold text-ink">{v("gasTitle")}</h3>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="space-y-4">
          <Panel accent="#0F7B6C">
            <Eyebrow>{v("gasBase")}</Eyebrow>
            <p className="mt-2 font-display text-5xl font-medium leading-none text-[#0F7B6C]">{gas.gwei}</p>
            <p className="mt-1 text-sm text-inkfaint">{v("gasGwei")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-sm border px-2 py-0.5 font-semibold ${SRC_TONE[gas.source]}`}>{v(SRC_KEY[gas.source])}</span>
              <span className="font-mono text-rebar">{v("gasEth", { price: usd(ethUsd, 0) })}</span>
            </div>
          </Panel>

          <Field label={v("gasSpeed")}>
            <Segmented
              label={v("gasSpeed")}
              size="sm"
              value={tier}
              onChange={setTier}
              options={GAS_TIERS.map((t) => ({ value: t.key, label: v(`gas${t.key}` as VKey) }))}
            />
          </Field>

          <div className="rounded-sm border border-line bg-paper p-4">
            <Eyebrow>{v("gasEffective")}</Eyebrow>
            <p className="mt-1 font-display text-2xl font-medium text-rebar">
              {effective} <span className="text-sm text-inkfaint">{v("gasGwei")}</span>
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <SectionTitle>{v("gasMatrix")}</SectionTitle>
          <div className="mt-3">
            <DataTable headers={[v("gasColOp"), v("gasColUnits"), v("gasColEth"), v("gasColUsd"), v("gasColPct")]} rows={rows} />
          </div>
        </div>
      </div>

      <section>
        <SectionTitle>{v("gasImpact")}</SectionTitle>
        <Panel className="mt-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-inkfaint">{v("gasImpactChart", { gwei: effective })}</p>
          <LineChart
            ariaLabel={v("gasImpactChart", { gwei: effective })}
            series={[
              { name: v("gasColPct"), color: "#0F7B6C", values: impact, fill: true, markers: true },
              { name: v("gasThreshold"), color: "#B7791F", values: impact.map(() => GAS_THRESHOLD_PCT), dashed: true, noTip: true },
            ]}
            labels={GAS_DEPOSIT_SIZES.map((d) => `$${d.toLocaleString("en-US")}`)}
            height={240}
            zeroBased
            yFormat={(n) => `${n.toFixed(2)}%`}
            tipFormat={(n) => `${n.toFixed(3)}%`}
          />
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-inkfaint">
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-0.5 w-4 bg-[#B7791F]" />
              {v("gasThreshold")}
            </li>
          </ul>
        </Panel>
      </section>

      <div className="rounded-sm border border-[#B7791F]/40 bg-[#B7791F]/10 p-4">
        <Eyebrow className="!text-[#8A5A12]">{v("gasTipTitle")}</Eyebrow>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
          {v("gasTip", { gwei: effective, cost: usd(depositCost), min: usd(minDeposit, 0) })}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-inkfaint">{v("gasNote")}</p>
    </div>
  );
}
