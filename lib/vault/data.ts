// Pure data + maths for the Vault Terminal. No React, no browser APIs — safe to import
// from both client components and the /api/market route.

export type Risk = "LOW" | "MEDIUM" | "HIGH";
export type Asset = "WETH" | "WBTC" | "USDC" | "FRAX" | "USD1" | "WSTETH";
export type VaultId = "weeth" | "ctwbtc" | "ctusd" | "frxusd" | "frontier" | "rwausd1" | "srroyusdc" | "royeth";
export type MarketSource = "live" | "partial" | "rpc" | "simulated";

export interface VaultBase {
  id: VaultId;
  name: string;
  /** Short unique label for chart legends and compact lists (several vaults can share one underlying asset, so `asset` alone is not unique). */
  short: string;
  /**
   * true = TVL / APY are real reference figures taken from app.concrete.xyz/earn (see lib/knownVaults.ts) and
   * TVL is refreshed on-chain by /api/market, so they must never be jittered or simulated. The risk metrics
   * below (health factor, stability, etc.) are still modelled estimates for every vault, same as before.
   */
  reference?: boolean;
  chain?: "ethereum";
  curator?: string;
  permissionRequired?: boolean;
  /** Where to deposit, when not app.concrete.xyz/earn (e.g. Royco-curated vaults). */
  depositUrl?: string;
  /** What kind of APY figure `apy` is for reference vaults (e.g. "Target APY", "30-day APY"). */
  apyLabel?: string;
  asset: Asset;
  color: string;
  risk: Risk;
  tvl: number;
  apy: number;
  strategy: string;
  dailyYield: number;
  priceUsd: number;
  address: string;
  healthFactor: number;
  utilStability: number;
  yieldConsistency: number;
  liquidityDepth: number;
  strategyDiversity: number;
  protocolMaturity: number;
  /**
   * Optional per-vault fee settings, in percent (management per year, performance of net yield).
   * Deliberately unset for every vault today: Concrete configures fees per vault and this app has no
   * verified source for the exact numbers. When set, the Compare tab shows them instead of the
   * protocol-wide ranges.
   */
  fees?: { management: number; performance: number };
}

export interface VaultLive extends VaultBase {
  apyVolatility: number;
  efficiencyIdx: number;
}

export interface Market {
  vaults: Record<VaultId, { apy: number; tvl: number; dailyYield: number }>;
  prices: Record<Asset, number>;
  source: MarketSource;
  ts: number;
}

// Colours are re-tuned from the terminal's neon palette so they read on the Guide's paper background.
export const RISK_COLORS: Record<Risk, string> = {
  LOW: "#2E7D5B",
  MEDIUM: "#B7791F",
  HIGH: "#B3261E",
};

