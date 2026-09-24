import { NextResponse } from "next/server";
import {
  VAULT_BASE,
  fallbackMarket,
  strHash,
  type Asset,
  type Market,
  type VaultId,
} from "@/lib/vault/data";
import { getPublicClient } from "@/lib/chains";
import { erc4626Abi, erc20MetadataAbi } from "@/lib/erc4626Abi";
import { formatUnits } from "@/lib/units";
import { getAddress } from "viem";

// Always run on request; the CDN cache header below gives the 60 s freshness window.
export const dynamic = "force-dynamic";

async function getJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const num = (x: unknown, fb: number) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : fb;
};

async function fetchPrices(): Promise<Market["prices"]> {
  const def = fallbackMarket().prices;
  try {
    const p = await getJson(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin,frax,wrapped-steth&vs_currencies=usd",
    );
    return {
      WETH: num(p?.ethereum?.usd, def.WETH),
      WBTC: num(p?.bitcoin?.usd, def.WBTC),
      USDC: 1,
      FRAX: num(p?.frax?.usd, def.FRAX),
      USD1: 1,
      WSTETH: num(p?.["wrapped-steth"]?.usd, def.WSTETH),
    };
  } catch {
    return def;
  }
}

// Underlying token symbols we accept when reading a reference vault on-chain. If a vault's underlying
// isn't one of these, the on-chain number is ignored rather than mis-priced.
const EXPECTED_UNDERLYING: Partial<Record<Asset, string[]>> = {
  USDC: ["USDC"],
  USD1: ["USD1"],
  WSTETH: ["WSTETH"],
};

/** Reads a reference vault's TVL (USD) straight from its ERC-4626 contract. Returns null on any doubt. */
async function readOnchainTvl(v: (typeof VAULT_BASE)[number], prices: Market["prices"]): Promise<number | null> {
  if (!v.chain) return null;
  const expected = EXPECTED_UNDERLYING[v.asset];
  if (!expected) return null;
  try {
    const client = getPublicClient(v.chain);
    const vault = getAddress(v.address);
    const read = async () => {
      const assetAddress = await client.readContract({ address: vault, abi: erc4626Abi, functionName: "asset" });
      const [totalAssets, symbol, decimals] = await Promise.all([
        client.readContract({ address: vault, abi: erc4626Abi, functionName: "totalAssets" }),
        client.readContract({ address: assetAddress, abi: erc20MetadataAbi, functionName: "symbol" }),
        client.readContract({ address: assetAddress, abi: erc20MetadataAbi, functionName: "decimals" }),
      ]);
      if (!expected.includes(String(symbol).toUpperCase())) return null;
      const units = Number(formatUnits(totalAssets as bigint, decimals as number));
      const tvl = units * (prices[v.asset] ?? v.priceUsd);
      return Number.isFinite(tvl) && tvl > 0 ? tvl : null;
    };
    return await Promise.race([read(), new Promise<null>((r) => setTimeout(() => r(null), 5000))]);
  } catch {
    return null;
  }
}

// Same priority chain as the standalone terminal: Concrete API → DefiLlama → ETH RPC → simulated.
async function fetchVaults(pricesP: Promise<Market["prices"]>): Promise<Pick<Market, "vaults" | "source">> {
  const base = fallbackMarket("live").vaults;

  // Reference vaults (lib/knownVaults.ts) keep their Earn-page APY, but TVL is re-read on-chain so it stays live
  // even when every other source below fails.
  const refVaults = VAULT_BASE.filter((v) => v.reference);
  // Started immediately and awaited only when a source has produced its numbers, so it runs alongside them.
  const onchainTvlP = pricesP.then(async (prices) => {
    const out = new Map<string, number>();
    await Promise.all(
      refVaults.map(async (v) => {
        const t = await readOnchainTvl(v, prices);
        if (t !== null) out.set(v.id, t);
      }),
    );
    return out;
  });
  const withRefTvl = async (vaults: Market["vaults"]): Promise<Market["vaults"]> => {
    const onchainTvl = await onchainTvlP.catch(() => new Map<string, number>());
    for (const v of refVaults) {
      const t = onchainTvl.get(v.id);
      if (t !== undefined) vaults[v.id] = { ...vaults[v.id], tvl: t, dailyYield: (t * vaults[v.id].apy) / 100 / 365 };
    }
    return vaults;
  };

  // 1) app.concrete.xyz
  try {
    const raw = await getJson("https://app.concrete.xyz/api/vaults", { headers: { Accept: "application/json" } });
    if (Array.isArray(raw)) {
      const vaults = {} as Market["vaults"];
      for (const v of VAULT_BASE) {
        const byAddress = raw.find((r) => JSON.stringify(r).toLowerCase().includes(v.address.toLowerCase()));
        // Asset-name matching is only safe for the original four (one vault per asset); reference vaults share
        // assets (e.g. several USDC vaults), so they match by address only.
        const match = byAddress ?? (v.reference ? undefined : raw.find((r) => JSON.stringify(r).toLowerCase().includes(v.asset.toLowerCase())));
        vaults[v.id] = {
          apy: num(match?.apy, v.apy),
          tvl: num(match?.tvl, v.tvl),
          dailyYield: num(match?.dailyYield, v.dailyYield),
        };
      }
      return { vaults: await withRefTvl(vaults), source: "live" };
    }
  } catch {
    /* fall through */
  }

  // 2) DefiLlama protocol TVL, split by fixed ratios
  try {
    const llama = await getJson("https://api.llama.fi/protocol/concrete");
    const series = Array.isArray(llama?.tvl) ? llama.tvl : [];
    const total = num(series[series.length - 1]?.totalLiquidityUSD, 0);
    if (total > 0) {
      // Split ratios only cover the original four vaults; reference vaults keep their own (on-chain) TVL.
      const ratios: Partial<Record<VaultId, number>> = { weeth: 0.205, ctwbtc: 0.145, ctusd: 0.601, frxusd: 0.049 };
      const vaults = {} as Market["vaults"];
      for (const v of VAULT_BASE) {
        const r = ratios[v.id];
        vaults[v.id] = r !== undefined ? { ...base[v.id], tvl: total * r } : { ...base[v.id] };
      }
      return { vaults: await withRefTvl(vaults), source: "partial" };
    }
  } catch {
    /* fall through */
  }

  // 3) ETH RPC block number used as a seed for small APY jitter
  try {
    const rpc = await getJson("https://eth.llamarpc.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
    });
    const block = parseInt(String(rpc?.result ?? "0x0"), 16);
    if (Number.isFinite(block) && block > 0) {
      const vaults = {} as Market["vaults"];
      for (const v of VAULT_BASE) {
        const seed = (block + (strHash(v.id) % 1000)) % 200;
        vaults[v.id] = v.reference
          ? { ...base[v.id] }
          : { ...base[v.id], apy: Math.round((v.apy + seed / 1000 - 0.1) * 100) / 100 };
      }
      return { vaults: await withRefTvl(vaults), source: "rpc" };
    }
  } catch {
    /* fall through */
  }

  const sim = fallbackMarket("simulated");
  return { vaults: await withRefTvl(sim.vaults), source: "simulated" };
}

export async function GET() {
  const pricesP = fetchPrices();
  const [prices, vaultPart] = await Promise.all([pricesP, fetchVaults(pricesP)]);
  const market: Market = { ...vaultPart, prices: prices as Record<Asset, number>, ts: Date.now() };
  return NextResponse.json(market, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
  });
}
