// Rate limiting, the daily AI budget, and the anonymous feedback / unanswered-question log.
//
// Storage: if UPSTASH_REDIS_REST_URL/TOKEN (or Vercel KV's KV_REST_API_URL/TOKEN) are set, events and
// counters are kept in Redis (REST — no client package). Without it, everything degrades gracefully:
// limits are per server instance, and events are only written to the server logs as JSON lines
// tagged "help_event" (Vercel → Logs). Nothing here ever stores an IP address or a user identifier.

import type { FeedbackRequest, HelpMode } from "@/lib/helpProtocol";
import type { Locale } from "@/lib/i18n";
import { redactForLog } from "./guard";

// ---------- rate limiting (in memory, per instance — best effort on serverless) ----------

const hits = new Map<string, number[]>();

/** Returns true if the call is allowed (and records it). */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "anon").trim() || "anon";
}

// ---------- Redis (REST) ----------

type Cmd = Array<string | number>;

function redisCfg(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

export function storageConfigured(): boolean {
  return redisCfg() !== null;
}

async function pipeline(cmds: Cmd[]): Promise<Array<{ result?: unknown; error?: string }> | null> {
  const cfg = redisCfg();
  if (!cfg) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${cfg.token}`, "content-type": "application/json" },
      body: JSON.stringify(cmds),
    });
    if (!res.ok) return null;
    return (await res.json()) as Array<{ result?: unknown; error?: string }>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- daily AI budget ----------

const day = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);
let memBudget = { day: "", n: 0 };

/** Global per-day cap on model calls (protects the API bill). HELP_DAILY_LLM_LIMIT, default 2000. */
export async function takeBudget(): Promise<boolean> {
  const limit = Number(process.env.HELP_DAILY_LLM_LIMIT ?? 2000);
  if (!Number.isFinite(limit) || limit <= 0) return false;
  const d = day();
  if (redisCfg()) {
    const key = `help:budget:${d}`;
    const out = await pipeline([["INCR", key], ["EXPIRE", key, 172800]]);
    const n = Number(out?.[0]?.result);
    if (Number.isFinite(n)) return n <= limit;
  }
  if (memBudget.day !== d) memBudget = { day: d, n: 0 };
  memBudget.n += 1;
  return memBudget.n <= limit;
}

// ---------- events ----------

export type LogEvent =
  | { k: "answer"; lang: Locale; mode: HelpMode | "local"; advice: boolean; unanswered: boolean; topic?: string; top?: string }
  | { k: "unanswered"; lang: Locale; mode: HelpMode | "local"; q: string; top?: string }
  | { k: "vote"; lang: Locale; mode: HelpMode | "local"; vote: "up" | "down"; slugs: string[]; q?: string };

const EVENTS_KEY = "help:events";
const EVENTS_MAX = 5000;
const TTL_SECONDS = 90 * 86400;

export async function recordEvent(ev: LogEvent): Promise<void> {
  // Text is redacted once, here, so no caller can forget.
  const safe: LogEvent = "q" in ev && ev.q ? { ...ev, q: redactForLog(ev.q) } : ev;
  console.log(JSON.stringify({ tag: "help_event", ts: new Date().toISOString(), ...safe }));
  if (!redisCfg()) return;

  const statsKey = `help:stats:${day()}`;
  const inc = (f: string): Cmd => ["HINCRBY", statsKey, f, 1];
  const cmds: Cmd[] = [];
  if (safe.k === "answer") {
    cmds.push(inc("q"), inc(`mode:${safe.mode}`), inc(`lang:${safe.lang}`));
    if (safe.advice) cmds.push(inc("advice"));
    if (safe.unanswered) cmds.push(inc("unanswered"));
    if (safe.topic) cmds.push(inc(`topic:${safe.topic}`));
    if (safe.top) cmds.push(inc(`page:${safe.top}`));
  } else if (safe.k === "vote") {
    cmds.push(inc(safe.vote));
    if (safe.vote === "down") for (const s of safe.slugs.slice(0, 3)) cmds.push(inc(`down:${s}`));
  }
  const storeText = safe.k === "unanswered" || (safe.k === "vote" && safe.vote === "down" && safe.q);
  if (storeText) {
    cmds.push(["LPUSH", EVENTS_KEY, JSON.stringify({ ts: Date.now(), ...safe })]);
    cmds.push(["LTRIM", EVENTS_KEY, 0, EVENTS_MAX - 1]);
    cmds.push(["EXPIRE", EVENTS_KEY, TTL_SECONDS]);
  }
  cmds.push(["EXPIRE", statsKey, TTL_SECONDS]);
  await pipeline(cmds);
}

/** Validate + normalise a client feedback payload into a LogEvent. Returns null if malformed. */
export function feedbackToEvent(body: unknown, validLangs: readonly string[]): LogEvent | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Partial<FeedbackRequest>;
  if (typeof b.lang !== "string" || !validLangs.includes(b.lang)) return null;
  const lang = b.lang as Locale;
  const modes = ["llm", "none", "blocked", "fallback", "local"];
  const mode = (typeof b.mode === "string" && modes.includes(b.mode) ? b.mode : "local") as HelpMode | "local";
  const q = typeof b.q === "string" ? b.q.slice(0, 300) : undefined;
  const slugs = Array.isArray(b.slugs) ? b.slugs.filter((s): s is string => typeof s === "string").map((s) => s.slice(0, 80)).slice(0, 5) : [];
  if (b.kind === "vote" && (b.vote === "up" || b.vote === "down")) {
    return { k: "vote", lang, mode, vote: b.vote, slugs, q: b.vote === "down" ? q : undefined };
  }
  if (b.kind === "unanswered" && q && q.trim()) return { k: "unanswered", lang, mode, q, top: slugs[0] };
  return null;
}

// ---------- report ----------

export type Report = {
  days: number;
  totals: Record<string, number>;
  byLang: Record<string, number>;
  topPages: Array<{ slug: string; n: number }>;
  downPages: Array<{ slug: string; n: number }>;
  unanswered: Array<{ q: string; n: number; langs: string[]; last: number }>;
  thumbsDown: Array<{ q: string; n: number; slugs: string[]; last: number }>;
};

function normQ(q: string): string {
  return q.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim();
}

export async function readReport(days: number): Promise<Report | null> {
  if (!redisCfg()) return null;
  const n = Math.min(Math.max(1, days), 90);
  const dayKeys = Array.from({ length: n }, (_, i) => `help:stats:${day(Date.now() - i * 86400000)}`);
  const out = await pipeline([...dayKeys.map((k): Cmd => ["HGETALL", k]), ["LRANGE", EVENTS_KEY, 0, 1999]]);
  if (!out) return null;

  const totals: Record<string, number> = {};
  const byLang: Record<string, number> = {};
  const pages: Record<string, number> = {};
  const down: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const flat = (out[i]?.result as string[] | undefined) ?? [];
    for (let j = 0; j + 1 < flat.length; j += 2) {
      const f = flat[j];
      const v = Number(flat[j + 1]) || 0;
      if (f.startsWith("lang:")) byLang[f.slice(5)] = (byLang[f.slice(5)] ?? 0) + v;
      else if (f.startsWith("page:")) pages[f.slice(5)] = (pages[f.slice(5)] ?? 0) + v;
      else if (f.startsWith("down:")) down[f.slice(5)] = (down[f.slice(5)] ?? 0) + v;
      else totals[f] = (totals[f] ?? 0) + v;
    }
  }
  const rank = (o: Record<string, number>) =>
    Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([slug, c]) => ({ slug, n: c }));

  const unanswered = new Map<string, { q: string; n: number; langs: Set<string>; last: number }>();
  const thumbsDown = new Map<string, { q: string; n: number; slugs: Set<string>; last: number }>();
  const cutoff = Date.now() - n * 86400000;
  for (const raw of ((out[n]?.result as string[] | undefined) ?? [])) {
    let e: { ts: number; k: string; q?: string; lang?: string; slugs?: string[] };
    try {
      e = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!e.q || e.ts < cutoff) continue;
    const key = normQ(e.q);
    if (!key) continue;
    if (e.k === "unanswered") {
      const cur = unanswered.get(key) ?? { q: e.q, n: 0, langs: new Set<string>(), last: 0 };
      cur.n++;
      if (e.lang) cur.langs.add(e.lang);
      cur.last = Math.max(cur.last, e.ts);
      unanswered.set(key, cur);
    } else if (e.k === "vote") {
      const cur = thumbsDown.get(key) ?? { q: e.q, n: 0, slugs: new Set<string>(), last: 0 };
      cur.n++;
      for (const s of e.slugs ?? []) cur.slugs.add(s);
      cur.last = Math.max(cur.last, e.ts);
      thumbsDown.set(key, cur);
    }
  }
  const top = <T extends { n: number; last: number }>(m: Map<string, T>) =>
    Array.from(m.values()).sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 50);

  return {
    days: n,
    totals,
    byLang,
    topPages: rank(pages),
    downPages: rank(down),
    unanswered: top(unanswered).map((u) => ({ q: u.q, n: u.n, langs: Array.from(u.langs), last: u.last })),
    thumbsDown: top(thumbsDown).map((u) => ({ q: u.q, n: u.n, slugs: Array.from(u.slugs), last: u.last })),
  };
}
