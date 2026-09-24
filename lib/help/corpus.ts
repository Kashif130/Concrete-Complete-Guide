// The help bot's knowledge base: the guide's own pages, chunked and indexed with BM25.
//
// * One canonical chunk layout is computed from the English pages. The translations are
//   block-for-block aligned with English (same block count/types/rows/items), so the same layout
//   applies to every language — a chunk id means the same section in all six languages.
// * Every (chunk, language) pair is indexed in ONE index, so a Roman-Urdu / Hindi / Chinese question
//   matches its own language's text directly (the old /api/help only searched English).
// * Results are grouped by canonical chunk. The LLM is fed the English text of the chunk (the
//   source of truth) and answers in the user's language.
//
// Server-only: pulls in the full docs + translations bundle. Never import from a client component.

import { docs, type DocBlock } from "@/content/docs.generated";
import { translations } from "@/content/translations";
import { locales, type Locale } from "@/lib/i18n";
import { slugify } from "@/lib/slugify";
import { expandConcepts } from "./concepts";
import { tokenize, unique } from "./text";

// ---------- chunk layout ----------

type Atom = { b: number; r: number; kind: "p" | "item" | "row" | "code" };

export type Chunk = {
  id: string;
  slug: string;
  docTitle: string;
  /** Block index of the nearest heading (level ≤ 3), or -1 for a page without headings. */
  head: number;
  atoms: Atom[];
};

const CHUNK_CAP = 1100; // chars of English per chunk
const TABLE_CAP = 500;
const CODE_CAP = 500;

const QUESTION_RE = /^\*\*[^*]{4,220}\?\*\*/; // FAQ entries: "**Is Concrete audited?** Yes - …"

export function stripMd(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function atomText(block: DocBlock, a: Atom): string {
  switch (block.type) {
    case "p":
    case "quote":
      return block.text;
    case "ul":
    case "ol":
      return block.items[a.r] ?? "";
    case "table":
      return (block.rows[a.r] ?? []).join(" ");
    case "code":
      return block.code.slice(0, CODE_CAP);
    default:
      return "";
  }
}

function layoutDoc(slug: string, docTitle: string, blocks: DocBlock[]): Chunk[] {
  const chunks: Chunk[] = [];
  let cur: Atom[] = [];
  let curLen = 0;
  let curTable = -1;
  let curHead = -1;
  let ctxHead = -1;
  let seenHeading = false;

  const flush = () => {
    if (cur.length > 0) chunks.push({ id: `${slug}#${chunks.length}`, slug, docTitle, head: curHead, atoms: cur });
    cur = [];
    curLen = 0;
    curTable = -1;
  };

  blocks.forEach((block, b) => {
    if (block.type === "heading") {
      if (block.level <= 3) {
        // A short intro before the first heading rides along with the first section.
        const mergePreamble = !seenHeading && curLen < 300;
        if (!mergePreamble) flush();
        seenHeading = true;
        ctxHead = b;
        curHead = b;
      }
      return;
    }
    if (block.type === "hr") return;

    const atoms: Atom[] = [];
    if (block.type === "p") {
      if (/^\*\*Jump to:\*\*/.test(block.text)) return;
      atoms.push({ b, r: -1, kind: "p" });
    } else if (block.type === "quote") {
      if (/^\*\*Level:\*\*/.test(block.text)) return;
      atoms.push({ b, r: -1, kind: "p" });
    } else if (block.type === "ul" || block.type === "ol") {
      block.items.forEach((_, r) => atoms.push({ b, r, kind: "item" }));
    } else if (block.type === "table") {
      block.rows.forEach((_, r) => atoms.push({ b, r, kind: "row" }));
    } else if (block.type === "code") {
      atoms.push({ b, r: -1, kind: "code" });
    }

    for (const a of atoms) {
      const text = atomText(block, a);
      const hard = a.kind === "p" && QUESTION_RE.test(text);
      const tableBreak = a.kind === "row" ? curTable !== a.b : curTable !== -1;
      const cap = a.kind === "row" ? TABLE_CAP : CHUNK_CAP;
      if (cur.length > 0 && (hard || tableBreak || curLen + text.length > cap)) flush();
      if (cur.length === 0) curHead = ctxHead;
      cur.push(a);
      curLen += text.length;
      curTable = a.kind === "row" ? a.b : -1;
    }
  });
  flush();
  return chunks;
}

// ---------- locale views ----------

function blocksFor(slug: string, locale: Locale): DocBlock[] | null {
  if (locale === "en") return docs.find((d) => d.slug === slug)?.blocks ?? null;
  return translations[slug]?.[locale] ?? null;
}

export function chunkHeading(chunk: Chunk, locale: Locale): string {
  const blocks = blocksFor(chunk.slug, locale) ?? blocksFor(chunk.slug, "en");
  const h = chunk.head >= 0 ? blocks?.[chunk.head] : undefined;
  return h && h.type === "heading" ? stripMd(h.text) : "";
}

/** Human label for a chunk: the FAQ question for FAQ entries, otherwise the section heading. */
export function chunkLabel(chunk: Chunk, locale: Locale): string {
  const blocks = blocksFor(chunk.slug, locale) ?? blocksFor(chunk.slug, "en");
  const first = chunk.atoms[0];
  const block = first ? blocks?.[first.b] : undefined;
  if (block && block.type === "p") {
    const m = block.text.match(QUESTION_RE);
    if (m) return stripMd(m[0]);
  }
  return chunkHeading(chunk, locale);
}

/** Anchor id per language for the chunk's heading (empty for non-Latin headings → link to page top). */
export function chunkAnchors(chunk: Chunk): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    const blocks = blocksFor(chunk.slug, l);
    const h = chunk.head >= 0 ? blocks?.[chunk.head] : undefined;
    if (h && h.type === "heading") {
      const id = slugify(h.text.replace(/\*\*|\*|`/g, ""));
      if (id) out[l] = id;
    }
  }
  return out;
}

/** Readable text of a chunk in `locale` (English fallback). Code blocks are only for the LLM. */
export function renderChunk(chunk: Chunk, locale: Locale, opts: { code?: boolean } = {}): string {
  const blocks = blocksFor(chunk.slug, locale) ?? blocksFor(chunk.slug, "en") ?? [];
  const lines: string[] = [];
  let lastTable = -1;
  for (const a of chunk.atoms) {
    const block = blocks[a.b];
    if (!block) continue;
    if (a.kind === "p") {
      lines.push(atomText(block, a));
    } else if (a.kind === "item") {
      lines.push(`${block.type === "ol" ? `${a.r + 1}.` : "•"} ${atomText(block, a)}`);
    } else if (a.kind === "row" && block.type === "table") {
      if (lastTable !== a.b) {
        lines.push(`(${block.headers.map(stripMd).join(" | ")})`);
        lastTable = a.b;
      }
      const cells = (block.rows[a.r] ?? []).filter((c) => c.trim() !== "" && c.trim() !== "-");
      const [first, ...rest] = cells;
      if (first !== undefined) {
        const lead = first.startsWith("**") ? first : `**${first}**`;
        lines.push(`• ${[lead, ...rest].join(" — ")}`);
      }
    } else if (a.kind === "code" && opts.code) {
      lines.push(`\`\`\`\n${atomText(block, a)}\n\`\`\``);
    }
  }
  return lines.join("\n");
}

