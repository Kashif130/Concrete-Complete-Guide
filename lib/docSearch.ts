// Client-side full-text search over the guide's doc pages (powers the Cmd/Ctrl+K palette).
//
// The index is built per locale from the same blocks the doc pages render (translated blocks when
// they exist, English otherwise), split into one entry per heading section so a result can deep-link
// to the matching heading. It is built lazily on first use — nothing here is bundled into pages that
// never open the palette (see the dynamic imports in components/DocSearch.tsx).

import { docs, type DocBlock } from "@/content/docs.generated";
import type { Locale } from "@/lib/i18n";
import { slugify } from "@/lib/slugify";
import { STOP } from "@/lib/stopwords";

export type PageRef = { slug: string; title: string; section: string; order: number };

export type SearchResult = PageRef & {
  href: string;
  heading: string; // matching section heading ("" when the match is the page intro)
  snippet: string;
  terms: string[]; // for highlighting
  score: number; // higher = better; only meaningful relative to other results of the same query
  cover: number; // 0–1: share of the (known) query terms found inside the returned section itself
};

type Section = {
  heading: string;
  anchor: string;
  body: string;
  headingLower: string;
  bodyLower: string;
};

type IndexedDoc = PageRef & { titleLower: string; sections: Section[] };

export type SearchIndex = IndexedDoc[];

const indexCache = new Map<Locale, Promise<SearchIndex>>();

