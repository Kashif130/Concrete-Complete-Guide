import { NextResponse } from "next/server";
import { GAS_FALLBACK_GWEI } from "@/lib/vault/tools";

// Live Ethereum base gas for the Gas & Fees tab. Server-side so the browser never hits a
// public RPC directly (CORS / rate limits). Falls back to a labelled simulated value.
export const dynamic = "force-dynamic";

interface GasReading {
  gwei: number;
  source: "live" | "simulated";
  ts: number;
}

// ETHEREUM_RPC_URL (same override the wallet tracker uses) wins; otherwise try public endpoints in turn.
const PUBLIC_RPCS = ["https://ethereum-rpc.publicnode.com", "https://eth.llamarpc.com", "https://cloudflare-eth.com"];

async function readGwei(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string };
    const wei = parseInt(String(json?.result ?? "0x0"), 16);
    if (!Number.isFinite(wei) || wei <= 0) return null;
    return Math.round((wei / 1e9) * 100) / 100;
  } catch {
    return null;
  }
}

export async function GET() {
  const urls = process.env.ETHEREUM_RPC_URL ? [process.env.ETHEREUM_RPC_URL] : PUBLIC_RPCS;
  let gwei: number | null = null;
  for (const url of urls) {
    gwei = await readGwei(url);
    if (gwei !== null) break;
  }
  const body: GasReading = gwei !== null
    ? { gwei, source: "live", ts: Date.now() }
    : { gwei: GAS_FALLBACK_GWEI, source: "simulated", ts: Date.now() };
  return NextResponse.json(body, { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } });
}
