"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleProvider";
import { LiveStats } from "@/components/LiveStats";
import CtPriceLive from "@/components/CtPriceLive";
import { CT_CONTRACT_ADDRESS } from "@/lib/ctToken";
import { useVT, type VKey } from "@/lib/vault/dictionary";

const SNAPSHOT = [
  { key: "assetsOnPlatform", value: "$902.3M" },
  { key: "assetsProcessed", value: "$11.25B" },
  { key: "deposits", value: "$1.296B" },
  { key: "volume", value: "$23.48B" },
  { key: "depositors", value: "53.76K" },
] as const;

const PATH = [
  { key: "beginner", href: "/docs/01-beginner/01-what-is-concrete" },
  { key: "intermediate", href: "/docs/02-intermediate/01-vault-catalog" },
  { key: "advanced", href: "/docs/03-advanced/01-architecture-deep-dive" },
  { key: "ecosystem", href: "/docs/04-ecosystem/01-tools-catalog" },
  { key: "reference", href: "/docs/05-reference/01-faq-a-to-z" },
] as const;

// Directory of everything the Vault Terminal offers (the Guide's take on the Streamlit Home.py dashboard).
// Terminal tabs deep-link to /vault?tab=<id>; the tracker features all live on /tracker.
const TOOLS: { href: string; title: VKey; desc: VKey }[] = [
  { href: "/vault?tab=overview", title: "tabOverview", desc: "dashDescOverview" },
  { href: "/vault?tab=simulator", title: "tabSimulator", desc: "dashDescSimulator" },
  { href: "/vault?tab=health", title: "tabHealth", desc: "dashDescHealth" },
  { href: "/vault?tab=analytics", title: "tabAnalytics", desc: "dashDescAnalytics" },
  { href: "/vault?tab=compare", title: "tabCompare", desc: "dashDescCompare" },
  { href: "/vault?tab=rebalancer", title: "tabRebalancer", desc: "dashDescRebalancer" },
  { href: "/vault?tab=gas", title: "tabGas", desc: "dashDescGas" },
  { href: "/vault?tab=calendar", title: "tabCalendar", desc: "dashDescCalendar" },
  { href: "/vault?tab=reviews", title: "tabReviews", desc: "dashDescReviews" },
  { href: "/vault?tab=faq", title: "tabFaq", desc: "dashDescFaq" },
  { href: "/tracker/positions", title: "dashTitleTracker", desc: "dashDescTracker" },
  { href: "/tracker", title: "dashTitlePoints", desc: "dashDescPoints" },
  { href: "/tracker/airdrop", title: "dashTitleCt", desc: "dashDescCt" },
  { href: "/tracker/airdrop", title: "dashTitleAirdrop", desc: "dashDescAirdrop" },
  { href: "/tracker/quiz", title: "dashTitleQuiz", desc: "dashDescQuiz" },
  { href: "/developers", title: "dashTitleDevelopers", desc: "dashDescDevelopers" },
];

export default function HomePage() {
  const { t } = useLocale();
  const v = useVT();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-8">
        <CtPriceLive contractAddress={CT_CONTRACT_ADDRESS} />
      </div>

      <section className="relative overflow-hidden bg-blueprintgrid bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold leading-[1.08] text-ink md:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-ink/80 md:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={PATH[0].href}
                className="focus-ring rounded-sm bg-blueprint px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-blueprint2"
              >
                {t.hero.ctaPrimary}
              </Link>
              <Link
                href="/docs/05-reference/02-glossary"
                className="focus-ring rounded-sm border border-ink/25 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-rebar hover:text-rebar"
              >
                {t.hero.ctaSecondary}
              </Link>
              <Link
                href="/vault"
                className="focus-ring rounded-sm border border-rebar/60 px-5 py-2.5 text-sm font-semibold text-rebar transition-colors hover:bg-rebar hover:text-paper"
              >
                {v("ctaTerminal")}
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
            <LiveStats />

            <div className="rounded-sm border border-line bg-paper2/60 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-inkfaint">
                {t.snapshot.heading}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {SNAPSHOT.map((s) => (
                  <div key={s.key}>
                    <p className="font-display text-xl font-medium text-ink">{s.value}</p>
                    <p className="text-xs text-inkfaint">{t.snapshot[s.key]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-inkfaint">
                {t.snapshot.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink">{t.model.heading}</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
          {(["deposit", "get", "earn", "use"] as const).map((step, idx) => (
            <div key={step} className="bg-paper p-5">
              <span className="font-mono text-xs text-rebar">{String(idx + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-display text-lg font-medium text-ink">{t.model[step]}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-inkfaint">
                {t.model[`${step}Desc` as "depositDesc"]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink">{t.path.heading}</h2>
        <p className="mt-2 text-sm text-inkfaint">{t.path.subheading}</p>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {PATH.map((stage, idx) => (
            <Link
              key={stage.key}
              href={stage.href}
              className="focus-ring group flex items-start justify-between gap-6 py-5 transition-colors hover:bg-blueprint/[0.04]"
            >
              <div className="flex gap-5">
                <span className="font-display text-2xl font-medium text-line group-hover:text-rebar">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-lg font-medium text-ink">{t.path[stage.key]}</p>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-inkfaint">
                    {t.path[`${stage.key}Desc` as "beginnerDesc"]}
                  </p>
                </div>
              </div>
              <span className="hidden shrink-0 self-center text-sm font-medium text-blueprint group-hover:text-rebar sm:block">
                {t.path.readMore}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-paper2/40">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink">{v("dashHeading")}</h2>
          <p className="mt-2 text-sm text-inkfaint">{v("dashSub")}</p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <li key={tool.title} className="bg-paper">
                <Link
                  href={tool.href}
                  className="focus-ring group flex h-full flex-col justify-between gap-4 p-5 transition-colors hover:bg-blueprint/[0.04]"
                >
                  <div>
                    <p className="font-display text-lg font-medium text-ink group-hover:text-rebar">{v(tool.title)}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-inkfaint">{v(tool.desc)}</p>
                  </div>
                  <span className="text-sm font-medium text-blueprint group-hover:text-rebar">{v("dashOpen")} →</span>
                </Link>
              </li>
            ))}
            {/* 16 cards: exact at sm:2-col needs none; at lg:3-col (16%3=1) needs 2
                fillers to complete the row. If you add or remove a card, recompute. */}
            <li aria-hidden className="hidden bg-paper lg:block" />
            <li aria-hidden className="hidden bg-paper lg:block" />
          </ul>
        </div>
      </section>
    </>
  );
}
