"use client";

import { useEffect, useRef, useState } from "react";
import { locales, localeNames } from "@/lib/i18n";
import { useLocale } from "@/lib/LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.lang.switcherLabel}
        className="focus-ring flex items-center gap-2 rounded-sm border border-ink/20 bg-paper px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-rebar"
      >
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-rebar" />
        {localeNames[locale]}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-sm border border-ink/15 bg-paper shadow-lg"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`focus-ring block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-blueprint hover:text-paper ${
                  l === locale ? "bg-ink/5 font-semibold" : ""
                }`}
              >
                {localeNames[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
