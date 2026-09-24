"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleProvider";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="mt-16 border-t border-line bg-blueprint2 text-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-rebarlight">
          {t.footer.disclaimerTitle}
        </p>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-paper/80">{t.footer.disclaimer}</p>
        <p className="mt-6 text-xs text-paper/50">{t.footer.rights} · concrete.xyz · defillama.com</p>
        <p className="mt-2 text-xs text-paper/50">
          Built by{" "}
          <a
            href="https://x.com/mkashifalikcp"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-paper"
          >
            @mkashifalikcp
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/Kashif130/Concrete-Complete-Guide.git"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-paper"
          >
            GitHub
          </a>{" "}
          ·{" "}
          <Link href="/developers" className="underline decoration-dotted hover:text-paper">
            Public API
          </Link>
        </p>
      </div>
    </footer>
  );
}
