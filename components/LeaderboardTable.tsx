"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useVT } from "@/lib/vault/dictionary";

type Row = { rank: number; address: string; points: number };
type Resp = {
  status: "ok" | "not_configured" | "error";
  rows?: Row[];
  totalUsers?: number | null;
  calculatedAt?: string | null;
  complete?: boolean;
  message?: string;
};

const PER_PAGE = 50;

export default function LeaderboardTable({
  highlightWallet,
  collapsible = false,
}: {
  highlightWallet?: string;
  /** Balance page: hidden until opened, then loads the top 1,000. */
  collapsible?: boolean;
}) {
  const t = useVT();
  const [open, setOpen] = useState(!collapsible);
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard?limit=1000");
      setData(await res.json());
    } catch (e) {
      setData({
        status: "error",
        message: e instanceof Error ? e.message : "Couldn't load leaderboard.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && !data && !loading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const rows = data?.rows ?? [];
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () => (q ? rows.filter((r) => r.address.toLowerCase().includes(q)) : rows),
    [rows, q]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);

  const hl = highlightWallet?.toLowerCase();
  const mineIdx = hl ? filtered.findIndex((r) => r.address.toLowerCase() === hl) : -1;
  const mine = mineIdx >= 0 ? filtered[mineIdx] : null;

  return (
    <section className="border border-concreteMuted/40 bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-concreteMuted/40 px-6 py-4">
        <div>
          <h2 className="text-lg text-ink">{t("trLbTitle")}</h2>
          <p className="text-xs text-inkMuted">
            {t("trLbSource")}
            {data?.calculatedAt
              ? t("trLbCalculated", {
                  date: new Date(data.calculatedAt).toLocaleString(),
                })
              : ""}
          </p>
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="focus-ring border border-concreteMuted/40 px-3 py-1.5 text-xs text-inkMuted hover:bg-slab"
          >
            {open ? t("trHide") : t("trShowTop")}
          </button>
        )}
      </header>

      {open && (
        <div className="px-6 py-5">
          {loading && <p className="text-sm text-inkMuted">{t("trLoading")}</p>}

          {data && data.status !== "ok" && (
            <p className="font-mono text-sm text-rust">{data.message}</p>
          )}

          {data?.status === "ok" && (
            <>
              {hl && (
                <p className="mb-3 border border-brass/50 bg-brass/10 px-3 py-2 text-sm text-brass">
                  {mine
                    ? t("trYourWallet", {
                        rank: mine.rank.toLocaleString(),
                        points: mine.points.toLocaleString(),
                      })
                    : t("trNotInTop")}
                  {mine && (
                    <button
                      type="button"
                      className="ml-3 underline"
                      onClick={() => setPage(Math.floor(mineIdx / PER_PAGE))}
                    >
                      {t("trJumpToMe")}
                    </button>
                  )}
                </p>
              )}

              {data.complete === false && (
                <p className="mb-3 text-xs text-rust">
                  {t("trLbPartial", { n: rows.length.toLocaleString() })}
                </p>
              )}

              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder={t("trSearch")}
                className="focus-ring mb-4 w-full border border-concreteMuted/40 bg-base px-3 py-2 font-mono text-sm text-ink placeholder:text-inkMuted/60"
              />

              <div className="space-y-0.5 font-mono text-xs">
                {slice.map((r) => {
                  const isMe = hl && r.address.toLowerCase() === hl;
                  return (
                    <div
                      key={r.address}
                      className={`flex justify-between gap-4 px-2 py-1 ${
                        isMe ? "bg-brass/15 text-ink" : "text-inkMuted"
                      }`}
                    >
                      <span>
                        <span className="inline-block w-12">#{r.rank.toLocaleString()}</span>
                        <span className="hidden sm:inline">{r.address}</span>
                        <span className="sm:hidden">
                          {r.address.slice(0, 6)}…{r.address.slice(-4)}
                        </span>
                      </span>
                      <span className="text-brass">{r.points.toLocaleString()}</span>
                    </div>
                  );
                })}
                {slice.length === 0 && (
                  <p className="text-inkMuted">{t("trNoMatches")}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-inkMuted">
                <button
                  type="button"
                  disabled={safePage === 0}
                  onClick={() => setPage(safePage - 1)}
                  className="border border-concreteMuted/40 px-3 py-1.5 hover:bg-slab disabled:opacity-40"
                >
                  {t("trPrev")}
                </button>
                <span>
                  {t("trPageOf", { page: safePage + 1, pages })}
                </span>
                <button
                  type="button"
                  disabled={safePage >= pages - 1}
                  onClick={() => setPage(safePage + 1)}
                  className="border border-concreteMuted/40 px-3 py-1.5 hover:bg-slab disabled:opacity-40"
                >
                  {t("trNext")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
