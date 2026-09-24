"use client";

import { useEffect, useState } from "react";
import WalletForm, { FormValues } from "@/components/WalletForm";
import VaultPanel from "@/components/VaultPanel";
import PointsPanel from "@/components/PointsPanel";
import AirdropEstimator from "@/components/AirdropEstimator";
import CtTokenCard from "@/components/CtTokenCard";
import CtLaunchWatcher from "@/components/CtLaunchWatcher";
import LeaderboardTable from "@/components/LeaderboardTable";
import TrackerShell from "@/components/TrackerShell";
import MultiWalletSummary from "@/components/MultiWalletSummary";
import AutoRefreshControl from "@/components/AutoRefreshControl";
import EnsAddress from "@/components/EnsAddress";
import { KNOWN_VAULTS } from "@/lib/knownVaults";
import { parsePoints } from "@/lib/points";
import { walletProfileUrl } from "@/lib/siteConfig";
import type { ChainKey } from "@/lib/chains";
import { useVT } from "@/lib/vault/dictionary";

// One component, four pages:
//   balance   → /tracker            points balance only (+ collapsible top-1000)
//   positions → /tracker/positions  vault positions only
//   airdrop   → /tracker/airdrop    points auto-checked, estimator only
//   profile   → /tracker/w/<addr>   shareable public profile (everything)
// Each view fetches only the data it shows.
export type TrackerView = "balance" | "positions" | "airdrop" | "profile";

type WalletResult = {
  wallet: string;
  vaultData: { vaults: any[]; warnings?: string[] };
  pointsData: any;
  vaultErrors: string[];
};

const COPY = {
  balance: { title: "trBalanceTitle", subtitle: "trBalanceSub", submit: "trBalanceSubmit" },
  positions: { title: "trPositionsTitle", subtitle: "trPositionsSub", submit: "trPositionsSubmit" },
  airdrop: { title: "trAirdropTitle", subtitle: "trAirdropSub", submit: "trAirdropSubmit" },
  profile: { title: "trProfileTitle", subtitle: "trProfileSub", submit: "trProfileSub" },
} as const;

