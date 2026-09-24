"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleProvider";
import { useVT } from "@/lib/vault/dictionary";
import { LanguageToggle } from "./LanguageToggle";
import { DocSearch } from "./DocSearch";

export function SiteHeader() {
  const { t } = useLocale();
  const v = useVT();

  return (
    <header className="sticky top-0 z-40 bg-paper">
      <div aria-hidden className="h-[5px] w-full bg-rebar" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-8">
        <Link href="/" className="focus-ring group flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">{t.nav.brand}</span>
          <span className="mt-0.5 text-[11px] text-inkfaint">{t.nav.unofficial}</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/vault"
            className="focus-ring hidden whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-semibold text-blueprint transition-colors hover:text-rebar sm:inline-block"
          >
            {v("navLabel")}
          </Link>
          <Link
            href="/tracker"
            className="focus-ring hidden whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-semibold text-blueprint transition-colors hover:text-rebar sm:inline-block"
          >
            Wallet Tracker
          </Link>
          <Link
            href="/check"
            className="focus-ring hidden whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-semibold text-blueprint transition-colors hover:text-rebar sm:inline-block"
          >
            Is this official?
          </Link>
          <DocSearch />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