// ---------- index ----------

type Passage = { chunk: number; locale: Locale; len: number; tf: Map<string, number> };
type Index = {
  chunks: Chunk[];
  passages: Passage[];
  postings: Map<string, Array<[number, number]>>; // term → [passage, tf]
  /** Average passage length per language — Chinese passages are far shorter than English ones. */
  avgLen: Record<Locale, number>;
};

let INDEX: Index | null = null;

const W_HEADING = 3;
const W_TITLE = 2;

function build(): Index {
  const chunks: Chunk[] = [];
  const passages: Passage[] = [];
  const postings = new Map<string, Array<[number, number]>>();
  const totalLen = Object.fromEntries(locales.map((l) => [l, 0])) as Record<Locale, number>;
  const count = Object.fromEntries(locales.map((l) => [l, 0])) as Record<Locale, number>;

  for (const d of docs) {
    const layout = layoutDoc(d.slug, d.title, d.blocks);
    const titleTerms = tokenize(d.title);
    for (const chunk of layout) {
      const ci = chunks.length;
      chunks.push(chunk);
      for (const locale of locales) {
        const blocks = blocksFor(d.slug, locale);
        if (!blocks) continue;
        const tf = new Map<string, number>();
        const add = (terms: string[], w: number) => {
          for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + w);
        };
        add(titleTerms, W_TITLE);
        const h = chunk.head >= 0 ? blocks[chunk.head] : undefined;
        if (h && h.type === "heading") add(tokenize(h.text), W_HEADING);
        for (const a of chunk.atoms) {
          const block = blocks[a.b];
          if (block) add(tokenize(atomText(block, a)), 1);
        }
        let len = 0;
        for (const v of tf.values()) len += v;
        const pi = passages.length;
        passages.push({ chunk: ci, locale, len, tf });
        totalLen[locale] += len;
        count[locale] += 1;
        for (const [term, n] of tf) {
          let list = postings.get(term);
          if (!list) postings.set(term, (list = []));
          list.push([pi, n]);
        }
      }
    }
  }
  const avgLen = Object.fromEntries(locales.map((l) => [l, totalLen[l] / Math.max(1, count[l])])) as Record<Locale, number>;
  return { chunks, passages, postings, avgLen };
}

export function getIndex(): Index {
  if (!INDEX) INDEX = build();
  return INDEX;
}

// ---------- search ----------

export type Hit = {
  chunk: Chunk;
  score: number;
  /** Share (0–1) of the query's informative weight that this chunk explains. */
  coverage: number;
  locale: Locale;
};

