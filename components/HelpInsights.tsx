"use client";

import { useState } from "react";

// Owner-only view of /api/help/report. The admin key (HELP_ADMIN_KEY) is typed here, kept in memory
// only, and sent as a Bearer header — it is never put in a URL or stored in the browser.

type Report = {
  days: number;
  totals: Record<string, number>;
  byLang: Record<string, number>;
  topPages: { slug: string; n: number }[];
  downPages: { slug: string; n: number }[];
  unanswered: { q: string; n: number; langs: string[]; last: number }[];
  thumbsDown: { q: string; n: number; slugs: string[]; last: number }[];
};

const when = (ts: number) => new Date(ts).toISOString().slice(0, 10);

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-line bg-paper px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-inkfaint">{label}</p>
      <p className="font-display text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export function HelpInsights() {
  const [key, setKey] = useState("");
  const [days, setDays] = useState(14);
  const [data, setData] = useState<Report | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/help/report?days=${days}`, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
      const body = (await res.json()) as Report & { error?: string; hint?: string };
      if (!res.ok) {
        setData(null);
        setErr(
          res.status === 401
            ? "Wrong key."
            : res.status === 404
              ? "Reports are disabled — set HELP_ADMIN_KEY on the server."
              : res.status === 501
                ? (body.hint ?? "Storage isn't configured (see .env.example).")
                : `Error ${res.status}`,
        );
      } else {
        setData(body);
      }
    } catch {
      setErr("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const t = data?.totals ?? {};
  const votes = (t.up ?? 0) + (t.down ?? 0);

  return (
    <div className="mt-6">
      <form onSubmit={load} className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-inkfaint">
          Admin key
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoComplete="off"
            className="focus-ring mt-1 block w-64 rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="text-xs text-inkfaint">
          Period
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="focus-ring mt-1 block rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            {[7, 14, 30, 90].map((d) => (
              <option key={d} value={d}>
                last {d} days
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={!key || loading}
          className="focus-ring rounded-sm bg-rebar px-4 py-2 text-sm font-semibold text-paper disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load"}
        </button>
      </form>
      {err && <p className="mt-3 text-sm text-rust">{err}</p>}

      {data && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Questions" value={t.q ?? 0} />
            <Stat label="Answered by AI" value={t["mode:llm"] ?? 0} />
            <Stat label="AI unavailable → local" value={t["mode:fallback"] ?? 0} />
            <Stat label="Not in the guide" value={t.unanswered ?? 0} />
            <Stat label="👍" value={t.up ?? 0} />
            <Stat label="👎" value={t.down ?? 0} />
            <Stat label="Helpful" value={votes ? `${Math.round(((t.up ?? 0) / votes) * 100)}%` : "—"} />
            <Stat label="Advice-type questions" value={t.advice ?? 0} />
          </div>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">Missing from the guide</h2>
            <p className="mt-1 text-xs text-inkfaint">Questions the bot could not answer from the docs (most asked first). Each is a candidate new section.</p>
            <List rows={data.unanswered.map((u) => ({ text: u.q, n: u.n, meta: `${u.langs.join(", ")} · ${when(u.last)}` }))} empty="Nothing unanswered in this period 🎉" />
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">Got a 👎</h2>
            <List rows={data.thumbsDown.map((u) => ({ text: u.q, n: u.n, meta: `${u.slugs.join(", ") || "—"} · ${when(u.last)}` }))} empty="No 👎 with text yet." />
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="font-display text-xl font-medium text-ink">Most used pages</h2>
              <List rows={data.topPages.map((p) => ({ text: p.slug, n: p.n }))} empty="—" />
            </section>
            <section>
              <h2 className="font-display text-xl font-medium text-ink">Pages with most 👎</h2>
              <List rows={data.downPages.map((p) => ({ text: p.slug, n: p.n }))} empty="—" />
            </section>
          </div>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">By language</h2>
            <List rows={Object.entries(data.byLang).sort((a, b) => b[1] - a[1]).map(([l, n]) => ({ text: l, n }))} empty="—" />
          </section>
        </div>
      )}
    </div>
  );
}

function List({ rows, empty }: { rows: { text: string; n: number; meta?: string }[]; empty: string }) {
  if (rows.length === 0) return <p className="mt-2 text-sm text-inkfaint">{empty}</p>;
  return (
    <ul className="mt-2 divide-y divide-line rounded-sm border border-line bg-paper">
      {rows.map((r, i) => (
        <li key={`${r.text}-${i}`} className="flex items-start justify-between gap-3 px-3 py-2 text-sm">
          <span className="min-w-0">
            <span className="break-words text-ink">{r.text}</span>
            {r.meta && <span className="block text-[11px] text-inkfaint">{r.meta}</span>}
          </span>
          <span className="shrink-0 font-mono text-xs text-rebar">×{r.n}</span>
        </li>
      ))}
    </ul>
  );
}