export const VAULT_BASE: VaultBase[] = [
  {
    id: "weeth",
    short: "weETH",
    name: "WeETH (Institutional)",
    asset: "WETH",
    color: "#0F7B6C",
    risk: "LOW",
    tvl: 281_000_000,
    apy: 7.84,
    strategy: "Institutional Restaking (Aave V3 + Silo)",
    dailyYield: 88_493,
    priceUsd: 2311,
    address: "0xB9DC54c8261745CB97070CeFBE3D3d815aee8f20",
    healthFactor: 3.82,
    utilStability: 0.94,
    yieldConsistency: 88,
    liquidityDepth: 76,
    strategyDiversity: 65,
    protocolMaturity: 90,
  },
  {
    id: "ctwbtc",
    short: "ctWBTC",
    name: "ctWBTC",
    asset: "WBTC",
    color: "#C97A0B",
    risk: "MEDIUM",
    tvl: 198_000_000,
    apy: 5.21,
    strategy: "Lending + Delta-Neutral (Morpho + Radiant)",
    dailyYield: 28_274,
    priceUsd: 76_900,
    address: "0xacce65B9dB4810125adDEa9797BaAaaaD2B73788",
    healthFactor: 2.14,
    utilStability: 0.78,
    yieldConsistency: 72,
    liquidityDepth: 82,
    strategyDiversity: 78,
    protocolMaturity: 80,
  },
  {
    id: "ctusd",
    short: "ctUSD",
    name: "ctUSD (Stable)",
    asset: "USDC",
    color: "#2775CA",
    risk: "LOW",
    tvl: 825_000_000,
    apy: 9.12,
    strategy: "Stablecoin Optimizer (Morpho + Silo + Aave V3)",
    dailyYield: 205_890,
    priceUsd: 1,
    address: "0x0E609b710da5e0AA476224b6c0e5445cCc21251E",
    healthFactor: 4.51,
    utilStability: 0.97,
    yieldConsistency: 95,
    liquidityDepth: 92,
    strategyDiversity: 88,
    protocolMaturity: 95,
  },
  {
    id: "frxusd",
    short: "frxUSD+",
    name: "frxUSD+",
    asset: "FRAX",
    color: "#7B3FE4",
    risk: "HIGH",
    tvl: 67_000_000,
    apy: 18.44,
    strategy: "EigenLayer + Morpho + Silo",
    dailyYield: 33_842,
    priceUsd: 1,
    address: "0xCF9ceAcf5c7d6D2FE6e8650D81FbE4240c72443f",
    healthFactor: 1.38,
    utilStability: 0.61,
    yieldConsistency: 58,
    liquidityDepth: 55,
    strategyDiversity: 92,
    protocolMaturity: 60,
  },
  // ── Vaults from lib/knownVaults.ts (app.concrete.xyz/earn "Live" listing, checked 2026-09-13) ──
  // ctDefiUSDT is the same contract as `ctusd` above, so it is not repeated. TVL/APY are the Earn page's reported
  // figures (a snapshot; TVL is re-read on-chain by /api/market). Risk metrics are ESTIMATES made for this
  // terminal's heuristics, not published by Concrete — tune them here if you have better data.
  {
    id: "frontier",
    short: "Frontier",
    name: "Concrete Frontier (USDC)",
    asset: "USDC",
    color: "#0B8A8F",
    risk: "MEDIUM",
    tvl: 1_190_000,
    apy: 7.38,
    apyLabel: "Live APY (Earn page)",
    strategy: "Permissioned Concrete vault — strategy details on app.concrete.xyz",
    dailyYield: Math.round((1_190_000 * 0.0738) / 365),
    priceUsd: 1,
    address: "0xe72d4cc29285e33a1bd3f2a5e433256378ebfb88",
    healthFactor: 2.4,
    utilStability: 0.8,
    yieldConsistency: 70,
    liquidityDepth: 45,
    strategyDiversity: 60,
    protocolMaturity: 60,
    reference: true,
    chain: "ethereum",
    curator: "Concrete",
    permissionRequired: true,
  },
  {
    id: "rwausd1",
    short: "RWA USD1",
    name: "RWA USD1",
    asset: "USD1",
    color: "#8A6D1F",
    risk: "MEDIUM",
    tvl: 25_000_000,
    apy: 8.0,
    apyLabel: "Target APY (Earn page)",
    strategy: "Permissioned real-world-asset vault — strategy details on app.concrete.xyz",
    dailyYield: Math.round((25_000_000 * 0.08) / 365),
    priceUsd: 1,
    address: "0x86a95dc16d05c62a6c22fa1697ca933ecca380b7",
    healthFactor: 2.8,
    utilStability: 0.9,
    yieldConsistency: 80,
    liquidityDepth: 50,
    strategyDiversity: 40,
    protocolMaturity: 55,
    reference: true,
    chain: "ethereum",
    curator: "Concrete",
    permissionRequired: true,
  },
  {
    id: "srroyusdc",
    short: "srRoyUSDC",
    name: "Senior Royco USDC",
    asset: "USDC",
    color: "#3B6FB6",
    risk: "LOW",
    tvl: 9_070_000,
    apy: 5.67,
    apyLabel: "30-day APY (Earn page)",
    strategy: "Senior tranche, curated by Royco — deposits via dawn.royco.org",
    dailyYield: Math.round((9_070_000 * 0.0567) / 365),
    priceUsd: 1,
    address: "0xcd9f5907f92818bc06c9ad70217f089e190d2a32",
    healthFactor: 3.5,
    utilStability: 0.9,
    yieldConsistency: 82,
    liquidityDepth: 65,
    strategyDiversity: 55,
    protocolMaturity: 70,
    reference: true,
    chain: "ethereum",
    curator: "Royco",
    depositUrl: "https://dawn.royco.org/vault/1/0xcd9f5907f92818bc06c9ad70217f089e190d2a32",
  },
  {
    id: "royeth",
    short: "Royco ETH",
    name: "Royco ETH (roywstETH)",
    asset: "WSTETH",
    color: "#5B5FC7",
    risk: "MEDIUM",
    tvl: 292_000,
    apy: 2.05,
    apyLabel: "30-day APY (Earn page)",
    strategy: "wstETH vault curated by Royco — deposits via dawn.royco.org",
    dailyYield: Math.round((292_000 * 0.0205) / 365),
    priceUsd: 2780,
    address: "0x41ce72e04d349eb957bdc373baa9c69207032c56",
    healthFactor: 2.6,
    utilStability: 0.7,
    yieldConsistency: 60,
    liquidityDepth: 30,
    strategyDiversity: 40,
    protocolMaturity: 55,
    reference: true,
    chain: "ethereum",
    curator: "Royco",
    depositUrl: "https://dawn.royco.org/vault/1/0x41Ce72E04D349Eb957bdc373baA9c69207032c56",
  },
];

