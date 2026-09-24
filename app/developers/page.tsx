import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Public API — Concrete Guide",
  description:
    "Free, read-only, unauthenticated JSON endpoints this app uses internally — documented for third-party builders. No API key, no rate-limit tier, best-effort uptime.",
};

type Param = { name: string; required: boolean; desc: string };
type Endpoint = {
  method: "GET";
  path: string;
  summary: string;
  params?: Param[];
  sample: string;
  responseNote: string;
  cache?: string;
};

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/vault",
    summary: "A wallet's live position (shares held, underlying value, share price) in one or more vaults on one chain.",
    params: [
      { name: "wallet", required: true, desc: "A checksummable 0x address." },
      { name: "chain", required: false, desc: "ethereum (default), arbitrum, or base." },
      { name: "vaults", required: true, desc: "Comma-separated vault (ERC-4626) addresses." },
    ],
    sample: "/api/vault?wallet=0xabc...&chain=ethereum&vaults=0x0e60...,0xacce...",
    responseNote:
      "{ vaults: [{ vaultAddress, name, symbol, underlyingSymbol, sharesHeldFormatted, underlyingValueFormatted, totalAssetsFormatted, sharePrice, blockNumber, error? }], warnings? }",
    cache: "no-store — always reads the current block.",
  },
  {
    method: "GET",
    path: "/api/vaults",
    summary: "Every vault in this app's known-vault list, read live on-chain — no wallet needed. Powers the home vault dashboard.",
    sample: "/api/vaults",
    responseNote: "{ fetchedAt, chains: [{ chain, blockNumber }], vaults: LiveVaultResult[] }",
    cache: "no-store.",
  },
  {
    method: "GET",
    path: "/api/points",
    summary: "A wallet's Fuul points total, rank, and (when Fuul's response includes it) a per-campaign breakdown.",
    params: [{ name: "wallet", required: true, desc: "A checksummable 0x address." }],
    sample: "/api/points?wallet=0xabc...",
    responseNote: "{ wallet, status: \"ok\" | \"not_configured\" | \"error\", totals }",
    cache: "no-store.",
  },
  {
    method: "GET",
    path: "/api/leaderboard",
    summary: "The Fuul points leaderboard — top wallets by points, plus total participant count.",
    params: [{ name: "limit", required: false, desc: "1–1000, default 1000." }],
    sample: "/api/leaderboard?limit=100",
    responseNote: "{ status: \"ok\", rows: [{ rank, wallet, points }], totalUsers }",
  },
  {
    method: "GET",
    path: "/api/market",
    summary: "The Vault Terminal's market snapshot for all 4 modeled vaults: APY, TVL, daily yield, and ETH/BTC prices, with source labelled (live / partial / rpc / simulated).",
    sample: "/api/market",
    responseNote: "{ vaults: Record<VaultId, {apy, tvl, dailyYield}>, prices: {WETH, WBTC, USDC, FRAX, USD1, WSTETH}, source, ts }",
    cache: "CDN-cached 60s; source chain is app.concrete.xyz → DefiLlama → ETH RPC → simulated fallback.",
  },
  {
    method: "GET",
    path: "/api/gas",
    summary: "Current Ethereum mainnet gas price (eth_gasPrice), server-proxied so the browser never hits a public RPC directly.",
    sample: "/api/gas",
    responseNote: "{ gwei, source: \"live\" | \"simulated\", ts }",
    cache: "30s.",
  },
  {
    method: "GET",
    path: "/api/ens",
    summary: "Reverse-resolves an address to its ENS name, if any.",
    params: [{ name: "address", required: true, desc: "A checksummable 0x address." }],
    sample: "/api/ens?address=0xabc...",
    responseNote: "{ address, name: string | null }",
    cache: "5 min in-memory per serverless instance.",
  },
  {
    method: "GET",
    path: "/api/ct-price",
    summary: "$CT token price from CoinGecko by contract address. Returns { trading: false } honestly until $CT actually lists — not an error state.",
    sample: "/api/ct-price",
    responseNote: "{ trading: false } | { trading: true, usd, usdMarketCap, ts }",
    cache: "60s.",
  },
  {
    method: "GET",
    path: "/api/vault-reviews",
    summary: "Community upvote/downvote + short-comment reviews for one of the Vault Terminal's 4 modeled vaults.",
    params: [
      { name: "vaultId", required: true, desc: "weeth, ctwbtc, ctusd, frxusd, frontier, rwausd1, srroyusdc, or royeth." },
      { name: "limit", required: false, desc: "1–100, default 30." },
      { name: "clientId", required: false, desc: "Your own anonymous client id, to get yourReview back." },
    ],
    sample: "/api/vault-reviews?vaultId=ctusd&limit=30",
    responseNote:
      "{ status: \"ok\" | \"not_configured\" | \"error\", upvotes, downvotes, reviews: [{name, vote, comment, updatedAt}], yourReview }",
    cache: "15s.",
  },
  {
    method: "GET",
    path: "/api/quiz-leaderboard",
    summary: "The Concrete-knowledge quiz's leaderboard.",
    params: [{ name: "limit", required: false, desc: "1–200, default 50." }],
    sample: "/api/quiz-leaderboard?limit=50",
    responseNote: "{ status: \"ok\", rows: [{ rank, name, weightedScore, totalCorrect, tierKey, streak }] }",
  },
  {
    method: "GET",
    path: "/api/alert-check",
    summary: "Stateless: reads a vault's live share price and, if a threshold is currently crossed, POSTs a payload to your webhook URL. Add &format=discord to send a ready-to-post Discord message body instead of raw JSON.",
    params: [
      { name: "vault", required: true, desc: "Vault (ERC-4626) address." },
      { name: "chain", required: false, desc: "ethereum (default), arbitrum, or base." },
      { name: "direction", required: false, desc: "above (default) or below." },
      { name: "threshold", required: true, desc: "Numeric share-price threshold." },
      { name: "webhook", required: false, desc: "URL to POST to when crossed (Slack/Discord/Zapier/your own)." },
      { name: "format", required: false, desc: "raw (default) or discord." },
    ],
    sample: "/api/alert-check?vault=0x0e60...&threshold=1.05&webhook=https://hooks.slack.com/...",
    responseNote: "{ vault, chain, sharePrice, threshold, direction, crossed, webhook, checkedAt }",
    cache: "Always live. Re-fires every check while the condition holds — point a cron at it, and have your receiver de-duplicate, or use the Telegram bot below for built-in dedup.",
  },
];

