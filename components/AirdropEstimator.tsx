"use client";

import { useState } from "react";
import ShareButtons from "./ShareButtons";
import ShareCardImage from "./ShareCardImage";
import { SITE_URL } from "@/lib/siteConfig";
import { useCommunityTotal } from "@/lib/useCommunityTotal";
import { useVT } from "@/lib/vault/dictionary";

// $CT is confirmed (ERC-20 on Ethereum, fixed 1B supply — Concrete Foundation
// announcement, ~19 Sep 2026), but no TGE, claim date, airdrop pool size, or
// points-to-token conversion has been announced. The user's points and the total
// community points are real numbers read from Fuul (total = sum of every user's
// balance); only pool size and FDV are what-ifs — never a real allocation.

const FDV_OPTIONS = [50_000_000, 250_000_000, 500_000_000, 1_000_000_000, 3_000_000_000];

function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function AirdropEstimator({
  wallet,
  yourPoints,
}: {
  wallet: string;
  yourPoints: number | null;
}) {
  const t = useVT();
  const myPoints = yourPoints ?? 0;
  const { data: community, loading: totalLoading, reload } = useCommunityTotal();
  const totalCommunityPoints =
    community?.status === "ok" ? community.totalPoints ?? 0 : 0;
  const totalReady = community?.status === "ok" && totalCommunityPoints > 0;
  const [maxSupply, setMaxSupply] = useState(1_000_000_000);
  const [poolPct, setPoolPct] = useState(7);
  const [fdv, setFdv] = useState(250_000_000);

  const airdropPoolTokens = maxSupply * (poolPct / 100);
  const yourShare = totalReady ? Math.min(1, myPoints / totalCommunityPoints) : 0;
  const yourTokens = airdropPoolTokens * yourShare;
  const tokenPrice = fdv / maxSupply;
  const yourUsdValue = yourTokens * tokenPrice;

  const shareText = [
    t("trAdShareTitle"),
    `${Math.round(yourTokens).toLocaleString()} $CT (~$${yourUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} at ${formatUsd(fdv)} FDV)`,
    t("trAdShareBased", { n: myPoints.toLocaleString() }),
    `${t("trWallet")}: ${wallet.slice(0, 6)}…${wallet.slice(-4)}`,
    `via ${SITE_URL}`,
  ].join("\n");

  return (
    <section className="border border-concreteMuted/40 bg-surface">
      <header className="border-b border-concreteMuted/40 px-6 py-4">
        <h2 className="text-lg text-ink">{t("trAdTitle")}</h2>
        <p className="text-xs text-inkMuted">
          <strong className="text-brass">{t("trAdConfirmed")}</strong>
          {t("trAdIntro")}{" "}
          <strong className="text-rust">{t("trAdNoTge")}</strong>{" "}
          {t("trAdIntro2")}{" "}
          <a
            href="#ct-token-card"
            className="text-steelBright underline underline-offset-2 hover:text-steel"
          >
            {t("trAdCtLink")}
          </a>
        </p>
      </header>

      <div className="space-y-5 px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-inkMuted">
              {t("trAdYourPoints")}
            </div>
            <div className="font-mono text-xl text-brass">
              {yourPoints !== null ? yourPoints.toLocaleString() : "—"}
            </div>
            {yourPoints === null && (
              <p className="mt-1 text-xs text-inkMuted">
                {t("trAdNoPoints")}
              </p>
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-inkMuted">
              {t("trAdTotalLabel")}
            </div>
            <div className="font-mono text-xl text-ink">
              {totalLoading
                ? t("trAdReading")
                : community?.status === "ok"
                  ? Math.round(totalCommunityPoints).toLocaleString()
                  : "—"}
            </div>
            {community?.status === "ok" && (
              <p className="mt-1 text-xs text-inkMuted">
                {community.totalUsers && !community.complete
                  ? t("trAdSumOfPartial", {
                      n: (community.usersRead ?? 0).toLocaleString(),
                      total: community.totalUsers.toLocaleString(),
                    })
                  : t("trAdSumOf", { n: (community.usersRead ?? 0).toLocaleString() })}
                {community.calculatedAt
                  ? t("trAdCalc", {
                      date: new Date(community.calculatedAt).toLocaleString(),
                    })
                  : ""}
              </p>
            )}
            {community?.status === "ok" && !community.complete && (
              <p className="mt-1 text-xs text-rust">
                {t("trAdPartial")}{" "}
                <button type="button" onClick={reload} className="underline">
                  {t("trRetry")}
                </button>
              </p>
            )}
            {community && community.status !== "ok" && (
              <p className="mt-1 text-xs text-rust">
                {t("trAdReadFail")}{" "}
                <button type="button" onClick={reload} className="underline">
                  {t("trRetry")}
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-inkMuted">
              {t("trAdPoolPct")}{" "}
              <b className="text-ink">{poolPct}%</b>
            </label>
            <input
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={poolPct}
              onChange={(e) => setPoolPct(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-inkMuted">
              {t("trAdMaxSupply")}
            </label>
            <input
              type="number"
              min={1}
              value={maxSupply}
              onChange={(e) =>
                setMaxSupply(Math.max(1, Number(e.target.value) || 0))
              }
              className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2 font-mono text-sm text-ink"
            />
            <p className="mt-1 text-xs text-inkMuted">
              {t("trAdMaxSupplyNote")}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-inkMuted">
            {t("trAdFdv")}
          </label>
          <div className="flex flex-wrap gap-2">
            {FDV_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFdv(opt)}
                className={`border px-3 py-1.5 text-xs ${
                  fdv === opt
                    ? "border-steel bg-steel/20 text-steelBright"
                    : "border-concreteMuted/40 text-inkMuted hover:bg-slab"
                }`}
              >
                {formatUsd(opt)}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-concreteMuted/30 pt-4">
          <div className="text-xs uppercase tracking-wide text-inkMuted">
            {t("trAdEstAlloc")}
          </div>
          <div className="mt-1 space-y-1 font-mono text-sm">
            <div className="flex justify-between text-inkMuted">
              <span>{t("trAdPool", { pct: poolPct, supply: maxSupply.toLocaleString() })}</span>
              <span className="text-ink">
                {Math.round(airdropPoolTokens).toLocaleString()} $CT
              </span>
            </div>
            <div className="flex justify-between text-inkMuted">
              <span>{t("trAdShare")}</span>
              <span className="text-ink">{(yourShare * 100).toFixed(4)}%</span>
            </div>
            <div className="flex justify-between text-inkMuted">
              <span>{t("trAdEstCt")}</span>
              <span className="text-brass">
                {Math.round(yourTokens).toLocaleString()} $CT
              </span>
            </div>
            <div className="flex justify-between text-inkMuted">
              <span>
                {t("trAdAtFdv", { fdv: formatUsd(fdv), price: tokenPrice.toFixed(4) })}
              </span>
              <span className="text-ink">
                ≈ $
                {yourUsdValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {totalReady && (
          <>
        <ShareButtons text={shareText} />
        <ShareCardImage
          kicker={t("trAdKicker")}
          headline={`${Math.round(yourTokens).toLocaleString()} $CT`}
          headlineLabel={t("trAdHypothetical")}
          wallet={wallet}
          filename={`concrete-airdrop-estimate-${wallet.slice(0, 8)}`}
          stats={[
            {
              label: t("trAdAtFdvShort", { fdv: formatUsd(fdv) }),
              value: `≈ $${yourUsdValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}`,
              accent: true,
            },
            { label: t("trAdBasedOnPoints"), value: myPoints.toLocaleString() },
            { label: t("trAdPoolShare"), value: `${(yourShare * 100).toFixed(3)}%` },
          ]}
        />
          </>
        )}
      </div>
    </section>
  );
}
