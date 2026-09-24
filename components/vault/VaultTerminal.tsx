"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  PERIODS,
  RISK_COLORS,
  VOLATILITY,
  WINDOWS,
  buildVaults,
  fmtUsdShort,
  hfZone,
  usd,
  type MarketSource,
  type VaultId,
} from "@/lib/vault/data";
import { useMarket } from "@/lib/vault/useMarket";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import { Eyebrow, Field, Metric, NumberField, Segmented, Switch } from "./ui";
import { OverviewTab } from "./tabs/OverviewTab";
import { SimulatorTab } from "./tabs/SimulatorTab";
import { HealthRadarTab } from "./tabs/HealthRadarTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { CompareTab } from "./tabs/CompareTab";
import { RebalancerTab } from "./tabs/RebalancerTab";
import { GasFeesTab } from "./tabs/GasFeesTab";
import { YieldCalendarTab } from "./tabs/YieldCalendarTab";
import { FaqTab } from "./tabs/FaqTab";
import { ReviewsTab } from "./tabs/ReviewsTab";
import type { Settings, TabProps } from "./types";

// Each batch of features registers its tabs here.
const TABS: { id: string; label: VKey; Component: ComponentType<TabProps> }[] = [
  { id: "overview", label: "tabOverview", Component: OverviewTab },
  { id: "simulator", label: "tabSimulator", Component: SimulatorTab },
  { id: "health", label: "tabHealth", Component: HealthRadarTab },
  { id: "analytics", label: "tabAnalytics", Component: AnalyticsTab },
  { id: "compare", label: "tabCompare", Component: CompareTab },
  { id: "rebalancer", label: "tabRebalancer", Component: RebalancerTab },
  { id: "gas", label: "tabGas", Component: GasFeesTab },
  { id: "calendar", label: "tabCalendar", Component: YieldCalendarTab },
  { id: "reviews", label: "tabReviews", Component: ReviewsTab },
  { id: "faq", label: "tabFaq", Component: FaqTab },
];

const SOURCE_LABEL: Record<MarketSource, VKey> = {
  live: "srcLive",
  partial: "srcPartial",
  rpc: "srcRpc",
  simulated: "srcSim",
};
const SOURCE_TONE: Record<MarketSource, string> = {
  live: "border-[#2E7D5B]/40 bg-[#2E7D5B]/10 text-[#2E7D5B]",
  partial: "border-[#B7791F]/40 bg-[#B7791F]/10 text-[#8A5A12]",
  rpc: "border-[#B7791F]/40 bg-[#B7791F]/10 text-[#8A5A12]",
  simulated: "border-line bg-paper2 text-inkfaint",
};

const DEFAULTS: Settings = {
  vaultId: "ctusd",
  principal: 10_000,
  period: "1y",
  compound: true,
  marketVol: "medium",
  window: "30D",
};

export function VaultTerminal() {
  const v = useVT();
  const { market, syncedAt, refreshing, refresh } = useMarket();
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [tab, setTab] = useState<string>(TABS[0].id);

  // Deep links from the home page: /vault?tab=rebalancer. Read once on mount, then keep the URL in
  // sync as tabs change so a tab can be bookmarked or shared. (Plain window APIs — no Suspense needed.)
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("tab");
    if (wanted && TABS.some((x) => x.id === wanted)) setTab(wanted);
  }, []);
  const selectTab = (id: string) => {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url.toString());
  };

  const vaults = useMemo(() => (market ? buildVaults(market) : null), [market]);
  const set = <K extends keyof Settings>(k: K, val: Settings[K]) => setS((prev) => ({ ...prev, [k]: val }));

  const ActiveTab = TABS.find((x) => x.id === tab)?.Component ?? TABS[0].Component;
  const sync = syncedAt ? syncedAt.toLocaleTimeString("en-GB") : "—";

  return (
    <>
      <section className="border-b border-line bg-blueprintgrid bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-blueprint">Concrete Vault</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">{v("pageTitle")}</h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink/80 md:text-base">{v("pageSubtitle")}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
            {market && (
              <span className={`rounded-sm border px-2.5 py-1 font-semibold ${SOURCE_TONE[market.source]}`}>
                {v(SOURCE_LABEL[market.source])}
              </span>
            )}
            <span className="text-inkfaint">
              {v("network")}: <span className="font-semibold text-ink">{v("networkValue")}</span>
            </span>
            <span className="text-inkfaint">
              {v("refreshEvery")}: <span className="font-semibold text-ink">{v("refreshValue")}</span>
            </span>
            <span className="text-inkfaint">
              {v("sync")}: <span className="font-mono font-semibold text-ink">{sync}</span>
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {!vaults || !market ? (
          <p className="py-24 text-center font-display text-lg text-inkfaint" role="status">
            {v("loading")}
          </p>
        ) : (
          <TerminalBody
            v={v}
            vaults={vaults}
            market={market}
            s={s}
            set={set}
            tab={tab}
            setTab={selectTab}
            ActiveTab={ActiveTab}
            refreshing={refreshing}
            refresh={refresh}
            sync={sync}
          />
        )}
      </div>
    </>
  );
}

