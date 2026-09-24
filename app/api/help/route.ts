import { DOCS_LAST_VERIFIED, docsAreStale } from "@/content/docs.meta";
import { locales, type Locale } from "@/lib/i18n";
import { HELP_LIMITS, type DocTopicId, type HelpSource, type HelpTurn, type StreamEvent } from "@/lib/helpProtocol";
import { randomUUID } from "node:crypto";
import { completeText, llmConfig, LlmError, streamText, withTimeout, type LlmConfig } from "@/lib/help/anthropic";
import { ControlPrefixParser } from "@/lib/help/control";
import {
  chunkAnchors, chunkLabel, isConfident, renderChunk, search, stripMd, type Hit,
} from "@/lib/help/corpus";
import { looksLikeSecret, wantsAdvice } from "@/lib/help/guard";
import { buildMessages, buildSystem, REWRITE_SYSTEM } from "@/lib/help/prompt";
import { clientKey, rateLimit, recordEvent, takeBudget } from "@/lib/help/store";
import { tokenize } from "@/lib/help/text";
import { TOPIC_DOCS, isDocTopic } from "@/lib/help/topics";

// Help Center endpoint.
//
//   POST /api/help  { q | topic, lang, history? }  → NDJSON stream of StreamEvent (lib/helpProtocol.ts)
//     RAG: retrieve the relevant guide sections (BM25 over all six languages), have Claude answer in
//     the user's language from those sections only, stream it, and report which pages it used.
//     When the AI can't be used (no key, daily budget, rate limit, upstream error) the stream says
//     mode "fallback" and the client runs its own local keyword search instead.
//
//   GET /api/help?q=…  → { results } plain keyword search (no AI) — kept for backward compatibility.
//
// Env: ANTHROPIC_API_KEY (required for AI), HELP_MODEL, HELP_DAILY_LLM_LIMIT — see .env.example.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const enc = new TextEncoder();
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

// Circuit breaker: after 3 consecutive upstream failures, skip the AI for a minute.
let failures = 0;
let openUntil = 0;

// Topic-chip answers are identical for everyone, so cache them (per instance) and skip the model.
const topicCache = new Map<string, { text: string; sources: HelpSource[] }>();

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (locales as readonly string[]).includes(v);
}

function parseHistory(v: unknown): HelpTurn[] {
  if (!Array.isArray(v)) return [];
  const out: HelpTurn[] = [];
  for (const t of v.slice(-HELP_LIMITS.history)) {
    if (!t || typeof t !== "object") continue;
    const { role, text } = t as Record<string, unknown>;
    if ((role === "user" || role === "assistant") && typeof text === "string" && text.trim()) {
      out.push({ role, text: text.slice(0, HELP_LIMITS.turn) });
    }
  }
  return out;
}

// Scripts where lexical matching is weakest → always ask the model for English search keywords too.
const NON_LATIN = /[\u0600-\u06ff\u0900-\u097f\u0980-\u09ff\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u0400-\u04ff]/;

/** A very short follow-up ("and fees?") is searched together with the previous question. */
function buildQuery(q: string, history: HelpTurn[]): string {
  if (tokenize(q).length >= 3) return q;
  const prev = [...history].reverse().find((h) => h.role === "user");
  return prev ? `${prev.text} ${q}` : q;
}

function mergeHits(a: Hit[], b: Hit[], limit: number): Hit[] {
  const norm = (hs: Hit[]) => {
    const top = hs[0]?.score || 1;
    return hs.map((h) => ({ h, s: h.score / top }));
  };
  const best = new Map<string, { h: Hit; s: number }>();
  for (const x of [...norm(a), ...norm(b)]) {
    const prev = best.get(x.h.chunk.id);
    if (!prev || x.s > prev.s) best.set(x.h.chunk.id, x);
  }
  return Array.from(best.values()).sort((x, y) => y.s - x.s).slice(0, limit).map((x) => x.h);
}

/** Keep the strongest sections only (≥45 % of the best score), at most 5. */
function pick(hits: Hit[]): Hit[] {
  if (hits.length === 0) return [];
  const top = hits[0].score;
  return hits.filter((h, i) => i === 0 || h.score >= top * 0.45).slice(0, 5);
}

