// Pure maths for the Rebalancer, Gas & Fees and Yield Calendar tabs.
// Ported from the Streamlit multipage app (pages 5–7). No React, no browser APIs.

import type { Risk, VaultId, VaultLive } from "./data";

// ─── Rebalancer ──────────────────────────────────────────────────────────────
export const REBALANCE_MODES = ["eff", "risk", "balanced", "apy"] as const;
export type RebalanceMode = (typeof REBALANCE_MODES)[number];

const RISK_SCORE: Record<Risk, number> = { LOW: 100, MEDIUM: 50, HIGH: 10 };

/** Score a vault under the chosen strategy; allocations are proportional to score. */
export function scoreVault(v: VaultLive, mode: RebalanceMode): number {
  switch (mode) {
    case "eff":
      return v.efficiencyIdx;
    case "risk":
      return RISK_SCORE[v.risk] * v.healthFactor;
    case "balanced":
      return v.apy * v.utilStability * v.healthFactor;
    case "apy":
      return v.apy * 10;
  }
}

export type Allocation = Record<VaultId, number>;

export function emptyAllocation(vaults: VaultLive[]): Allocation {
  return Object.fromEntries(vaults.map((v) => [v.id, 0])) as Allocation;
}

/** Split `total` across vaults in proportion to their score (rounded to cents). Equal split if every score is 0. */
export function optimalAllocation(vaults: VaultLive[], total: number, mode: RebalanceMode): Allocation {
  const scores = vaults.map((v) => Math.max(scoreVault(v, mode), 0));
  const sum = scores.reduce((a, b) => a + b, 0);
  const out = emptyAllocation(vaults);
  vaults.forEach((v, i) => {
    const weight = sum > 0 ? scores[i] / sum : 1 / vaults.length;
    out[v.id] = Math.round(weight * total * 100) / 100;
  });
  return out;
}

/** Portfolio APY weighted by how much sits in each vault. 0 for an empty portfolio. */
export function weightedApy(vaults: VaultLive[], amounts: Allocation): number {
  const total = vaults.reduce((a, v) => a + (amounts[v.id] || 0), 0);
  if (total <= 0) return 0;
  return vaults.reduce((a, v) => a + ((amounts[v.id] || 0) / total) * v.apy, 0);
}

// ─── Gas & fees ──────────────────────────────────────────────────────────────
export const GAS_OPS = [
  { key: "Deposit", gas: 180_000 },
  { key: "Withdraw", gas: 150_000 },
  { key: "Claim", gas: 90_000 },
  { key: "Approve", gas: 46_000 },
  { key: "Swap", gas: 130_000 },
  { key: "Aave", gas: 200_000 },
  { key: "Morpho", gas: 160_000 },
  { key: "Rebalance", gas: 620_000 },
] as const;

export const GAS_TIERS = [
  { key: "Slow", mult: 0.7 },
  { key: "Normal", mult: 1.0 },
  { key: "Fast", mult: 1.3 },
  { key: "Instant", mult: 1.6 },
] as const;
export type GasTierKey = (typeof GAS_TIERS)[number]["key"];

export const GAS_DEPOSIT_SIZES = [500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000];
export const GAS_FALLBACK_GWEI = 12.5;
/** Gas is "sane" when it stays below this share of the deposit. */
export const GAS_THRESHOLD_PCT = 0.5;

export function gasCostEth(gasUnits: number, gwei: number): number {
  return gasUnits * gwei * 1e-9;
}

export function gasCostUsd(gasUnits: number, gwei: number, ethUsd: number): number {
  return gasCostEth(gasUnits, gwei) * ethUsd;
}

// ─── Yield calendar ──────────────────────────────────────────────────────────
export const CAL_DAYS_PER_MONTH = 30;

export interface Calendar {
  dates: Date[];
  values: number[]; // portfolio value at end of each day
  daily: number[]; // earnings on each day
  cumulative: number[]; // earnings so far
}

export function buildCalendar(deposit: number, apy: number, months: number, compound: boolean, startMs: number): Calendar {
  const totalDays = months * CAL_DAYS_PER_MONTH;
  const rate = apy / 100 / 365;
  const dates: Date[] = [];
  const values: number[] = [];
  const daily: number[] = [];
  const cumulative: number[] = [];
  let running = deposit;
  for (let d = 0; d < totalDays; d++) {
    const earn = compound ? running * rate : deposit * rate;
    running += earn;
    dates.push(new Date(startMs + d * 86_400_000));
    values.push(running);
    daily.push(earn);
    cumulative.push(running - deposit);
  }
  return { dates, values, daily, cumulative };
}

export interface MonthRow {
  month: number;
  endDate: Date;
  earned: number;
  cumulative: number;
  value: number;
}

export function monthlyBreakdown(cal: Calendar, months: number, startMs: number): MonthRow[] {
  const rows: MonthRow[] = [];
  const last = cal.values.length - 1;
  for (let mo = 1; mo <= months; mo++) {
    const from = (mo - 1) * CAL_DAYS_PER_MONTH;
    const to = mo * CAL_DAYS_PER_MONTH;
    const idx = Math.min(to - 1, last);
    rows.push({
      month: mo,
      endDate: new Date(startMs + to * 86_400_000),
      earned: cal.daily.slice(from, to).reduce((a, b) => a + b, 0),
      cumulative: cal.cumulative[idx] ?? 0,
      value: cal.values[idx] ?? 0,
    });
  }
  return rows;
}
