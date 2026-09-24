"use client";

import { useEffect, useState, type ReactNode } from "react";

export function Panel({ children, accent, className = "" }: { children: ReactNode; accent?: string; className?: string }) {
  return (
    <div
      className={`rounded-sm border border-line bg-paper2/60 p-5 ${className}`}
      style={accent ? { borderTopColor: accent, borderTopWidth: 2 } : undefined}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] font-semibold uppercase tracking-wide text-inkfaint ${className}`}>{children}</p>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-display text-base font-semibold text-ink">{children}</h3>;
}

export function Metric({
  label,
  value,
  sub,
  subColor,
  valueColor,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  subColor?: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-sm border border-line bg-paper p-4">
      <Eyebrow>{label}</Eyebrow>
      <p className="mt-1.5 font-display text-2xl font-medium text-ink" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-inkfaint" style={subColor ? { color: subColor } : undefined}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`focus-ring rounded-sm border px-2.5 ${size === "sm" ? "py-1 text-xs" : "py-1.5 text-xs"} font-medium transition-colors ${
              active ? "border-blueprint bg-blueprint text-paper" : "border-line bg-paper text-ink/80 hover:border-blueprint/50 hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus-ring flex w-full items-center justify-between gap-3 rounded-sm text-left text-sm text-ink"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={`relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-rebar" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-inkfaint">
        {label}
      </label>
      {children}
    </div>
  );
}

export function NumberField({
  id,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  id: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min={min}
      step={step}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value !== "" && Number.isFinite(n) && n >= min) onChange(n);
      }}
      onBlur={() => setText(String(value))}
      className="focus-ring w-full rounded-sm border border-line bg-paper px-3 py-2 font-mono text-sm text-ink"
    />
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-line">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr className="bg-blueprint text-left text-paper">
            {headers.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-paper2/50" : "bg-paper"}>
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 ${j === 0 ? "font-medium text-ink" : "font-mono text-xs text-ink/80"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
