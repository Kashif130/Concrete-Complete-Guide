"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

type Status = "loading" | "ok" | "error";

function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function LiveStats() {
  const { t, locale } = useLocale();
  const [status, setStatus] = useState<Status>("loading");
  const [tvl, setTvl] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTvl() {
      setStatus((prev) => (prev === "ok" ? "ok" : "loading"));
      try {
        const res = await fetch("https://api.llama.fi/tvl/concrete", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const value = await res.json();
        if (cancelled) return;
        if (typeof value === "number" && Number.isFinite(value)) {
          setTvl(value);
          setUpdatedAt(new Date());
          setStatus("ok");
        } else {
          throw new Error("Unexpected response shape");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    fetchTvl();
    const interval = setInterval(fetchTvl, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-sm border border-blueprint/25 bg-blueprint/[0.04] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blueprint">
          <span
            aria-hidden
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              status === "ok" ? "bg-rebar" : "bg-inkfaint"
            } ${status === "loading" ? "animate-pulse" : ""}`}
          />
          {t.live.heading}
        </span>
      </div>

      {status === "loading" && !tvl && (
        <p className="font-display text-3xl text-inkfaint">{t.live.loading}</p>
      )}

      {status === "error" && !tvl && (
        <p className="text-sm text-inkfaint">{t.live.error}</p>
      )}

      {tvl !== null && (
        <>
          <p className="font-display text-4xl font-medium text-ink">{formatUsd(tvl)}</p>
          <p className="mt-1 text-sm text-inkfaint">{t.live.tvlLabel}</p>
          {updatedAt && (
            <p className="mt-3 text-xs text-inkfaint">
              {t.live.updated}{" "}
              {updatedAt.toLocaleTimeString(locale === "zh" ? "zh-CN" : undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          )}
        </>
      )}

      <p className="mt-3 border-t border-blueprint/15 pt-3 text-xs text-inkfaint">{t.live.sourceNote}</p>
    </div>
  );
}
