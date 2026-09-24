"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useVT } from "@/lib/vault/dictionary";

const TABS = [
  { href: "/tracker", key: "trTabBalance" },
  { href: "/tracker/leaderboard", key: "trTabLeaderboard" },
  { href: "/tracker/positions", key: "trTabPositions" },
  { href: "/tracker/airdrop", key: "trTabAirdrop" },
  { href: "/tracker/quiz", key: "trTabQuiz" },
] as const;

export default function TrackerShell({
  title,
  subtitle,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const pathname = usePathname();
  const v = useVT();

  return (
    <main className={`mx-auto px-6 py-14 ${wide ? "max-w-5xl" : "max-w-4xl"}`}>
      <p className="mb-2 font-mono text-xs text-steelBright">
        concrete.xyz · app.concrete.xyz · points.concrete.xyz
      </p>
      <h1 className="text-3xl text-ink sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-xl text-sm text-inkMuted">{subtitle}</p>}

      <nav className="mb-8 mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`focus-ring border px-3 py-1.5 text-xs transition-colors ${
                active
                  ? "border-steel bg-steel/20 text-steelBright"
                  : "border-concreteMuted/40 text-inkMuted hover:bg-slab"
              }`}
            >
              {v(t.key)}
            </Link>
          );
        })}
        <Link
          href="/tracker/vaults"
          className="focus-ring border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs text-brass transition-colors hover:bg-brass/20"
        >
          {v("trLiveVaults")}
        </Link>
      </nav>

      {children}

      <footer className="mt-16 border-t border-concreteMuted/30 pt-6 text-xs text-inkMuted">
        {v("trFooter")}
      </footer>
    </main>
  );
}
