// Composite "Risk Score" for a vault — an A/B/C/D letter grade rolled up
// from the same fields the Health Radar and Compare tabs already show
// (health factor, utilisation stability, yield consistency, liquidity
// depth, strategy diversity, protocol maturity, APY volatility). Nothing
// here is a new data source: it's a weighted, documented read of numbers
// already in lib/vault/data.ts, so the grade always agrees with what the
// rest of the terminal displays instead of being a second opinion.
//
// This is NOT a claim of audited safety — it's the same kind of quick
// heuristic score DeFiLlama/CertiK-style dashboards show, meant to help
// someone triage which vault to look at closer, not replace that look.

import type { VaultBase, VaultLive } from "./data";

export type RiskGrade = "A" | "B" | "C" | "D";

export const RISK_GRADE_COLORS: Record<RiskGrade, string> = {
  A: "#2E7D5B", // matches RISK_COLORS.LOW
  B: "#3A5A73", // steel — solid but not top-tier
  C: "#B7791F", // matches RISK_COLORS.MEDIUM
  D: "#B3261E", // matches RISK_COLORS.HIGH
};

export interface RiskFactor {
  key: string;
  label: string;
  /** 0–100, higher is always safer, so factors can be averaged directly. */
  score: number;
  weight: number;
}

export interface RiskScoreResult {
  /** 0–100 composite score. */
  score: number;
  grade: RiskGrade;
  color: string;
  factors: RiskFactor[];
}

function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Weighted composite. Weights sum to 1 and were chosen to mirror how the
 * Health Radar already treats these inputs: health factor (solvency
 * buffer) and yield consistency carry the most weight, protocol maturity
 * and strategy diversity carry a bit less, and APY volatility acts as a
 * penalty on top of — not a replacement for — yield consistency.
 */
export function computeRiskScore(vault: VaultBase | Partial<VaultLive>): RiskScoreResult {
  const hf = vault.healthFactor ?? 1;
  // Health factor: 1.0 (near-liquidation) → 0, 5.0+ (very safe) → 100.
  const hfScore = clamp100(((Math.min(hf, 5) - 1) / 4) * 100);

  const apyVolatility = "apyVolatility" in vault ? vault.apyVolatility ?? 0 : 0;
  // Vaults in this app run ~0.3–1.2 volatility; 0 → 100, 2.0+ → 0.
  const volScore = clamp100(100 - apyVolatility * 50);

  const factors: RiskFactor[] = [
    { key: "healthFactor", label: "Health factor buffer", score: hfScore, weight: 0.25 },
    { key: "yieldConsistency", label: "Yield consistency", score: clamp100(vault.yieldConsistency ?? 0), weight: 0.2 },
    { key: "liquidityDepth", label: "Liquidity depth", score: clamp100(vault.liquidityDepth ?? 0), weight: 0.15 },
    { key: "protocolMaturity", label: "Protocol maturity", score: clamp100(vault.protocolMaturity ?? 0), weight: 0.15 },
    { key: "strategyDiversity", label: "Strategy diversity", score: clamp100(vault.strategyDiversity ?? 0), weight: 0.1 },
    { key: "utilStability", label: "Utilisation stability", score: clamp100((vault.utilStability ?? 0) * 100), weight: 0.1 },
    { key: "apyVolatility", label: "APY stability (inverse of volatility)", score: volScore, weight: 0.05 },
  ];

  const score = clamp100(factors.reduce((sum, f) => sum + f.score * f.weight, 0));
  const grade: RiskGrade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D";

  return { score, grade, color: RISK_GRADE_COLORS[grade], factors };
}
