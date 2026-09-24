"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Dependency-free SVG charts styled for the Guide's paper/blueprint theme.

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(Math.floor(el.getBoundingClientRect().width));
    const ro = new ResizeObserver((entries) => setW(Math.floor(entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export type LineSeries = {
  name: string;
  color: string;
  values: number[];
  fill?: boolean;
  dashed?: boolean;
  markers?: boolean;
  noTip?: boolean;
};

export function LineChart({
  series,
  labels,
  height = 220,
  yFormat = (n) => n.toFixed(2),
  tipFormat,
  ariaLabel,
  zeroBased = false,
}: {
  series: LineSeries[];
  labels: string[];
  height?: number;
  yFormat?: (n: number) => string;
  tipFormat?: (n: number) => string;
  ariaLabel: string;
  zeroBased?: boolean;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const fmtTip = tipFormat ?? yFormat;

  const m = { t: 12, r: 14, b: 24, l: 56 };
  const n = labels.length;
  const iw = Math.max(width - m.l - m.r, 10);
  const ih = height - m.t - m.b;

  const all = series.flatMap((s) => s.values);
  let lo = all.length ? Math.min(...all) : 0;
  let hi = all.length ? Math.max(...all) : 1;
  if (zeroBased) lo = Math.min(0, lo);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.08;
  if (!zeroBased) lo -= pad;
  hi += pad;

  const x = (i: number) => m.l + (n <= 1 ? 0 : (i * iw) / (n - 1));
  const y = (v: number) => m.t + ih * (1 - (v - lo) / (hi - lo));
  const baseY = m.t + ih;

  const ticks = [0, 1, 2, 3].map((k) => lo + ((hi - lo) * k) / 3);
  const maxLabels = Math.max(2, Math.floor(iw / 72));
  const step = Math.max(1, Math.ceil(n / maxLabels));
  const labelIdx = labels.map((_, i) => i).filter((i) => i % step === 0 || i === n - 1);
  // avoid the last label colliding with its neighbour
  const shownLabels = labelIdx.filter((i, k) => !(k === labelIdx.length - 2 && n - 1 - i < step * 0.6 && labelIdx.length > 2));

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (n < 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const idx = n <= 1 ? 0 : Math.round(((px - m.l) / iw) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, idx)));
  }

  const tipSeries = series.filter((s) => !s.noTip);
  const tipLeft = hover === null ? 0 : Math.min(Math.max(x(hover) + 12, 0), Math.max(width - 160, 0));

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && n > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          className="touch-pan-y select-none"
        >
          {ticks.map((tv, k) => (
            <g key={k}>
              <line x1={m.l} x2={m.l + iw} y1={y(tv)} y2={y(tv)} stroke="#C9C2B2" strokeWidth={1} strokeDasharray={k === 0 ? undefined : "2 4"} />
              <text x={m.l - 8} y={y(tv) + 3} textAnchor="end" fontSize={10} fill="#5B5B54" fontFamily="ui-monospace, monospace">
                {yFormat(tv)}
              </text>
            </g>
          ))}
          {shownLabels.map((i) => (
            <text
              key={i}
              x={x(i)}
              y={height - 6}
              textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
              fontSize={10}
              fill="#5B5B54"
              fontFamily="ui-monospace, monospace"
            >
              {labels[i]}
            </text>
          ))}

          {series.map((s) => {
            const pts = s.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
            const d = "M" + pts.join(" L");
            return (
              <g key={s.name}>
                {s.fill && (
                  <path d={`${d} L${x(n - 1).toFixed(1)},${baseY} L${x(0).toFixed(1)},${baseY} Z`} fill={s.color} opacity={0.1} />
                )}
                <path d={d} fill="none" stroke={s.color} strokeWidth={s.dashed ? 1.25 : 2} strokeDasharray={s.dashed ? "5 4" : undefined} strokeLinejoin="round" />
                {s.markers && s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={3} fill="#F2EEE6" stroke={s.color} strokeWidth={1.75} />)}
              </g>
            );
          })}

          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={baseY} stroke="#1F3A5F" strokeWidth={1} opacity={0.35} />
              {tipSeries.map((s) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={4} fill={s.color} stroke="#F2EEE6" strokeWidth={1.5} />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-sm border border-line bg-paper px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: tipLeft }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wide text-inkfaint">{labels[hover]}</p>
          {tipSeries.map((s) => (
            <p key={s.name} className="mt-0.5 whitespace-nowrap text-ink">
              <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: s.color }} />
              {tipSeries.length > 1 ? `${s.name}: ` : ""}
              <span className="font-mono">{fmtTip(s.values[hover])}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export type DonutSlice = { label: string; value: number; color: string; opacity?: number };

export function Donut({
  slices,
  size = 170,
  thickness = 22,
  center,
  ariaLabel,
  format = (v, t) => `${((v / t) * 100).toFixed(0)}%`,
}: {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  center?: ReactNode;
  ariaLabel: string;
  format?: (value: number, total: number) => string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={ariaLabel}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#C9C2B2" strokeOpacity={0.35} strokeWidth={thickness} />
          {total > 0 &&
            slices.map((s) => {
              const len = (s.value / total) * c;
              const el = (
                <circle
                  key={s.label}
                  cx={cx}
                  cy={cx}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeOpacity={s.opacity ?? 1}
                  strokeWidth={thickness}
                  strokeDasharray={`${Math.max(len - 1.5, 0)} ${c - Math.max(len - 1.5, 0)}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${cx} ${cx})`}
                />
              );
              offset += len;
              return el;
            })}
        </svg>
        {center && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>}
      </div>
      <ul className="min-w-[140px] flex-1 space-y-1.5 text-sm">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink/80">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color, opacity: s.opacity ?? 1 }} />
              {s.label}
            </span>
            <span className="font-mono text-xs text-inkfaint">{format(s.value, total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Gauge (semi-circle, e.g. health factor) ─────────────────────────────────
export type GaugeBand = { from: number; to: number; color: string };

export function Gauge({
  value,
  min,
  max,
  bands,
  color,
  ticks,
  ariaLabel,
  display,
}: {
  value: number;
  min: number;
  max: number;
  bands: GaugeBand[];
  color: string;
  ticks: number[];
  ariaLabel: string;
  display: string;
}) {
  const cx = 100;
  const cy = 98;
  const r = 74;
  const th = 14;
  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  const ang = (v: number) => Math.PI * (1 - (clamp(v) - min) / (max - min));
  const pt = (v: number, rad: number) => [cx + rad * Math.cos(ang(v)), cy - rad * Math.sin(ang(v))] as const;
  const arc = (a: number, b: number, rad: number) => {
    const [x1, y1] = pt(a, rad);
    const [x2, y2] = pt(b, rad);
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${rad},${rad} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
  };
  const [ix, iy] = pt(value, r - th / 2 - 3);
  const [ox, oy] = pt(value, r + th / 2 + 3);

  return (
    <svg viewBox="0 0 200 118" className="w-full" role="img" aria-label={ariaLabel}>
      {bands.map((b, i) => (
        <path key={i} d={arc(b.from, b.to, r)} fill="none" stroke={b.color} strokeOpacity={0.28} strokeWidth={th} />
      ))}
      <path d={arc(min, value, r)} fill="none" stroke={color} strokeWidth={5} strokeLinecap="butt" />
      <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={color} strokeWidth={3} />
      {ticks.map((t) => {
        const [tx, ty] = pt(t, r + th / 2 + 11);
        return (
          <text key={t} x={tx} y={ty + 3.5} textAnchor="middle" fontSize={9.5} fill="#5B5B54" fontFamily="ui-monospace, monospace">
            {t}
          </text>
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={26} fontWeight={500} fill={color} fontFamily="var(--font-display), system-ui, sans-serif">
        {display}
      </text>
    </svg>
  );
}

// ─── Radar / spider chart ────────────────────────────────────────────────────
export function RadarChart({
  axes,
  values,
  color,
  ariaLabel,
  max = 100,
}: {
  axes: string[];
  values: number[];
  color: string;
  ariaLabel: string;
  max?: number;
}) {
  const W = 320;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2 + 2;
  const R = 82;
  const n = axes.length;
  const a = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const p = (i: number, frac: number) => [cx + R * frac * Math.cos(a(i)), cy + R * frac * Math.sin(a(i))] as const;
  const poly = (frac: number) => Array.from({ length: n }, (_, i) => p(i, frac).map((x) => x.toFixed(1)).join(",")).join(" ");
  const shape = values.map((v, i) => p(i, Math.min(Math.max(v, 0), max) / max).map((x) => x.toFixed(1)).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={ariaLabel}>
      {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
        <polygon key={f} points={poly(f)} fill="none" stroke="#C9C2B2" strokeWidth={1} />
      ))}
      {axes.map((_, i) => {
        const [x, y] = p(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#C9C2B2" strokeWidth={1} />;
      })}
      <polygon points={shape} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = p(i, Math.min(Math.max(v, 0), max) / max);
        return (
          <circle key={i} cx={x} cy={y} r={3.5} fill={color} stroke="#F2EEE6" strokeWidth={1.5}>
            <title>{`${axes[i]}: ${v}`}</title>
          </circle>
        );
      })}
      {axes.map((label, i) => {
        const [x, y] = p(i, 1.2);
        const c = Math.cos(a(i));
        const anchor = Math.abs(c) < 0.2 ? "middle" : c > 0 ? "start" : "end";
        const sp = label.indexOf(" ");
        const lines = sp > 0 && label.length > 11 ? [label.slice(0, sp), label.slice(sp + 1)] : [label];
        return (
          <text key={i} x={x} y={y - (lines.length - 1) * 5 + 3} textAnchor={anchor} fontSize={9.5} fill="#1C1F22">
            {lines.map((ln, k) => (
              <tspan key={k} x={x} dy={k === 0 ? 0 : 11}>
                {ln}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Vertical bar chart ──────────────────────────────────────────────────────
export type BarItem = { label: string; value: number; color: string };

export function BarChart({
  items,
  height = 240,
  valueFormat = (n) => n.toFixed(2),
  ariaLabel,
}: {
  items: BarItem[];
  height?: number;
  valueFormat?: (n: number) => string;
  ariaLabel: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const m = { t: 24, r: 12, b: 26, l: 44 };
  const iw = Math.max(width - m.l - m.r, 10);
  const ih = height - m.t - m.b;
  const rawMax = Math.max(...items.map((i) => i.value), 1) * 1.08;
  const mag = Math.pow(10, Math.floor(Math.log10(rawMax / 3)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((st) => st * 3 >= rawMax) ?? mag * 10;
  const top = step * 3;
  const y = (v: number) => m.t + ih * (1 - v / top);
  const band = iw / Math.max(items.length, 1);
  const bw = Math.min(band * 0.55, 72);
  const ticks = [0, 1, 2, 3].map((k) => step * k);

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel}>
          {ticks.map((tv, k) => (
            <g key={k}>
              <line x1={m.l} x2={m.l + iw} y1={y(tv)} y2={y(tv)} stroke="#C9C2B2" strokeWidth={1} strokeDasharray={k === 0 ? undefined : "2 4"} />
              <text x={m.l - 8} y={y(tv) + 3} textAnchor="end" fontSize={10} fill="#5B5B54" fontFamily="ui-monospace, monospace">
                {Number.isInteger(tv) ? tv : tv.toFixed(1)}
              </text>
            </g>
          ))}
          {items.map((it, i) => {
            const bx = m.l + band * i + (band - bw) / 2;
            return (
              <g key={it.label}>
                <rect x={bx} y={y(it.value)} width={bw} height={Math.max(m.t + ih - y(it.value), 0)} fill={it.color} rx={1.5}>
                  <title>{`${it.label}: ${valueFormat(it.value)}`}</title>
                </rect>
                <text x={bx + bw / 2} y={y(it.value) - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill={it.color} fontFamily="ui-monospace, monospace">
                  {valueFormat(it.value)}
                </text>
                <text x={bx + bw / 2} y={height - 8} textAnchor="middle" fontSize={10.5} fill="#1C1F22">
                  {it.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// ─── Column chart (many thin bars, e.g. 30 days of yield) ────────────────────
export function ColumnChart({
  values,
  labels,
  color,
  height = 180,
  yFormat = (n) => n.toFixed(2),
  tipFormat,
  ariaLabel,
}: {
  values: number[];
  labels: string[];
  color: string;
  height?: number;
  yFormat?: (n: number) => string;
  tipFormat?: (n: number) => string;
  ariaLabel: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const fmtTip = tipFormat ?? yFormat;
  const m = { t: 10, r: 12, b: 24, l: 56 };
  const n = values.length;
  const iw = Math.max(width - m.l - m.r, 10);
  const ih = height - m.t - m.b;
  const top = Math.max(...values, 0) * 1.08 || 1;
  const y = (v: number) => m.t + ih * (1 - v / top);
  const band = iw / Math.max(n, 1);
  const bw = Math.max(band * 0.7, 1);
  const ticks = [0, 1, 2, 3].map((k) => (top * k) / 3);
  const maxLabels = Math.max(2, Math.floor(iw / 64));
  const step = Math.max(1, Math.ceil(n / maxLabels));

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {width > 0 && n > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel}>
          {ticks.map((tv, k) => (
            <g key={k}>
              <line x1={m.l} x2={m.l + iw} y1={y(tv)} y2={y(tv)} stroke="#C9C2B2" strokeWidth={1} strokeDasharray={k === 0 ? undefined : "2 4"} />
              <text x={m.l - 8} y={y(tv) + 3} textAnchor="end" fontSize={10} fill="#5B5B54" fontFamily="ui-monospace, monospace">
                {yFormat(tv)}
              </text>
            </g>
          ))}
          {values.map((val, i) => {
            const bx = m.l + band * i + (band - bw) / 2;
            return (
              <rect key={i} x={bx} y={y(val)} width={bw} height={Math.max(m.t + ih - y(val), 0)} fill={color} rx={1}>
                <title>{`${labels[i]}: ${fmtTip(val)}`}</title>
              </rect>
            );
          })}
          {labels.map((label, i) =>
            i % step === 0 ? (
              <text
                key={i}
                x={m.l + band * i + band / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={10}
                fill="#5B5B54"
                fontFamily="ui-monospace, monospace"
              >
                {label}
              </text>
            ) : null,
          )}
        </svg>
      )}
    </div>
  );
}