function sourcesOf(hits: Hit[], lang: Locale): HelpSource[] {
  const seen = new Set<string>();
  const out: HelpSource[] = [];
  for (const h of hits) {
    if (seen.has(h.chunk.slug)) continue;
    seen.add(h.chunk.slug);
    out.push({
      slug: h.chunk.slug,
      title: h.chunk.docTitle,
      heading: chunkLabel(h.chunk, lang),
      anchors: chunkAnchors(h.chunk),
    });
    if (out.length === 3) break;
  }
  return out;
}

export async function POST(req: Request): Promise<Response> {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const key = clientKey(req);
  if (!rateLimit(`hard:${key}`, 40, 60_000)) return json({ error: "rate" }, 429);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 12_000) return json({ error: "too_large" }, 413);
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const lang: Locale = isLocale(body.lang) ? body.lang : "en";
  const topic: DocTopicId | undefined = isDocTopic(body.topic) ? body.topic : undefined;
  const q = topic ? "" : (typeof body.q === "string" ? body.q : "").trim().slice(0, HELP_LIMITS.question);
  if (!topic && !q) return json({ error: "empty" }, 400);
  const history = parseHistory(body.history);

  const ctrl = new AbortController();
  req.signal.addEventListener("abort", () => ctrl.abort());
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (ev: StreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(enc.encode(`${JSON.stringify(ev)}\n`));
        } catch {
          closed = true;
        }
      };
      try {
        await answer({ key, lang, topic, q, history, signal: ctrl.signal, emit });
      } catch (e) {
        console.error("help route error", e);
        emit({ t: "error", code: "internal" });
      } finally {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        }
      }
    },
    cancel() {
      closed = true;
      ctrl.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}

type Ctx = {
  key: string;
  lang: Locale;
  topic?: DocTopicId;
  q: string;
  history: HelpTurn[];
  signal: AbortSignal;
  emit: (ev: StreamEvent) => void;
};

