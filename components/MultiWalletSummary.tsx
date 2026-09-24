"use client";

import { useVT } from "@/lib/vault/dictionary";
import { parsePoints } from "@/lib/points";

type VaultResult = {
  underlyingValueFormatted: string;
  underlyingSymbol: string | null;
  error?: string;
};

type WalletResult = {
  wallet: string;
  vaultData: { vaults: VaultResult[] };
  pointsData: any;
};

/**
 * Aggregates across every tracked wallet — not just within one. Only
 * renders when there's actually more than one wallet, since a single
 * wallet's totals are already shown by PortfolioTotal / PointsPanel.
 */
export default function MultiWalletSummary({
  results,
  showPoints,
  showVaults,
}: {
  results: WalletResult[];
  showPoints: boolean;
  showVaults: boolean;
}) {
  const v = useVT();
  if (results.length < 2) return null;

  let pointsTotal = 0;
  let pointsWalletsCounted = 0;
  for (const r of results) {
    if (r.pointsData?.status === "ok") {
      const p = parsePoints(r.pointsData.totals)?.totalAmount;
      if (typeof p === "number") {
        pointsTotal += p;
        pointsWalletsCounted++;
      }
    }
  }

  const vaultTotals = new Map<string, number>();
  if (showVaults) {
    for (const r of results) {
      for (const vault of r.vaultData.vaults) {
        if (vault.error) continue;
        const n = Number(vault.underlyingValueFormatted);
        if (Number.isNaN(n) || n === 0) continue;
        const symbol = vault.underlyingSymbol ?? "?";
        vaultTotals.set(symbol, (vaultTotals.get(symbol) ?? 0) + n);
      }
    }
  }

  const hasVaultTotals = vaultTotals.size > 0;
  if (!showPoints && !hasVaultTotals) return null;

  return (
    <div className="border border-brass/50 bg-brass/5 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold text-brass">{v("mwsTitle")}</h3>
        <span className="text-xs text-inkMuted">
          {v("mwsSub", { count: results.length })}
        </span>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {showPoints && (
          <div>
            <p className="text-xs uppercase tracking-wide text-inkMuted">{v("mwsPoints")}</p>
            <p className="mt-1 font-mono text-xl text-brass">
              {pointsWalletsCounted > 0
                ? pointsTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : v("mwsNoPoints")}
            </p>
          </div>
        )}

        {showVaults && (
          <div>
            <p className="text-xs uppercase tracking-wide text-inkMuted">{v("mwsVaultValue")}</p>
            {hasVaultTotals ? (
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {Array.from(vaultTotals.entries()).map(([symbol, amount]) => (
                  <span key={symbol} className="font-mono text-xl text-brass">
                    {amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {symbol}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 font-mono text-sm text-inkMuted">—</p>
            )}
            {vaultTotals.size > 1 && (
              <p className="mt-1 text-xs text-inkMuted">{v("mwsMultiToken")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
