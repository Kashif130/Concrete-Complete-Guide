"use client";

import { useEffect, useState } from "react";
import { useVT } from "@/lib/vault/dictionary";

type CtPrice =
  | { trading: false }
  | { trading: true; usd: number; usdMarketCap: number | null; ts: number };

function formatUsd(n: number): string {
  if (n >= 1) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return `$${n.toPrecision(3)}`;
}

function formatMcap(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export default function CtPriceLive({ contractAddress }: { contractAddress: string }) {
  const t = useVT();
  const [data, setData] = useState<CtPrice | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch("/api/ct-price", { cache: "no-store" });
        const json = (await res.json()) as CtPrice;
        if (!cancelled) {
          setData(json);
          setCheckedAt(new Date().toLocaleTimeString());
        }
      } catch {
        if (!cancelled) setData({ trading: false });
      }
    }
    void poll();
    const id = setInterval(poll, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [contractAddress]);

  return (
    <div className="border border-concreteMuted/30 bg-base px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-wide text-inkMuted">{t("trCtPriceLabel")}</span>
        {data?.trading && (
          <span className="rounded-full bg-steel/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-steelBright">
            live
          </span>
        )}
      </div>

      {!data ? (
        <p className="mt-1 text-sm text-inkMuted">{t("trCtPriceChecking")}</p>
      ) : data.trading ? (
        <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-xl text-brass">{formatUsd(data.usd)}</span>
          {data.usdMarketCap !== null && (
            <span className="text-xs text-inkMuted">
              {t("trCtPriceMcap")}: <span className="text-ink">{formatMcap(data.usdMarketCap)}</span>
            </span>
          )}
        </div>
      ) : (
        <p className="mt-1 text-sm text-inkMuted">{t("trCtPriceNotTrading")}</p>
      )}

      <p className="mt-1.5 text-[11px] text-inkMuted">
        {t("trCtPriceSource")}
        {checkedAt ? ` · ${t("trCtPriceUpdated", { time: checkedAt })}` : ""}
      </p>
    </div>
  );
}