function plain(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(b: DocBlock): string {
  switch (b.type) {
    case "p":
    case "quote":
      return plain(b.text);
    case "ul":
    case "ol":
      return b.items.map(plain).join(" ");
    case "table":
      return [
        b.headers.join(" "),
        ...b.rows.map((r) => r.filter((c) => c.trim() !== "" && c.trim() !== "-").join(" — ")),
      ]
        .map(plain)
        .join("; ");
    case "code":
      return b.code.replace(/\s+/g, " ").trim();
    default:
      return "";
  }
}

function sectionsFor(blocks: DocBlock[]): Section[] {
  const out: Section[] = [];
  let heading = "";
  let anchor = "";
  let parts: string[] = [];

  const flush = () => {
    const body = parts.join(" ").trim();
    if (!heading && !body) return;
    out.push({
      heading,
      anchor,
      body,
      headingLower: heading.toLowerCase(),
      bodyLower: body.toLowerCase(),
    });
  };

  for (const [i, b] of blocks.entries()) {
    // The one-line "Level · Read time" strip at the top of a page is page furniture, not content.
    if (i === 0 && b.type === "quote" && b.text.length < 160) continue;
    if (b.type === "heading") {
      flush();
      heading = plain(b.text);
      // Must mirror exactly how DocRenderer derives heading ids.
      anchor = slugify(b.text.replace(/\*\*|\*|`/g, ""));
      parts = [];
    } else {
      const t = blockText(b);
      if (t) parts.push(t);
    }
  }
  flush();
  return out;
}

async function build(locale: Locale): Promise<SearchIndex> {
  // The translations bundle is large — only pull it in when a non-English locale needs it.
  const translations = locale === "en" ? null : (await import("@/content/translations")).translations;
  return docs.map((d) => {
    const blocks = (translations && translations[d.slug]?.[locale]) || d.blocks;
    return {
      slug: d.slug,
      title: d.title,
      section: d.section,
      order: d.order,
      titleLower: d.title.toLowerCase(),
      sections: sectionsFor(blocks),
    };
  });
}

export function getIndex(locale: Locale): Promise<SearchIndex> {
  let p = indexCache.get(locale);
  if (!p) {
    p = build(locale);
    indexCache.set(locale, p);
    // Don't cache a failed build (e.g. chunk load error on a flaky network).
    p.catch(() => indexCache.delete(locale));
  }
  return p;
}

/** Every page, in reading order — what the palette shows before you type anything. */
export function listPages(): PageRef[] {
  return docs
    .map(({ slug, title, section, order }) => ({ slug, title, section, order }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

// Han/kana scripts have no spaces between words, so a whole sentence would never be a substring of
// the docs. We split those runs into overlapping bigrams and match on a share of them instead.
const CJK_RE = /[\u3040-\u30ff\u3400-\u9fff]/;

export function tokenize(query: string, dropStop = false): string[] {
  const words = query
    .toLowerCase()
    .split(/[\s"“”'‘’()?!,;:？！，。]+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (CJK_RE.test(w) && w.length > 2) {
      for (let i = 0; i < w.length - 1; i++) out.push(w.slice(i, i + 2));
    } else {
      out.push(w);
    }
  }
  const kept = dropStop ? out.filter((t) => t.length >= 2 && !STOP.has(t)) : out;
  return Array.from(new Set(kept)).slice(0, 8);
}

// Everyday words people type that the translated docs express differently (the zh pages say 提现 for
// "withdraw"; the hi/ur/pcm/id pages keep English terms like "withdraw"/"fee"). Applied only when the
// docs actually contain the replacement, so it never turns a query into something that can't match.
const SYNONYMS: Record<string, string[]> = {
  提款: ["提现"],
  取款: ["提现"],
  取出: ["提现"],
  手续费: ["费用"],
  निकासी: ["withdraw", "withdrawal"],
  निकालना: ["withdraw"],
  जमा: ["deposit"],
  शुल्क: ["fee", "fees"],
  फीस: ["fees", "fee"],
  जोखिम: ["risk"],
  नुकसान: ["loss"],
};

export type SearchOptions = {
  limit?: number;
  /** Share of query terms a page must contain (0–1). Default 1 (all), or 0.6 for Han/kana queries. */
  coverage?: number;
  /** Drop filler words ("what", "how", "kya", …) first — for natural-language questions. */
  dropStop?: boolean;
  /**
   * Ignore query terms that appear nowhere in the docs (typos, grammar bigrams) instead of letting them
   * sink the match. Defaults to on when `coverage` is given or the query is Han/kana; off for the
   * strict palette so "withdrawal xyzzy" honestly finds nothing.
   */
  ignoreUnknown?: boolean;
};

function snippetAround(body: string, bodyLower: string, terms: string[]): string {
  if (!body) return "";
  let pos = -1;
  for (const t of terms) {
    const i = bodyLower.indexOf(t);
    if (i !== -1 && (pos === -1 || i < pos)) pos = i;
  }
  if (pos === -1) return body.length > 130 ? `${body.slice(0, 130).trimEnd()}…` : body;
  const start = Math.max(0, pos - 45);
  const end = Math.min(body.length, start + 150);
  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}

/**
 * Rank pages for `query`. By default every term must appear somewhere in the page (title, a heading or
 * body text); with `coverage` < 1 a page needs only that share of the terms. The result shows the
 * page's best-matching section so the link lands where the match is.
 */
export function searchIndex(index: SearchIndex, query: string, opts: SearchOptions = {}): SearchResult[] {
  const { limit = 8, dropStop = false } = opts;
  let terms = tokenize(query, dropStop);
  if (terms.length === 0) return [];

  const hasCjk = terms.some((t) => CJK_RE.test(t));
  const isKnown = (t: string) =>
    index.some((d) => d.titleLower.includes(t) || d.sections.some((s) => s.headingLower.includes(t) || s.bodyLower.includes(t)));

  terms = Array.from(
    new Set(
      terms.map((t) => {
        const syn = SYNONYMS[t]?.find(isKnown);
        return syn ?? t;
      }),
    ),
  );

  const ignoreUnknown = opts.ignoreUnknown ?? (opts.coverage !== undefined || hasCjk);
  if (ignoreUnknown) {
    terms = terms.filter(isKnown);
    if (terms.length === 0) return [];
  }

  const coverage = opts.coverage ?? (hasCjk ? 0.5 : 1);
  const needed = Math.max(1, Math.ceil(terms.length * coverage - 1e-9));

  const results: SearchResult[] = [];

  for (const d of index) {
    const matched = terms.filter(
      (t) => d.titleLower.includes(t) || d.sections.some((s) => s.headingLower.includes(t) || s.bodyLower.includes(t)),
    ).length;
    if (matched < needed) continue;

    let titleScore = 0;
    for (const t of terms) if (d.titleLower.includes(t)) titleScore += 4;

    // Best section = the one holding the most query terms *together*, then heading hits, then body hits.
    let best: Section | null = null;
    let bestScore = -1;
    let bestCover = 0;
    for (const s of d.sections) {
      let sc = 0;
      let inSection = 0;
      for (const t of terms) {
        const inHeading = s.headingLower.includes(t);
        const at = s.bodyLower.indexOf(t);
        if (inHeading) sc += 6;
        if (at !== -1) sc += 2 + (at < 200 ? 1 : 0);
        if (inHeading || at !== -1) inSection++;
      }
      sc += inSection * 3;
      if (sc > bestScore) {
        bestScore = sc;
        best = s;
        bestCover = inSection / terms.length;
      }
    }

    const sec = best ?? d.sections[0];
    results.push({
      slug: d.slug,
      title: d.title,
      section: d.section,
      order: d.order,
      href: `/docs/${d.slug}${sec?.anchor ? `#${sec.anchor}` : ""}`,
      heading: sec?.heading ?? "",
      snippet: sec ? snippetAround(sec.body, sec.bodyLower, terms) : "",
      terms,
      score: titleScore + Math.max(bestScore, 0) + matched * 2,
      cover: bestCover,
    });
  }

  return results.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug)).slice(0, limit);
}

/**
 * A short summary of one page in the index's language, built from the page's own opening sections.
 * The help bot uses it to answer topic chips ("Fees", "Withdrawals"…) when the AI is unavailable, so
 * the text is always the guide's current wording — nothing is copied into the bot.
 */
export function pageSummary(
  index: SearchIndex,
  slug: string,
  maxChars = 460,
): { title: string; heading: string; snippet: string; href: string } | null {
  const d = index.find((x) => x.slug === slug);
  if (!d) return null;
  let text = "";
  let firstHeading = "";
  for (const s of d.sections) {
    if (!s.body) continue;
    if (!firstHeading) firstHeading = s.heading;
    text = text ? `${text} ${s.body}` : s.body;
    if (text.length >= maxChars) break;
  }
  if (!text) return null;
  const cut = text.length > maxChars ? `${text.slice(0, maxChars).replace(/\s+\S*$/, "")}…` : text;
  return { title: d.title, heading: firstHeading, snippet: cut, href: `/docs/${d.slug}` };
}