function TerminalBody({
  v,
  vaults,
  market,
  s,
  set,
  tab,
  setTab,
  ActiveTab,
  refreshing,
  refresh,
  sync,
}: {
  v: ReturnType<typeof useVT>;
  vaults: ReturnType<typeof buildVaults>;
  market: NonNullable<ReturnType<typeof useMarket>["market"]>;
  s: Settings;
  set: <K extends keyof Settings>(k: K, val: Settings[K]) => void;
  tab: string;
  setTab: (t: string) => void;
  ActiveTab: ComponentType<TabProps>;
  refreshing: boolean;
  refresh: () => void;
  sync: string;
}) {
  const vault = vaults.find((x) => x.id === s.vaultId) ?? vaults[0];
  const zone = hfZone(vault.healthFactor);

  const totalTvl = vaults.reduce((a, x) => a + x.tvl, 0);
  const totalDaily = vaults.reduce((a, x) => a + x.dailyYield, 0);
  const avgEff = Math.round((vaults.reduce((a, x) => a + x.efficiencyIdx, 0) / vaults.length) * 10) / 10;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* ── control panel ── */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-sm border border-line bg-paper2/60 p-4">
          <p className="font-display text-sm font-semibold text-ink">{v("panelTitle")}</p>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="focus-ring mt-3 w-full rounded-sm bg-blueprint px-3 py-2 text-sm font-semibold text-paper transition-colors hover:bg-blueprint2 disabled:opacity-60"
          >
            {refreshing ? v("refreshing") : v("refreshBtn")}
          </button>
          <p className="mt-2 text-xs text-inkfaint">
            {v("sync")}: <span className="font-mono">{sync}</span>
          </p>

          <div className="mt-4">
            <Field label={v("selectVault")} htmlFor="vault-select">
              <select
                id="vault-select"
                value={s.vaultId}
                onChange={(e) => set("vaultId", e.target.value as VaultId)}
                className="focus-ring w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                {vaults.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4 rounded-sm border border-line bg-paper p-3" style={{ borderTopColor: vault.color, borderTopWidth: 2 }}>
            <Eyebrow>{v("selectedVault")}</Eyebrow>
            <p className="mt-1 font-display text-3xl font-medium" style={{ color: vault.color }}>
              {vault.apy}%
            </p>
            <p className="text-xs text-inkfaint">
              {v("apyLabel")} · {vault.asset}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-3 text-xs">
              <div>
                <dt className="text-inkfaint">{v("tvl")}</dt>
                <dd className="font-mono text-ink">{fmtUsdShort(vault.tvl)}</dd>
              </div>
              <div>
                <dt className="text-inkfaint">{v("risk")}</dt>
                <dd className="font-mono font-semibold" style={{ color: RISK_COLORS[vault.risk] }}>
                  {v(`risk${vault.risk}` as VKey)}
                </dd>
              </div>
              <div>
                <dt className="text-inkfaint">{v("health")}</dt>
                <dd className="font-mono" style={{ color: zone.color }}>
                  {vault.healthFactor.toFixed(2)} {v(`zone${zone.name}` as VKey)}
                </dd>
              </div>
              <div>
                <dt className="text-inkfaint">{v("effIdx")}</dt>
                <dd className="font-mono text-rebar">{vault.efficiencyIdx}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-inkfaint">{v("price")}</dt>
                <dd className="font-mono text-ink">{usd(vault.priceUsd)}</dd>
              </div>
            </dl>
            {vault.reference && (
              <div className="mt-3 space-y-1 border-t border-line pt-2 text-[11px] leading-snug text-inkfaint">
                <p>{v("refVaultNote", { label: vault.apyLabel ?? "reference APY" })}</p>
                {vault.curator && (
                  <p>
                    {v("refVaultCurator")}: {vault.curator}
                  </p>
                )}
                {vault.permissionRequired && <p className="font-semibold text-[#8A5A12]">{v("refVaultPerm")}</p>}
                {vault.depositUrl && (
                  <p>
                    {v("refVaultDeposit")}{" "}
                    <a href={vault.depositUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      dawn.royco.org
                    </a>
                  </p>
                )}
              </div>
            )}
            <p className="mt-3 break-all border-t border-line pt-2 font-mono text-[10px] text-inkfaint">
              {v("contract")}: {vault.address.slice(0, 20)}…
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-sm border border-line bg-paper2/60 p-4">
          <Eyebrow>{v("simSettings")}</Eyebrow>
          <Field label={v("deposit")} htmlFor="sim-deposit">
            <NumberField id="sim-deposit" value={s.principal} min={100} step={500} onChange={(n) => set("principal", n)} />
          </Field>
          <Field label={v("timePeriod")}>
            <Segmented
              label={v("timePeriod")}
              size="sm"
              value={s.period}
              onChange={(p) => set("period", p)}
              options={PERIODS.map((p) => ({ value: p.key, label: v(`p${p.key}` as VKey) }))}
            />
          </Field>
          <Switch checked={s.compound} onChange={(c) => set("compound", c)} label={v("compound")} />
          <Field label={v("marketVol")}>
            <Segmented
              label={v("marketVol")}
              size="sm"
              value={s.marketVol}
              onChange={(m) => set("marketVol", m)}
              options={VOLATILITY.map((m) => ({ value: m.key, label: v(`vol${m.key[0].toUpperCase()}${m.key.slice(1)}` as VKey) }))}
            />
          </Field>
          <Field label={v("apyWindow")}>
            <Segmented
              label={v("apyWindow")}
              size="sm"
              value={s.window}
              onChange={(w) => set("window", w)}
              options={WINDOWS.map((w) => ({ value: w.key, label: w.key }))}
            />
          </Field>
        </div>

        <p className="px-1 text-[11px] leading-relaxed text-inkfaint">{v("disclaimerLine")}</p>
      </aside>

      {/* ── main column ── */}
      <div className="min-w-0 space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Metric label={v("statTvl")} value={fmtUsdShort(totalTvl)} />
          <Metric label={v("statDaily")} value={usd(totalDaily, 0)} />
          <Metric label={v("statEth")} value={usd(market.prices.WETH, 0)} />
          <Metric label={v("statBtc")} value={usd(market.prices.WBTC, 0)} />
          <Metric label={v("statEff")} value={avgEff} sub={v("statEffSub")} />
        </div>

        <div role="tablist" aria-label={v("tabsLabel")} className="flex gap-1 overflow-x-auto border-b border-line">
          {TABS.map((x) => {
            const active = x.id === tab;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={active}
                aria-controls={`panel-${x.id}`}
                onClick={() => setTab(x.id)}
                className={`focus-ring -mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "border-rebar text-ink" : "border-transparent text-inkfaint hover:text-ink"
                }`}
              >
                {v(x.label)}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          <ActiveTab vault={vault} vaults={vaults} s={s} market={market} />
        </div>
      </div>
    </div>
  );
}