// ─── Health-factor zones (Aave V3 style) ─────────────────────────────────────
export type HfZoneName = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export function hfZone(hf: number): { name: HfZoneName; color: string } {
  if (!Number.isFinite(hf) || hf > 3.0) return { name: "SAFE", color: "#2E7D5B" };
  if (hf >= 2.0) return { name: "LOW", color: "#8A7A12" };
  if (hf >= 1.5) return { name: "MEDIUM", color: "#B7791F" };
  if (hf >= 1.1) return { name: "HIGH", color: "#C1571C" };
  return { name: "CRITICAL", color: "#B3261E" };
}

// (Avg APY / (1 + APY volatility)) × utilisation stability × 100
export function efficiencyIndex(avgApy: number, apyVol: number, utilStability: number): number {
  return Math.round((avgApy / (1 + apyVol)) * utilStability * 100 * 10) / 10;
}

// ─── Deterministic pseudo-random history ─────────────────────────────────────
function strHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface History {
  dates: Date[];
  apys: number[];
  tvls: number[];
}

/** Modelled series around `base` — a seeded random walk, NOT on-chain snapshots. Client-side only (uses Date). */
export function genHistory(base: number, days: number, seedKey: string, tvlBase = 100_000_000): History {
  const rand = mulberry32(Math.round(base * 100) + (strHash(seedKey) % 1000));
  const uni = (a: number, b: number) => a + (b - a) * rand();
  const now = Date.now();
  const dates: Date[] = [];
  const apys: number[] = [];
  const tvls: number[] = [];
  for (let i = 0; i < days; i++) {
    dates.push(new Date(now - (days - i) * 86_400_000));
    apys.push(Math.round((base + uni(-1.5, 1.5)) * 100) / 100);
  }
  for (let i = 0; i < days; i++) tvls.push(Math.round(tvlBase * (1 + uni(-0.05, 0.05))));
  return { dates, apys, tvls };
}

/** Sample standard deviation (ddof = 1), matching pandas .std() */
export function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(v);
}

// ─── Market snapshot → enriched vaults ───────────────────────────────────────
export function fallbackMarket(source: MarketSource = "simulated"): Market {
  const seed = Math.floor(Date.now() / 1000) % 500;
  const vaults = {} as Market["vaults"];
  for (const v of VAULT_BASE) {
    const jitter = source === "simulated" && !v.reference ? ((seed + (strHash(v.id) % 100)) % 100) / 500 - 0.1 : 0;
    vaults[v.id] = {
      apy: Math.round((v.apy + jitter) * 100) / 100,
      tvl: v.tvl,
      dailyYield: v.dailyYield,
    };
  }
  return {
    vaults,
    prices: { WETH: 2311, WBTC: 76_900, USDC: 1, FRAX: 1, USD1: 1, WSTETH: 2780 },
    source,
    ts: Date.now(),
  };
}

export function buildVaults(m: Market): VaultLive[] {
  return VAULT_BASE.map((b) => {
    const live = m.vaults[b.id];
    const apy = live?.apy ?? b.apy;
    const hist = genHistory(apy, 30, b.id, b.tvl);
    const apyVolatility = Math.round(stdev(hist.apys) * 1000) / 1000;
    return {
      ...b,
      apy,
      tvl: live?.tvl ?? b.tvl,
      dailyYield: live?.dailyYield ?? b.dailyYield,
      priceUsd: m.prices[b.asset] ?? b.priceUsd,
      apyVolatility,
      efficiencyIdx: efficiencyIndex(apy, apyVolatility, b.utilStability),
    };
  });
}

export { strHash };

// ─── Simulator maths ─────────────────────────────────────────────────────────
export const PERIODS = [
  { key: "1m", days: 30 },
  { key: "3m", days: 90 },
  { key: "6m", days: 180 },
  { key: "1y", days: 365 },
  { key: "2y", days: 730 },
  { key: "5y", days: 1825 },
] as const;
export type PeriodKey = (typeof PERIODS)[number]["key"];

export const VOLATILITY = [
  { key: "low", mult: 1.1 },
  { key: "medium", mult: 1.5 },
  { key: "high", mult: 2.5 },
  { key: "extreme", mult: 4.0 },
] as const;
export type VolKey = (typeof VOLATILITY)[number]["key"];

export const WINDOWS = [
  { key: "1D", days: 1 },
  { key: "7D", days: 7 },
  { key: "30D", days: 30 },
  { key: "90D", days: 90 },
] as const;
export type WindowKey = (typeof WINDOWS)[number]["key"];

export function earningsFor(principal: number, apy: number, days: number, compound: boolean): number {
  return compound
    ? principal * (Math.pow(1 + apy / 100, days / 365) - 1)
    : ((principal * apy) / 100) * (days / 365);
}

export function projectValue(principal: number, apy: number, months: number, compound: boolean): number {
  return compound
    ? principal * Math.pow(1 + apy / 100, months / 12)
    : principal + ((principal * apy) / 100) * (months / 12);
}

// ─── Formatting ──────────────────────────────────────────────────────────────
export function fmtUsdShort(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function usd(n: number, digits = 2): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}
