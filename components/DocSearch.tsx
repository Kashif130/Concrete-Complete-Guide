"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/LocaleProvider";
import { useVT } from "@/lib/vault/dictionary";
import type { PageRef, SearchIndex, SearchResult } from "@/lib/docSearch";

// Site-wide docs search: a header button + Cmd/Ctrl+K palette that searches all 24 guide pages.
// The index is built lazily (lib/docSearch.ts is dynamically imported) so pages that never open the
// palette don't pay for it; hovering/focusing the button warms it up so the first open feels instant.

type DocSearchModule = typeof import("@/lib/docSearch");

type Row = { key: string; href: string; page: PageRef; heading?: string; snippet?: string; terms?: string[] };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, terms: string[] | undefined): ReactNode {
  if (!text || !terms || terms.length === 0) return text;
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-[2px] bg-rebar/20 px-0.5 text-ink">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function DocSearch() {
  const { locale, t } = useLocale();
  const v = useVT();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [pages, setPages] = useState<PageRef[]>([]);
  const [mod, setMod] = useState<DocSearchModule | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;
  const searchMod = useRef<Promise<DocSearchModule> | null>(null);

  const loadMod = useCallback(() => {
    if (!searchMod.current) {
      const p = import("@/lib/docSearch");
      // Don't keep a rejected promise (e.g. chunk load failed offline) — let the next attempt retry.
      p.catch(() => {
        searchMod.current = null;
      });
      searchMod.current = p;
    }
    return searchMod.current;
  }, []);

  useEffect(() => {
    setMounted(true);
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  // (Re)build the index for the active locale once the palette has been touched.
  const wanted = open || index !== null;
  useEffect(() => {
    if (!wanted) return;
    let cancelled = false;
    setFailed(false);
    loadMod()
      .then(async (m) => {
        if (cancelled) return;
        setMod(m);
        setPages(m.listPages());
        const idx = await m.getIndex(locale);
        if (!cancelled) setIndex(idx);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [wanted, locale, loadMod]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  // Global shortcut: Cmd+K (mac) / Ctrl+K (everything else) toggles the palette.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!openRef.current) returnFocus.current = document.activeElement as HTMLElement | null;
        setOpen(!openRef.current);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Other components (the help-center bot) can open the palette, optionally pre-filled:
  //   window.dispatchEvent(new CustomEvent("concrete:open-docsearch", { detail: { query: "fees" } }))
  useEffect(() => {
    function onOpen(e: Event) {
      const q = (e as CustomEvent<{ query?: string }>).detail?.query ?? "";
      if (!openRef.current) returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery(q.slice(0, 120));
      setOpen(true);
    }
    window.addEventListener("concrete:open-docsearch", onOpen);
    return () => window.removeEventListener("concrete:open-docsearch", onOpen);
  }, []);

  // While open: lock page scroll, focus the input, and hand focus back on close.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  const rows: Row[] = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return pages.map((p) => ({ key: p.slug, href: `/docs/${p.slug}`, page: p }));
    }
    if (!index || !mod) return [];
    return mod.searchIndex(index, q).map((r: SearchResult) => ({
      key: r.slug,
      href: r.href,
      page: r,
      heading: r.heading,
      snippet: r.snippet,
      terms: r.terms,
    }));
  }, [query, index, mod, pages]);

  useEffect(() => {
    setActive(0);
  }, [query, index]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (rows.length ? (a + 1) % rows.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (rows.length ? (a - 1 + rows.length) % rows.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[active];
      if (row) go(row.href);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const sectionLabel = (s: string) => (t.path as Record<string, string>)[s] ?? s;
  const searching = query.trim().length > 0;
  const loading = !failed && (searching ? !index : pages.length === 0);
  const shortcut = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          returnFocus.current = document.activeElement as HTMLElement | null;
          setOpen(true);
        }}
        onMouseEnter={() => void loadMod()}
        onFocus={() => void loadMod()}
        aria-label={v("srchLabel")}
        aria-keyshortcuts="Control+K Meta+K"
        className="focus-ring flex items-center gap-2 rounded-sm border border-ink/20 bg-paper px-2.5 py-1.5 text-sm text-inkfaint transition-colors hover:border-rebar hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="hidden md:inline">{v("srchButton")}</span>
        <kbd className="hidden rounded-[3px] border border-line bg-paper2 px-1.5 py-0.5 font-mono text-[10px] text-inkfaint lg:inline">
          {shortcut}
        </kbd>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[10vh] sm:pt-[14vh]">
            <div aria-hidden className="absolute inset-0 bg-ink/50" onMouseDown={close} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={v("srchLabel")}
              className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-sm border border-line bg-paper shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-inkfaint">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder={v("srchPlaceholder")}
                  aria-label={v("srchLabel")}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="docsearch-results"
                  aria-activedescendant={rows[active] ? `docsearch-opt-${active}` : undefined}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full bg-transparent text-base text-ink placeholder:text-inkfaint focus:outline-none"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label={v("srchClose")}
                  className="focus-ring shrink-0 rounded-[3px] border border-line bg-paper2 px-1.5 py-0.5 font-mono text-[10px] text-inkfaint hover:text-ink"
                >
                  Esc
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {failed ? (
                  <p className="px-4 py-8 text-center text-sm text-rebar">{v("srchError")}</p>
                ) : loading ? (
                  <p className="px-4 py-8 text-center text-sm text-inkfaint" role="status">
                    {v("srchLoading")}
                  </p>
                ) : rows.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-inkfaint" role="status">
                    {v("srchNoResults", { q: query.trim() })}
                  </p>
                ) : (
                  <>
                    <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-inkfaint">
                      {searching ? v("srchResults") : v("srchAllPages")}
                    </p>
                    <ul ref={listRef} id="docsearch-results" role="listbox" aria-label={v("srchLabel")} className="pb-2">
                      {rows.map((r, i) => {
                        const isActive = i === active;
                        return (
                          <li
                            key={r.key}
                            id={`docsearch-opt-${i}`}
                            data-idx={i}
                            role="option"
                            aria-selected={isActive}
                            onMouseMove={() => setActive(i)}
                            onClick={() => go(r.href)}
                            className={`cursor-pointer px-4 py-2.5 ${isActive ? "bg-blueprint text-paper" : "text-ink"}`}
                          >
                            <div className="flex items-baseline gap-2">
                              <span className={`font-mono text-xs ${isActive ? "text-rebarlight" : "text-rebar"}`}>
                                {String(r.page.order).padStart(2, "0")}
                              </span>
                              <span className="font-display text-sm font-medium">{highlightIf(isActive, r.page.title, r.terms)}</span>
                              <span
                                className={`ml-auto shrink-0 text-[10px] uppercase tracking-wide ${
                                  isActive ? "text-paper/70" : "text-inkfaint"
                                }`}
                              >
                                {sectionLabel(r.page.section)}
                              </span>
                            </div>
                            {r.heading && (
                              <p className={`mt-0.5 text-xs font-medium ${isActive ? "text-paper/90" : "text-blueprint"}`}>
                                # {highlightIf(isActive, r.heading, r.terms)}
                              </p>
                            )}
                            {r.snippet && (
                              <p className={`mt-0.5 line-clamp-2 text-xs leading-relaxed ${isActive ? "text-paper/80" : "text-inkfaint"}`}>
                                {highlightIf(isActive, r.snippet, r.terms)}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>

              <div className="hidden items-center gap-4 border-t border-line bg-paper2/60 px-4 py-2 text-[11px] text-inkfaint sm:flex">
                <span>
                  <kbd className="font-mono">↑↓</kbd> {v("srchNavHint")}
                </span>
                <span>
                  <kbd className="font-mono">↵</kbd> {v("srchOpenHint")}
                </span>
                <span>
                  <kbd className="font-mono">Esc</kbd> {v("srchCloseHint")}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

// On the dark active row the <mark> tint would clash, so highlight only on inactive rows.
function highlightIf(isActive: boolean, text: string, terms: string[] | undefined): ReactNode {
  return isActive ? text : highlight(text, terms);
}