async function answer(ctx: Ctx): Promise<void> {
  const { key, lang, topic, q, history, signal, emit } = ctx;
  const qid = randomUUID();
  const verifiedAt = DOCS_LAST_VERIFIED;
  const stale = docsAreStale();
  const meta = (mode: "llm" | "none" | "blocked" | "fallback", sources: HelpSource[] = []) =>
    emit({ t: "meta", qid, mode, sources, verifiedAt, stale });

  // 1) Seed phrases / private keys: never forward, never log.
  if (q && looksLikeSecret(q)) {
    meta("blocked");
    emit({ t: "end", advice: false, unanswered: false, reason: "seed" });
    return;
  }

  // 2) Topic chips: cached, doc-scoped.
  const cacheKey = topic ? `${topic}:${lang}:${DOCS_LAST_VERIFIED}` : "";
  if (topic) {
    const hit = topicCache.get(cacheKey);
    if (hit) {
      meta("llm", hit.sources);
      emit({ t: "delta", d: hit.text });
      emit({ t: "end", advice: false, unanswered: false });
      await recordEvent({ k: "answer", lang, mode: "llm", advice: false, unanswered: false, topic, top: hit.sources[0]?.slug });
      return;
    }
  }

  // 3) Can we use the AI right now?
  const cfg: LlmConfig | null = llmConfig();
  const fallback = async () => {
    meta("fallback");
    emit({ t: "end", advice: false, unanswered: false, reason: "unavailable" });
    await recordEvent({ k: "answer", lang, mode: "fallback", advice: false, unanswered: false, topic });
  };
  if (!cfg || Date.now() < openUntil) return fallback();

  // 4) Retrieve.
  let res = topic
    ? search(TOPIC_DOCS[topic].query, { slug: TOPIC_DOCS[topic].slug, locales: ["en"], limit: 4 })
    : search(buildQuery(q, history), { limit: 6, preferLocale: lang });
  if (topic && res.hits.length === 0) return fallback();

  // Cheap per-IP and global limits apply to the model call itself (not to retrieval).
  if (!rateLimit(`llm:${key}`, 8, 60_000) || !(await takeBudget())) return fallback();

  // 5) Weak retrieval or a script the lexical index handles poorly → have the model translate the
  //    question into English search keywords and search again.
  if (!topic && (!isConfident(res.hits[0]) || NON_LATIN.test(q))) {
    const t = withTimeout(signal, 8000);
    try {
      const kw = await completeText(cfg, {
        system: REWRITE_SYSTEM,
        messages: [{ role: "user", content: q }],
        maxTokens: 40,
        signal: t.signal,
      });
      if (kw && !/^none\b/i.test(kw)) {
        const second = search(kw.slice(0, 160), { limit: 6, preferLocale: lang });
        res = { ...res, hits: mergeHits(res.hits, second.hits, 6) };
      }
    } catch {
      /* keep the original retrieval */
    } finally {
      t.done();
    }
  }

  const chosen = pick(res.hits);
  if (chosen.length === 0) {
    meta("none");
    emit({ t: "end", advice: false, unanswered: true, reason: "nohits" });
    await recordEvent({ k: "answer", lang, mode: "none", advice: false, unanswered: true });
    await recordEvent({ k: "unanswered", lang, mode: "none", q });
    return;
  }

  const sources = sourcesOf(chosen, lang);
  const system = buildSystem({
    uiLang: lang,
    forceLang: !!topic,
    verifiedAt,
    excerpts: chosen.map((h) => ({
      page: h.chunk.docTitle,
      section: stripMd(chunkLabel(h.chunk, "en")),
      text: renderChunk(h.chunk, "en", { code: true }).slice(0, 1500),
    })),
  });
  const messages = topic
    ? [{ role: "user" as const, content: TOPIC_DOCS[topic].question }]
    : buildMessages(history, q, { turn: HELP_LIMITS.turn, turns: HELP_LIMITS.history });

  // 6) Stream the answer.
  const parser = new ControlPrefixParser();
  let metaSent = false;
  let text = "";
  const send = (d: string) => {
    if (!d) return;
    if (!metaSent) {
      metaSent = true;
      meta("llm", sources);
    }
    text += d;
    emit({ t: "delta", d });
  };

  const t = withTimeout(signal, 45_000);
  try {
    for await (const piece of streamText(cfg, { system, messages, maxTokens: 700, signal: t.signal })) {
      send(parser.push(piece));
    }
    send(parser.flush());
    failures = 0;
  } catch (e) {
    if (signal.aborted) return; // the user pressed Stop / left
    if (e instanceof LlmError) console.error("help llm error:", e.message);
    else console.error("help stream error", e);
    failures += 1;
    if (failures >= 3) openUntil = Date.now() + 60_000;
    if (!metaSent) return fallback();
    emit({ t: "error", code: "upstream" });
    return;
  } finally {
    t.done();
  }

  if (!metaSent) return fallback(); // model returned nothing

  const advice = parser.control.advice || (!!q && wantsAdvice(q));
  const unanswered = parser.control.noAnswer;
  emit({ t: "end", advice, unanswered });

  if (topic && !unanswered && text.length > 40) topicCache.set(cacheKey, { text, sources });
  await recordEvent({
    k: "answer", lang, mode: "llm", advice, unanswered, topic, top: sources[0]?.slug,
  });
  if (unanswered) await recordEvent({ k: "unanswered", lang, mode: "llm", q, top: sources[0]?.slug });
}

// Plain keyword search (no AI). Same response shape the pre-RAG client used.
export async function GET(req: Request): Promise<Response> {
  const q = (new URL(req.url).searchParams.get("q") || "").slice(0, HELP_LIMITS.question);
  if (!rateLimit(`get:${clientKey(req)}`, 30, 60_000)) return json({ results: [] }, 429);
  const { hits } = search(q, { limit: 6 });
  const seen = new Set<string>();
  const results = [];
  for (const h of hits) {
    if (seen.has(h.chunk.slug)) continue;
    seen.add(h.chunk.slug);
    results.push({
      slug: h.chunk.slug,
      title: h.chunk.docTitle,
      snippet: stripMd(renderChunk(h.chunk, "en")).slice(0, 170),
    });
    if (results.length === 3) break;
  }
  return json({ results });
}
