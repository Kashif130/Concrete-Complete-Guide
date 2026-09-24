// Shared parsing for Fuul's points leaderboard response shape, used by
// both the points panel and the airdrop estimator so both always agree
// on the same real number for "your points" — one place to update if
// Fuul ever changes its response shape.

export type ParsedPoints = {
  totalAmount: number | null;
  rank: number | null;
  totalAttributions: number | null;
  calculatedAt: string | null;
};

export type PointsBreakdownItem = {
  label: string;
  amount: number;
};

const LABEL_KEYS = [
  "campaign_name",
  "campaign",
  "action_name",
  "action",
  "action_type",
  "event_name",
  "event_type",
  "source_name",
  "source",
  "name",
  "title",
  "label",
];
const AMOUNT_KEYS = [
  "total_amount",
  "points",
  "amount",
  "value",
  "total_points",
  "count",
];
// Candidate array keys the leaderboard/points response might nest a
// per-campaign or per-action split under. None of these are confirmed to
// exist in Fuul's response for points.concrete.xyz today (the captured
// shape only has total_amount/rank/total_attributions at the top level) —
// this is deliberately forward-compatible rather than a guess we act on
// blindly: parseBreakdownArray only returns something if the shape genuinely
// matches, so if Fuul never sends this, the UI honestly shows "not available"
// instead of fabricating numbers.
const BREAKDOWN_ARRAY_KEYS = [
  "campaigns",
  "campaign_breakdown",
  "breakdown",
  "actions",
  "action_breakdown",
  "attributions",
  "sources",
  "events",
];

function firstString(row: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return null;
}

function firstNumber(row: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

function parseBreakdownArray(arr: unknown[]): PointsBreakdownItem[] | null {
  const items: PointsBreakdownItem[] = [];
  for (const entry of arr) {
    if (!entry || typeof entry !== "object") return null;
    const row = entry as Record<string, unknown>;
    const label = firstString(row, LABEL_KEYS);
    const amount = firstNumber(row, AMOUNT_KEYS);
    if (label === null || amount === null) return null; // shape didn't match — bail, don't guess
    items.push({ label, amount });
  }
  if (items.length === 0) return null;
  // Merge duplicate labels (e.g. several attributions under one campaign).
  const merged = new Map<string, number>();
  for (const it of items) merged.set(it.label, (merged.get(it.label) ?? 0) + it.amount);
  return Array.from(merged.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Looks for a genuine per-campaign / per-action split in the raw Fuul
 * response. Returns null (not an empty array) when no such breakdown is
 * present, so callers can distinguish "no data" from "not available".
 */
export function parsePointsBreakdown(totals: unknown): PointsBreakdownItem[] | null {
  if (!totals || typeof totals !== "object") return null;
  const obj = totals as Record<string, unknown>;
  const results = Array.isArray(obj.results) ? obj.results : null;
  const first = results && results.length > 0 ? (results[0] as Record<string, unknown>) : null;

  for (const source of [first, obj]) {
    if (!source) continue;
    for (const key of BREAKDOWN_ARRAY_KEYS) {
      const val = source[key];
      if (Array.isArray(val) && val.length > 0) {
        const parsed = parseBreakdownArray(val);
        if (parsed) return parsed;
      }
    }
  }
  return null;
}

export function parsePoints(totals: unknown): ParsedPoints | null {
  if (!totals || typeof totals !== "object") return null;
  const obj = totals as Record<string, unknown>;
  const results = Array.isArray(obj.results) ? obj.results : null;
  const first =
    results && results.length > 0
      ? (results[0] as Record<string, unknown>)
      : null;
  if (!first) return null;

  return {
    totalAmount:
      typeof first.total_amount === "number" ? first.total_amount : null,
    rank: typeof first.rank === "number" ? first.rank : null,
    totalAttributions:
      typeof first.total_attributions === "number"
        ? first.total_attributions
        : null,
    calculatedAt:
      typeof obj.calculated_at === "string" ? obj.calculated_at : null,
  };
}
