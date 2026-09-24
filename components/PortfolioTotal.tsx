"use client";

import { useVT } from "@/lib/vault/dictionary";

type VaultResult = {
  underlyingValueFormatted: string;
  underlyingSymbol: string | null;
  error?: string;
};

export default function PortfolioTotal({ vaults }: { vaults: VaultResult[] }) {
  const v = useVT();
  const totals = new Map<string, number>();

  for (const vault of vaults) {
    if (vault.error) continue;
    const n = Number(vault.underlyingValueFormatted);
    if (Number.isNaN(n) || n === 0) continue;
    const symbol = vault.underlyingSymbol ?? "?";
    totals.set(symbol, (totals.get(symbol) ?? 0) + n);
  }

  if (totals.size === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 border-b border-concreteMuted/40 px-6 py-4">
      <span className="text-xs uppercase tracking-wide text-inkMuted">
        {v("trPortfolioTotal")}
      </span>
      {Array.from(totals.entries()).map(([symbol, amount]) => (
        <span key={symbol} className="font-mono text-sm text-brass">
          {amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
          {symbol}
        </span>
      ))}
      {totals.size > 1 && (
        <span className="text-xs text-inkMuted">
          {v("trPortfolioNote")}
        </span>
      )}
    </div>
  );
}