export type SearchResult = { hits: Hit[]; concepts: string[]; knownTerms: number };

export type SearchOptions = {
  limit?: number;
  /** Restrict to one page. */
  slug?: string;
  /** Only consider passages in these languages (topic lookups use ["en"]). */
  locales?: Locale[];
  /** Small tie-break bonus for the user's own language. */
  preferLocale?: Locale;
};

const BRAND = new Set(["concrete"]);
export const OVERVIEW_SLUG = "01-beginner/01-what-is-concrete";

function overview(limit: number, only?: Locale[]): SearchResult {
  const idx = getIndex();
  const hits: Hit[] = [];
  idx.passages.forEach((p) => {
    const chunk = idx.chunks[p.chunk];
    if (chunk.slug !== OVERVIEW_SLUG || hits.some((h) => h.chunk === chunk)) return;
    if (only && !only.includes(p.locale)) return;
    hits.push({ chunk, score: 10 - hits.length, coverage: 1, locale: p.locale });
  });
  return { hits: hits.slice(0, Math.min(limit, 3)), concepts: ["overview"], knownTerms: 1 };
}

const K1 = 1.2;
const B = 0.75;
const EXPANSION_WEIGHT = 0.35;

export function search(query: string, opts: SearchOptions = {}): SearchResult {
  const idx = getIndex();
  const { limit = 5, slug, locales: only, preferLocale } = opts;
  const N = idx.passages.length;
  const idfOf = (df: number) => Math.log(1 + (N - df + 0.5) / (df + 0.5));

  const allTerms = unique(tokenize(query)).slice(0, 14);
  // The brand name is in every page, so it carries no signal — unless it is all there is
  // ("Concrete kya hai?", "什么是 Concrete"): then the question is "what is this?" → overview page.
  const qTerms = allTerms.filter((t) => !BRAND.has(t));
  if (qTerms.length === 0 && allTerms.length > 0) return overview(limit, only);
  const { concepts, extra } = expandConcepts(qTerms);

  // Each of the user's own terms is "satisfied" by a passage if it contains the term itself or any
  // alias of a concept the term belongs to (fee ≈ शुल्क ≈ 费用). Terms the corpus has never seen but
  // whose concept it knows (a Hindi word only the aliases cover) still count, at the alias' idf.
  const origMass = new Map<string, number>();
  for (const t of qTerms) {
    const df = idx.postings.get(t)?.length;
    if (df) origMass.set(t, idfOf(df));
  }
  const expansionOrigins = new Map<string, string[]>();
  for (const e of extra.slice(0, 30)) {
    expansionOrigins.set(e.term, e.origins);
    const df = idx.postings.get(e.term)?.length;
    if (!df) continue;
    for (const o of e.origins) origMass.set(o, Math.max(origMass.get(o) ?? 0, idfOf(df)));
  }
  let totalMass = 0;
  for (const m of origMass.values()) totalMass += m;
  const knownTerms = qTerms.filter((t) => idx.postings.has(t)).length;

  const scores = new Map<number, number>();
  const satisfied = new Map<number, Set<string>>();
  const mark = (pi: number, origin: string) => {
    let s = satisfied.get(pi);
    if (!s) satisfied.set(pi, (s = new Set()));
    s.add(origin);
  };

  const scan = (term: string, weight: number, origins: string[]) => {
    const list = idx.postings.get(term);
    if (!list) return;
    const idf = idfOf(list.length);
    for (const [pi, tf] of list) {
      const p = idx.passages[pi];
      if (only && !only.includes(p.locale)) continue;
      if (slug && idx.chunks[p.chunk].slug !== slug) continue;
      const norm = tf + K1 * (1 - B + (B * p.len) / idx.avgLen[p.locale]);
      scores.set(pi, (scores.get(pi) ?? 0) + weight * idf * ((tf * (K1 + 1)) / norm));
      for (const o of origins) mark(pi, o);
    }
  };
  for (const t of qTerms) scan(t, 1, [t]);
  for (const [term, origins] of expansionOrigins) scan(term, EXPANSION_WEIGHT, origins);

  // Best passage per canonical chunk.
  const best = new Map<number, Hit>();
  for (const [pi, raw] of scores) {
    const p = idx.passages[pi];
    const score = raw * (preferLocale && p.locale === preferLocale ? 1.06 : 1);
    const prev = best.get(p.chunk);
    if (!prev || score > prev.score) {
      let got = 0;
      for (const o of satisfied.get(pi) ?? []) got += origMass.get(o) ?? 0;
      best.set(p.chunk, {
        chunk: idx.chunks[p.chunk],
        score,
        coverage: totalMass > 0 ? Math.min(1, got / totalMass) : 0,
        locale: p.locale,
      });
    }
  }

  const hits = Array.from(best.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return { hits, concepts, knownTerms };
}

/** A hit is "confident" when it explains most of what was asked and clears a minimum score. */
export function isConfident(top: Hit | undefined): boolean {
  return !!top && top.coverage >= 0.5 && top.score >= 2.5;
}
