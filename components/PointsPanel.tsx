"use client";

import { useEffect, useState } from "react";
import ShareButtons from "./ShareButtons";
import ShareCardImage from "./ShareCardImage";
import Sparkline from "./Sparkline";
import PointsBreakdownBars from "./PointsBreakdownBars";
import { recordSnapshot, getHistory, type Snapshot } from "@/lib/snapshots";
import { parsePoints, parsePointsBreakdown, type ParsedPoints } from "@/lib/points";
import { SITE_URL } from "@/lib/siteConfig";
import { useVT } from "@/lib/vault/dictionary";
type TFn = ReturnType<typeof useVT>;

type PointsResponse = {
  wallet: string;
  status: "ok" | "not_configured" | "error";
  totals?: unknown;
  message?: string;
};

function buildShareText(wallet: string, parsed: ParsedPoints, t: TFn): string {
  const lines = [t("trShareBalanceTitle")];
  if (parsed.totalAmount !== null) {
    lines.push(`${t("trPoints")}: ${parsed.totalAmount.toLocaleString()}`);
  }
  if (parsed.rank !== null) {
    lines.push(`${t("trRank")}: #${parsed.rank.toLocaleString()}`);
  }
  if (parsed.totalAttributions !== null) {
    lines.push(`${t("trAttributions")}: ${parsed.totalAttributions}`);
  }
  lines.push(`${t("trWallet")}: ${wallet.slice(0, 6)}…${wallet.slice(-4)}`);
  lines.push(`via ${SITE_URL} · points.concrete.xyz`);
  return lines.join("\n");
}

const MILESTONES = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

function crossedMilestone(prev: number, next: number): number | null {
  for (const m of MILESTONES) {
    if (prev < m && next >= m) return m;
  }
  return null;
}

export default function PointsPanel({ data }: { data: PointsResponse }) {
  const t = useVT();
  const parsed = data.status === "ok" ? parsePoints(data.totals) : null;
  const breakdown = data.status === "ok" ? parsePointsBreakdown(data.totals) : null;
  const shareText = parsed ? buildShareText(data.wallet, parsed, t) : null;

  const [history, setHistory] = useState<Snapshot[]>([]);
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (parsed?.totalAmount == null) return;
    const key = `points:${data.wallet.toLowerCase()}`;
    const prevHistory = getHistory(key);
    const prevValue = prevHistory[prevHistory.length - 1]?.v;
    const updated = recordSnapshot(key, parsed.totalAmount);
    setHistory(updated);
    if (prevValue !== undefined) {
      setMilestone(crossedMilestone(prevValue, parsed.totalAmount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.wallet, parsed?.totalAmount]);

  return (
    <section className="border border-concreteMuted/40 bg-surface">
      <header className="border-b border-concreteMuted/40 px-6 py-4">
        <h2 className="text-lg text-ink">{t("trPointsBalance")}</h2>
        <p className="text-xs text-inkMuted">
          {t("trPointsSource")}
        </p>
      </header>

      <div className="px-6 py-5">
        {milestone !== null && (
          <p className="mb-4 border border-brass/50 bg-brass/10 px-3 py-2 text-sm text-brass">
            {t("trMilestone", { n: milestone.toLocaleString() })}
          </p>
        )}

        {data.status === "ok" && parsed && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-inkMuted">
                {t("trPoints")}
              </div>
              <div className="font-mono text-xl text-brass">
                {parsed.totalAmount?.toLocaleString() ?? "—"}
              </div>
              {history.length > 1 && (
                <Sparkline points={history} color="rgb(var(--color-brass))" />
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-inkMuted">
                {t("trRank")}
              </div>
              <div className="font-mono text-xl text-ink">
                {parsed.rank !== null ? `#${parsed.rank.toLocaleString()}` : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-inkMuted">
                {t("trAttributions")}
              </div>
              <div className="font-mono text-xl text-ink">
                {parsed.totalAttributions ?? "—"}
              </div>
            </div>
          </div>
        )}

        {history.length > 1 && (
          <p className="mt-2 text-xs text-inkMuted">
            {t("trTrendNote")}
          </p>
        )}

        {data.status === "ok" && parsed && (
          <div className="mt-5 border-t border-concreteMuted/30 pt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-inkMuted">
              {t("trBreakdownTitle")}
            </div>
            {breakdown ? (
              <PointsBreakdownBars items={breakdown} />
            ) : (
              <p className="text-xs text-inkMuted">
                {parsed.totalAttributions !== null
                  ? t("trBreakdownUnavailableCount", { n: String(parsed.totalAttributions) })
                  : t("trBreakdownUnavailable")}
              </p>
            )}
          </div>
        )}

        {data.status === "ok" && (
          <details className="mt-4 text-xs text-inkMuted">
            <summary className="cursor-pointer select-none">
              {t("trRawResponse")}
            </summary>
            <pre className="mt-2 overflow-x-auto font-mono text-xs text-inkMuted/80">
              {JSON.stringify(data.totals, null, 2)}
            </pre>
          </details>
        )}

        {data.status === "ok" && shareText && (
          <>
            <ShareButtons text={shareText} />
            {parsed && parsed.totalAmount !== null && (
              <ShareCardImage
                kicker="concrete.xyz · Points"
                headline={parsed.totalAmount.toLocaleString()}
                headlineLabel={t("trPoints")}
                wallet={data.wallet}
                filename={`concrete-points-${data.wallet.slice(0, 8)}`}
                stats={[
                  parsed.rank !== null
                    ? { label: t("trRank"), value: `#${parsed.rank.toLocaleString()}` }
                    : null,
                  parsed.totalAttributions !== null
                    ? {
                        label: t("trAttributions"),
                        value: String(parsed.totalAttributions),
                      }
                    : null,
                ].filter((s): s is { label: string; value: string } => s !== null)}
              />
            )}
          </>
        )}

        {data.status === "not_configured" && (
          <div className="space-y-2 text-sm">
            <p className="text-inkMuted">{t("trNotConfigured1")}</p>
            <p className="text-inkMuted">{t("trNotConfigured2")}</p>
          </div>
        )}

        {data.status === "error" && (
          <p className="font-mono text-sm text-rust">{data.message}</p>
        )}
      </div>
    </section>
  );
}
