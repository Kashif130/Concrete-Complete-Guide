"use client";

import type { DocEntry } from "@/content/docs.generated";
import { translations } from "@/content/translations";
import { useLocale } from "@/lib/LocaleProvider";
import { Sidebar } from "./Sidebar";
import { DocRenderer } from "./DocRenderer";

export function DocPageClient({ doc }: { doc: DocEntry }) {
  const { locale, t } = useLocale();

  const translatedBlocks = locale !== "en" ? translations[doc.slug]?.[locale] : undefined;
  const blocksToRender = translatedBlocks ?? doc.blocks;
  const isFallback = locale !== "en" && !translatedBlocks;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-7rem)] md:overflow-y-auto">
          <Sidebar activeSlug={doc.slug} />
        </aside>
        <article className="max-w-prose">
          <p className="font-mono text-xs text-rebar">{String(doc.order).padStart(2, "0")}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">{doc.title}</h1>
          {isFallback && (
            <p className="mt-4 rounded-sm border border-rebar/30 bg-rebar/5 px-4 py-2.5 text-sm text-ink/80">
              {t.doc.notTranslated}
            </p>
          )}
          <div className="mt-6">
            <DocRenderer blocks={blocksToRender} />
          </div>
        </article>
      </div>
    </div>
  );
}
