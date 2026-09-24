"use client";

import Link from "next/link";
import { docs } from "@/content/docs.generated";
import { useLocale } from "@/lib/LocaleProvider";

const SECTION_ORDER = ["beginner", "intermediate", "advanced", "ecosystem", "reference"] as const;

export function Sidebar({ activeSlug }: { activeSlug?: string }) {
  const { t } = useLocale();

  const sectionLabel: Record<(typeof SECTION_ORDER)[number], string> = {
    beginner: t.path.beginner,
    intermediate: t.path.intermediate,
    advanced: t.path.advanced,
    ecosystem: t.path.ecosystem,
    reference: t.path.reference,
  };

  return (
    <nav aria-label={t.sidebar.sections} className="text-sm">
      <Link
        href="/"
        className="focus-ring mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blueprint hover:text-rebar"
      >
        ← {t.sidebar.backHome}
      </Link>

      {SECTION_ORDER.map((section) => {
        const items = docs.filter((d) => d.section === section);
        if (items.length === 0) return null;
        return (
          <div key={section} className="mb-6">
            <p className="mb-2 border-b border-line pb-1 font-display text-xs font-semibold uppercase tracking-wide text-inkfaint">
              {sectionLabel[section]}
            </p>
            <ul className="space-y-1">
              {items.map((doc) => {
                const isActive = doc.slug === activeSlug;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`focus-ring block rounded-sm px-2 py-1.5 leading-snug transition-colors ${
                        isActive
                          ? "bg-blueprint text-paper"
                          : "text-ink/80 hover:bg-blueprint/10 hover:text-ink"
                      }`}
                    >
                      <span className="mr-1.5 font-mono text-xs text-rebar">{String(doc.order).padStart(2, "0")}</span>
                      {doc.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