function EndpointCard({ e }: { e: Endpoint }) {
  return (
    <div className="border border-concreteMuted/40 bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="border border-steel bg-steel/10 px-2 py-0.5 font-mono text-xs font-semibold text-steelBright">
          {e.method}
        </span>
        <code className="font-mono text-sm text-ink">{e.path}</code>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-inkMuted">{e.summary}</p>

      {e.params && e.params.length > 0 && (
        <table className="mt-3 w-full border-collapse text-xs">
          <thead>
            <tr className="text-left text-inkMuted">
              <th className="border-b border-concreteMuted/30 py-1 pr-3 font-medium">Param</th>
              <th className="border-b border-concreteMuted/30 py-1 pr-3 font-medium">Required</th>
              <th className="border-b border-concreteMuted/30 py-1 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {e.params.map((p) => (
              <tr key={p.name}>
                <td className="border-b border-concreteMuted/20 py-1 pr-3 font-mono text-ink">{p.name}</td>
                <td className="border-b border-concreteMuted/20 py-1 pr-3 text-ink">{p.required ? "yes" : "no"}</td>
                <td className="border-b border-concreteMuted/20 py-1 text-inkMuted">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-wide text-inkMuted">Example</p>
        <code className="mt-1 block break-all bg-base px-2 py-1.5 font-mono text-xs text-brass">
          GET {SITE_URL}
          {e.sample}
        </code>
      </div>

      <div className="mt-2">
        <p className="text-[11px] uppercase tracking-wide text-inkMuted">Response shape</p>
        <code className="mt-1 block break-all bg-base px-2 py-1.5 font-mono text-[11px] text-inkMuted">
          {e.responseNote}
        </code>
      </div>

      {e.cache && <p className="mt-2 text-[11px] text-inkMuted">Freshness: {e.cache}</p>}
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <p className="font-mono text-xs uppercase tracking-wide text-rebar">For developers</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Public API</h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-inkMuted">
        Every endpoint below is the same JSON API this site's own pages call — nothing held
        back for a private tier. All are <strong>read-only GET requests, unauthenticated, no
        API key</strong>. There's no SLA: this is a community-run site, not Concrete's own
        infrastructure, so treat it as best-effort and cache aggressively on your end.
      </p>

      <div className="mt-4 grid gap-3 border border-concreteMuted/40 bg-brass/5 p-4 text-xs text-inkMuted sm:grid-cols-2">
        <div>
          <p className="font-semibold text-ink">Base URL</p>
          <code className="font-mono text-brass">{SITE_URL}</code>
        </div>
        <div>
          <p className="font-semibold text-ink">Auth</p>
          <p>None. Don't send wallet private keys or signatures — every endpoint here only ever reads public on-chain / public API data.</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Rate limits</p>
          <p>Unposted routes (market/gas/vaults/etc.) have no explicit limit but are cached at the edge. Write-adjacent read routes (reviews, quiz leaderboard) are limited per-IP — expect a 429 with a short cooldown if you poll too fast.</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Errors</p>
          <p>Non-2xx responses return {"{ status: \"error\", message }"} or, for a missing/invalid query param, {"{ error: \"...\" }"}. Some endpoints return {"{ status: \"not_configured\" }"} (200) when the underlying store — e.g. reviews, quiz leaderboard — isn't set up on this deployment, rather than a 4xx/5xx.</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {ENDPOINTS.map((e) => (
          <EndpointCard key={e.path} e={e} />
        ))}
      </div>

      <div id="telegram" className="mt-10 scroll-mt-20 border border-concreteMuted/40 bg-surface p-5">
        <h2 className="font-display text-xl font-semibold text-ink">Telegram alerts bot</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-inkMuted">
          A stateful alternative to <code className="font-mono text-xs text-brass">/api/alert-check</code> above: message a
          Telegram bot directly and it remembers your watches, checking on a
          cron and pinging you only when a threshold is <em>newly</em> crossed
          (not on every tick).
        </p>

        <h3 className="mt-4 font-display text-sm font-semibold text-ink">Commands (DM the bot)</h3>
        <ul className="mt-2 space-y-1 font-mono text-xs text-ink/90">
          <li><code className="text-brass">/watchprice &lt;chain&gt; &lt;vault_address&gt; &lt;above|below&gt; &lt;price&gt;</code></li>
          <li><code className="text-brass">/watchapy &lt;weeth|ctwbtc|ctusd|frxusd|frontier|rwausd1|srroyusdc|royeth&gt; &lt;above|below&gt; &lt;apy&gt;</code></li>
          <li><code className="text-brass">/watchct &lt;above|below&gt; &lt;usd_price&gt;</code></li>
          <li><code className="text-brass">/myalerts</code> · <code className="text-brass">/unwatch &lt;id&gt;</code> · <code className="text-brass">/stop</code> · <code className="text-brass">/help</code></li>
        </ul>

        <h3 className="mt-4 font-display text-sm font-semibold text-ink">Running your own instance</h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-inkMuted">
          <li>
            Create a bot with{" "}
            <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-steelBright underline">
              @BotFather
            </a>{" "}
            and set <code className="font-mono text-xs text-brass">TELEGRAM_BOT_TOKEN</code> in your deployment's environment.
          </li>
          <li>
            Set <code className="font-mono text-xs text-brass">KV_REST_API_URL</code> /{" "}
            <code className="font-mono text-xs text-brass">KV_REST_API_TOKEN</code> (Vercel KV) or{" "}
            <code className="font-mono text-xs text-brass">UPSTASH_REDIS_REST_URL</code> /{" "}
            <code className="font-mono text-xs text-brass">UPSTASH_REDIS_REST_TOKEN</code> — subscriptions are stored there. Free tier is plenty.
          </li>
          <li>
            Register the webhook once, from anywhere, by visiting:
            <code className="mt-1 block break-all bg-base px-2 py-1.5 font-mono text-[11px] text-brass">
              https://api.telegram.org/bot&lt;TOKEN&gt;/setWebhook?url={SITE_URL}/api/telegram-webhook
            </code>
          </li>
          <li>
            Optionally set <code className="font-mono text-xs text-brass">TELEGRAM_CRON_SECRET</code> to any string, then point a free
            external cron (cron-job.org, EasyCron, a GitHub Actions schedule) at:
            <code className="mt-1 block break-all bg-base px-2 py-1.5 font-mono text-[11px] text-brass">
              {SITE_URL}/api/telegram-check?secret=&lt;TELEGRAM_CRON_SECRET&gt;
            </code>
            every 2–5 minutes. Without the secret set, the endpoint works unauthenticated — fine for low-traffic personal use.
          </li>
        </ol>
        <p className="mt-3 text-xs text-inkMuted">
          Without a Telegram bot, use <code className="font-mono text-brass">/api/alert-check</code>'s{" "}
          <code className="font-mono text-brass">webhook</code> param with any Slack/Discord/Zapier URL instead — no bot token needed.
        </p>
      </div>

      <div className="mt-10 border-t border-line pt-6 text-sm text-inkMuted">
        <p>
          Nothing here is versioned yet — paths and response shapes can change as the app
          evolves. If you're building something that depends on one of these, open an issue
          (or a PR) on{" "}
          <a
            href="https://github.com/Kashif130/Concrete-Complete-Guide.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-steelBright underline"
          >
            GitHub
          </a>{" "}
          so a breaking change doesn't surprise you.
        </p>
        <p className="mt-3">
          Looking for Concrete's own protocol data (not this guide's cached copies)? See the{" "}
          <Link href="/docs/sdk-guide" className="text-steelBright underline">
            SDK guide
          </Link>{" "}
          and{" "}
          <Link href="/docs/subgraph-and-events" className="text-steelBright underline">
            subgraph & events
          </Link>{" "}
          doc pages.
        </p>
      </div>
    </div>
  );
}
