import { NextResponse } from "next/server";
import { CT_CONTRACT_ADDRESS } from "@/lib/ctToken";

// $CT has no TGE yet, so CoinGecko's token_price-by-contract endpoint returns an
// empty object for it today. That's not an error — it's the honest "not trading
// yet" state. The moment $CT lists on an exchange CoinGecko indexes, this same
// endpoint starts returning real numbers with zero code changes, same as the
// ETH/BTC prices in app/api/market/route.ts.
export const dynamic = "force-dynamic";

type CtPriceResponse =
  | { trading: false }
  | { trading: true; usd: number; usdMarketCap: number | null; ts: number };

export async function GET() {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${CT_CONTRACT_ADDRESS}&vs_currencies=usd&include_market_cap=true`;
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Record<string, { usd?: number; usd_market_cap?: number }>;
    const entry = data[CT_CONTRACT_ADDRESS.toLowerCase()];

    if (!entry || typeof entry.usd !== "number") {
      const body: CtPriceResponse = { trading: false };
      return NextResponse.json(body, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } });
    }

    const body: CtPriceResponse = {
      trading: true,
      usd: entry.usd,
      usdMarketCap: typeof entry.usd_market_cap === "number" ? entry.usd_market_cap : null,
      ts: Date.now(),
    };
    return NextResponse.json(body, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } });
  } catch {
    const body: CtPriceResponse = { trading: false };
    return NextResponse.json(body, { headers: { "Cache-Control": "s-maxage=30" } });
  }
}