export default function TrackerApp({
  view,
  initialWallet,
}: {
  view: TrackerView;
  initialWallet?: string;
}) {
  const v = useVT();
  const needsVaults = view === "positions" || view === "profile";
  const needsPoints = view !== "positions";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletResults, setWalletResults] = useState<WalletResult[]>([]);
  const [lastValues, setLastValues] = useState<FormValues | null>(null);

  async function handleSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setLastValues(values);

    if (values.wallets.length === 0) {
      setError(v("trErrNoWallet"));
      setLoading(false);
      return;
    }

    let chainQueries: { chain: string; vaults: string[] }[] = [];
    if (needsVaults) {
      if (values.mode === "manual") {
        const vaultAddrs = values.vaults
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        if (vaultAddrs.length === 0) {
          setError(v("trErrNoVault"));
          setLoading(false);
          return;
        }
        chainQueries = [{ chain: values.chain, vaults: vaultAddrs }];
      } else {
        chainQueries = values.chains
          .map((c) => ({
            chain: c,
            vaults: KNOWN_VAULTS[c as ChainKey] ?? [],
          }))
          .filter((q) => q.vaults.length > 0);
        if (chainQueries.length === 0) {
          setError(v("trErrNoChain"));
          setLoading(false);
          return;
        }
      }
    }

    try {
      const perWallet = await Promise.all(
        values.wallets.map(async (wallet): Promise<WalletResult> => {
          const vaultTask = needsVaults
            ? Promise.all(
                chainQueries.map(async (q) => {
                  const params = new URLSearchParams({
                    wallet,
                    chain: q.chain,
                    vaults: q.vaults.join(","),
                    _t: Date.now().toString(),
                  });
                  const res = await fetch(`/api/vault?${params.toString()}`, {
                    cache: "no-store",
                  });
                  const json = await res.json();
                  return { chain: q.chain, ok: res.ok, json };
                })
              )
            : Promise.resolve([]);

          const pointsTask = needsPoints
            ? fetch(`/api/points?wallet=${wallet}&_t=${Date.now()}`, {
                cache: "no-store",
              }).then((r) => r.json())
            : Promise.resolve(null);

          const [vaultResponses, pointsJson] = await Promise.all([
            vaultTask,
            pointsTask,
          ]);

          const mergedVaults = vaultResponses.flatMap((r) =>
            r.ok ? r.json.vaults.map((v: any) => ({ ...v, chain: r.chain })) : []
          );
          const mergedWarnings = vaultResponses.flatMap(
            (r) => r.json.warnings ?? []
          );
          const vaultErrors = vaultResponses
            .filter((r) => !r.ok)
            .map((r) => `[${r.chain}] ${r.json.error}`);

          return {
            wallet,
            vaultData: {
              vaults: mergedVaults,
              warnings: mergedWarnings.length ? mergedWarnings : undefined,
            },
            pointsData: pointsJson,
            vaultErrors,
          };
        })
      );

      setWalletResults(perWallet);
      const allErrors = perWallet.flatMap((r) => r.vaultErrors);
      setError(allErrors.length > 0 ? allErrors.join(" · ") : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Public profile mode: auto-run a scan-all-chains query for the wallet
  // baked into the URL, no form fill needed.
  useEffect(() => {
    if (initialWallet) {
      const allChains = Object.keys(KNOWN_VAULTS) as ChainKey[];
      handleSubmit({
        wallets: [initialWallet],
        mode: "scan",
        chain: "ethereum",
        chains: allChains,
        vaults: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWallet]);

  const copy = COPY[view];
  const subtitle = initialWallet ? (
    <>
      {v("trProfileSub")}{" "}
      <EnsAddress address={initialWallet} className="font-mono" />.
    </>
  ) : (
    v(copy.subtitle)
  );

  const pointsOf = (r: WalletResult): number | null =>
    r.pointsData?.status === "ok"
      ? parsePoints(r.pointsData.totals)?.totalAmount ?? null
      : null;

  return (
    <TrackerShell title={v(copy.title)} subtitle={subtitle}>
      {!initialWallet && (
        <WalletForm
          onSubmit={handleSubmit}
          loading={loading}
          variant={needsVaults ? "positions" : "points"}
          submitLabel={v(copy.submit)}
          autoRun={view === "balance" || view === "airdrop"}
        />
      )}

      {loading && (
        <p className="mt-4 border border-concreteMuted/40 bg-surface px-4 py-3 text-sm text-inkMuted">
          {needsVaults ? v("trReadingChain") : v("trCheckingPoints")}
        </p>
      )}

      {error && (
        <p className="mt-4 border border-rust/50 bg-rust/10 px-4 py-3 text-sm text-rust">
          {error}
        </p>
      )}

      {walletResults.length > 0 && !initialWallet && (
        <div className="mt-4 flex justify-end">
          <AutoRefreshControl
            disabled={!lastValues || loading}
            onRefresh={() => lastValues && handleSubmit(lastValues)}
          />
        </div>
      )}

      {walletResults.length > 1 && !initialWallet && (
        <div className="mt-4">
          <MultiWalletSummary
            results={walletResults}
            showPoints={needsPoints}
            showVaults={needsVaults}
          />
        </div>
      )}

      {walletResults.length > 0 && (
        <div className="mt-4 space-y-10">
          {walletResults.map((r) => (
            <div key={r.wallet} className="space-y-6">
              {(walletResults.length > 1 || initialWallet) && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-mono text-sm text-steelBright">
                    <EnsAddress address={r.wallet} />
                  </h3>
                  {!initialWallet && (
                    <a
                      href={walletProfileUrl(r.wallet)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring border border-concreteMuted/40 px-2 py-1 text-xs text-inkMuted transition-colors hover:bg-slab"
                    >
                      {v("trPublicLink")}
                    </a>
                  )}
                </div>
              )}

              {needsVaults && (
                <VaultPanel
                  vaults={r.vaultData.vaults}
                  warnings={r.vaultData.warnings}
                  wallet={r.wallet}
                  walletLabel={
                    walletResults.length > 1
                      ? `${r.wallet.slice(0, 6)}…${r.wallet.slice(-4)}`
                      : undefined
                  }
                  pointsData={
                    r.pointsData?.status === "ok"
                      ? parsePoints(r.pointsData.totals)
                      : null
                  }
                />
              )}

              {(view === "balance" || view === "profile") && (
                <PointsPanel data={r.pointsData} />
              )}

              {view === "balance" && (
                <LeaderboardTable highlightWallet={r.wallet} collapsible />
              )}

              {(view === "airdrop" || view === "profile") && (
                <>
                  <AirdropEstimator wallet={r.wallet} yourPoints={pointsOf(r)} />
                  <CtTokenCard />
                  <CtLaunchWatcher />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </TrackerShell>
  );
}
