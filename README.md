# Concrete — The Complete Guide (web app)

A Vercel-ready Next.js 14 (App Router) site built from the `concrete-xyz-complete-guide`
markdown docs: 24 pages across Beginner → Advanced → Ecosystem → Reference, a language
toggle, and a live on-chain stat pulled straight from a public API.

## What's live vs. static

- **Total value locked** on the home page is fetched client-side from DefiLlama's free
  public API (`https://api.llama.fi/tvl/concrete`) with `cache: "no-store"`, on load and
  every 60 seconds after. Nothing about that number is baked in at build time.
- The other four figures (assets processed, deposits, volume, depositors) come from the
  source repo's `README.md` — they were hand-recorded from concrete.xyz / app.concrete.xyz
  on 20 Sep 2026. Concrete doesn't expose a public live API for those, so the UI labels
  them plainly as a dated snapshot rather than pretending they refresh.

## Languages

English, Roman Urdu, Hindi, Nigerian Pidgin, Chinese (Simplified), and Indonesian.

- All navigation, the homepage, and the footer disclaimer are fully translated in all six.
- **All 24 doc pages** are fully translated in all six languages (English + Roman Urdu, Hindi,
  Nigerian Pidgin, Chinese, Indonesian). The "not translated yet" banner is kept in the UI as a
  fallback for any page added later. See **Translating more pages** below to extend coverage.

## Vault Terminal (`/vault`)

The Concrete Vault stability analyst, ported from Streamlit into the Guide (same six languages,
same paper/blueprint look, no extra npm dependencies — charts are plain SVG).

- `app/api/market/route.ts` — server-side data chain: app.concrete.xyz → DefiLlama → ETH RPC →
  simulated fallback, plus CoinGecko prices. Cached 60 s at the CDN; the Refresh button bypasses it.
- `lib/vault/data.ts` — vault definitions, health-factor zones, efficiency index, simulator maths.
- `lib/vault/dictionary.ts` — Terminal UI copy in all six languages (English fallback per key).
- `components/vault/` — terminal shell, SVG charts, and one file per tab in `tabs/`.
  New tabs are registered in the `TABS` array in `VaultTerminal.tsx`.

All eight tabs from the original Streamlit terminal now live here (plus a ninth, **Compare**, added afterwards): Overview, Simulator,
Health Radar (gauges + Vault DNA), Analytics, **Rebalancer**, **Gas & Fees**, **Yield Calendar**
and **FAQs**. The Streamlit multipage app is no longer needed for these features.

**Compare tab** (`/vault?tab=compare`, optional `&cmp=ctusd,ctwbtc` to preselect) puts 2–3 vaults side by
side: APY, estimated earnings (uses the control-panel deposit/period/compounding), TVL, efficiency index, risk,
health factor, modelled APY volatility, liquidity depth and fees. Best-in-row cells are highlighted. Deposit and
withdrawal fees are shown as "None" (per the Fees guide); management/performance fees show the protocol-wide
ranges until you fill in the optional `fees: { management, performance }` (percent) on a vault in
`lib/vault/data.ts` — then the real per-vault numbers appear automatically. Copy: `lib/vault/dictionary.compare.ts`.

- `app/api/gas/route.ts` — live `eth_gasPrice` for the Gas & Fees tab (server-side, cached 30 s).
  Uses `ETHEREUM_RPC_URL` if set, otherwise tries public RPCs in turn, then falls back to a
  clearly labelled simulated 12.5 gwei.
- `lib/vault/tools.ts` — pure maths for the Rebalancer (strategy scoring, weighted APY), gas cost
  matrix, and the yield-calendar series. No React, easy to unit-test.
- `lib/vault/dictionary.tools.ts` — copy for these four tabs in all six languages (spread into
  `dictionary.ts`; English fallback per key).
- `lib/vault/useTabState.ts` — keeps typed-in figures (e.g. rebalancer holdings) when you switch
  tabs. In memory only — deliberately not localStorage, since they're financial inputs.
- The Yield Calendar reuses the vault, deposit and compounding from the controls panel and adds
  only its own months slider (the Streamlit page had duplicate selectors for these).

The Wallet Tracker, Points and Airdrop Estimator (Streamlit pages 9–11) were ported *from* this
app originally, so they already live under `/tracker`.

**$CT verification card.** `components/CtTokenCard.tsx`, shown on `/tracker/airdrop` and on public
wallet profiles, next to the airdrop estimator. Concrete Foundation has now published a real $CT
contract address, two Halborn audits, and a MiCAR white paper on concretefoundation.xyz — none of
that existed when the airdrop estimator's "no TGE announced yet" copy was written, so the card
gives people something on-chain to check instead of just a disclaimer: the verified Etherscan
link, both audit PDFs, the MiCAR white paper, and the official concretefoundation.xyz link, plus a
one-line warning that no legitimate source will ask you to connect a wallet to "claim" $CT. Copy:
`lib/vault/dictionary.tracker.ts` (`trCt*` keys, all six languages). The Help Center's points topic
(`lib/helpBot.ts` → `TOPIC_LINKS.points`) now links here too. If the Foundation moves the audit/
whitepaper PDFs, update the constants at the top of `CtTokenCard.tsx`.

**$CT launch watcher.** `components/CtLaunchWatcher.tsx` + `app/api/ct-check/route.ts`, shown right
below the verification card. There's no API for "has $CT launched yet", so it works like the
existing vault price alerts (`AlertSetup.tsx`): the stateless `/api/ct-check` endpoint fetches
concretefoundation.xyz server-side, strips it to visible text, and hashes it. The browser (or an
external cron via the webhook URL) sends the hash it saw last time as `knownHash`; if today's hash
differs, the page's text genuinely changed — a real signal, not a guess. The baseline hash lives in
`localStorage` (`concrete_ct_watch_hash`) since it's just a fingerprint, not a financial input.

**Home directory + deep links.** The home page ends with a card for every terminal tab and for the
tracker features (the Guide's version of the Streamlit `Home.py` dashboard). Tab cards link to
`/vault?tab=<id>` (`overview`, `simulator`, `health`, `analytics`, `rebalancer`, `gas`, `calendar`,
`faq`), and the terminal keeps that query string in sync as you switch tabs, so any tab can be
bookmarked or shared. Card copy lives in `lib/vault/dictionary.home.ts`. If you add a tab, add its
`id` to `TABS` in `VaultTerminal.tsx` and a card to `TOOLS` in `app/page.tsx`.

## Docs search (Cmd/Ctrl+K)

The header has a search button (and a global **Cmd+K / Ctrl+K** shortcut) that opens a palette searching all 24
doc pages at once — no server round-trip. `lib/docSearch.ts` builds an in-memory index (one entry per heading
section, in the active language, falling back to English) the first time the palette is opened or the button is
hovered; it is lazily imported, so other pages don't pay for it. Results are ranked per page (title > heading >
body), every term must match, and each result deep-links to the best-matching heading. Heading anchors come from
`lib/slugify.ts`, shared with `DocRenderer` so the two can't drift. Headings in non-Latin scripts (zh, hi) have no
anchor, so those results link to the page top. UI: `components/DocSearch.tsx`; copy: `lib/vault/dictionary.search.ts`.

The chatbot's own search (`/api/help`) is unchanged.

## Help Center bot (mkashifalikcp bot)

`components/HelpChatBot.tsx` + `lib/helpBot.ts` (UI copy/routing only — see below) + `app/api/help`
+ `lib/help/*` (retrieval, prompt, guardrails). Optional voice input via the browser's
SpeechRecognition API (mic button, no extra package).

**No facts are hard-coded in the bot any more.** Fees, withdrawal times, points status etc. used to be
hand-copied into `lib/helpBot.ts` in six languages and silently went stale. Now every answer is
retrieval-augmented generation over the guide's own pages:

1. **Retrieval** (`lib/help/corpus.ts`) — the 26 doc pages are split into ~280 chunks (one canonical
   layout from the English pages, reused for all six languages since the translations are
   block-for-block aligned) and indexed with BM25, one entry per `(chunk, language)`. A question in
   any of the six languages matches its own language's text directly. `lib/help/concepts.ts` adds
   cross-language aliases (fee ≈ शुल्क ≈ 费用) as a low-weight safety net, and `lib/help/text.ts` has a
   small multilingual tokenizer + stemmer (so "fee"/"fees" merge, but "point" can never match
   "appointment" — matching is per whole token, not substring).
2. **Generation** — the retrieved English excerpts + the last few turns are sent to Claude
   (`lib/help/anthropic.ts`, a small fetch-based client — model `HELP_MODEL`, default Haiku), with a
   system prompt (`lib/help/prompt.ts`) that requires: answer only from the excerpts, reply in the
   user's language, never give financial advice (flag it with a control token instead — see below),
   never ask for a seed phrase/signature, and mention the guide's last-verified date when quoting a
   number. The answer streams to the browser as it's generated (NDJSON over `POST /api/help`).
3. **Guardrails that don't depend on the model behaving**: `lib/help/guard.ts` detects seed-phrase/
   private-key-shaped input *before* it reaches the model or a log (`app/api/help` returns a fixed
   warning instead); a regex net in the same file flags "should I / which vault is best / how much
   will I make"-type questions in all six languages so the "not financial advice" note is added by the
   server itself even if the model's own `[[ADVICE]]` token (parsed by `lib/help/control.ts`) doesn't
   fire. `redactForLog` strips addresses/emails/URLs/long numbers from anything that reaches a log.
4. **When the AI can't be used** (no `ANTHROPIC_API_KEY`, the daily budget is spent, per-IP/global rate
   limits, 3 consecutive upstream failures open a 60s circuit breaker, or the request just fails) the
   client falls back automatically to the original keyword bot: topic routing
   (`matchTopic`/`isBroadQuery` in `lib/helpBot.ts`, now whole-word matching — "restart" no longer
   fires "start", "coffee" no longer fires "fee", "point" no longer fires "appointment") plus the
   in-browser docs search (`lib/docSearch.ts`, the same index Cmd/Ctrl+K uses) or its page-summary
   helper (`pageSummary`) for the topic chips — both quote the guide's *current* wording, so the
   fallback path can't go stale either. Nothing in this path needs a server round trip beyond the
   existing English-only `GET /api/help?q=` (kept for backward compatibility).
5. **Feedback loop**: every answer gets 👍/👎, and a "nothing found" reply offers **Search all docs**
   (opens the Cmd+K palette pre-filled with the question). These, plus the model's own
   `[[NO_ANSWER]]` control token, are logged anonymously (`lib/help/store.ts` — no name, IP or wallet
   is stored) via `POST /api/help/feedback`. See **Help Center insights** below.
6. **Freshness label**: `content/docs.meta.ts` holds one `DOCS_LAST_VERIFIED` date for the whole guide;
   bump it whenever you re-check the guide against concrete.xyz / app.concrete.xyz. The bot shows this
   date under AI answers and adds a "may be out of date" note once it's older than
   `DOCS_STALE_AFTER_DAYS` (default 60).

The name step is now optional (a "✎ Add your name" chip in the topic row) instead of blocking the chat.

Small tables you may want to extend: `SYNONYMS` in `lib/docSearch.ts` and `RAW` in
`lib/help/concepts.ts` (words users type that the translated docs express differently, e.g. zh 提款 →
提现), `lib/stopwords.ts` / `lib/help/text.ts`, and `TOPIC_KEYWORDS` / `TOPIC_FOLLOWUPS` in
`lib/helpBot.ts`. Other components can open the palette with
`window.dispatchEvent(new CustomEvent("concrete:open-docsearch", { detail: { query: "fees" } }))`.

Env vars (all optional — see `.env.example`): `ANTHROPIC_API_KEY`, `HELP_MODEL`,
`HELP_DAILY_LLM_LIMIT`, `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` (or Vercel KV's
`KV_REST_API_URL`/`KV_REST_API_TOKEN`), `HELP_ADMIN_KEY`.

### Help Center insights (`/help-insights`, owner-only)

Reads `GET /api/help/report` (Bearer `HELP_ADMIN_KEY`; 404s until that env var is set). Shows question
volume, AI vs. fallback split, 👍/👎, most-used and most-👎'd pages, and — most useful — **the
questions the guide could not answer**, i.e. what's actually missing from the docs. Needs
`UPSTASH_REDIS_REST_URL`/`TOKEN`; without it the events still go to the server logs
(search for `help_event`) but the report endpoint returns 501.

### Quiz (`/tracker/quiz`)

Local-first (localStorage) tier progression, plus:

- **Streaks** — a daily play streak (`lib/quizStats.ts`), shown on the picker screen.
- **Badges** — unlockable achievements (perfect batches, streak milestones, reaching Moai Tier, a
  Speed Mode clean sweep, clearing weak spots). Defined in `QUIZ_BADGES` in `lib/quizStats.ts`.
- **Speed Mode** — an opt-in per-question countdown; correct answers within time earn a bonus scaled
  by the batch's level.
- **Question/option shuffle** — every attempt reorders questions and each question's own options
  (`shuffleBatch`), so memorizing "answer B" stops working.
- **Weighted scoring** — a correct answer on a harder Level is worth more (`getWeightedScore`); this
  is what the leaderboard ranks on, separate from the plain all-time-correct count that still drives
  tiers.
- **Weak-spot review** — every missed question is tracked and replayable as its own batch
  (`buildWeakSpotBatch`); clearing it there removes it from the list without touching your tier score.
- **Global leaderboard** — `GET`/`POST /api/quiz-leaderboard`, stored in the same Vercel KV / Upstash
  Redis the help-bot already uses (`UPSTASH_REDIS_REST_URL`/`TOKEN` or `KV_REST_API_URL`/`TOKEN` — no
  extra setup if that's already configured). Ranked by weighted score in a Redis sorted set. Hides
  itself entirely if that env var isn't set, instead of erroring.
- **Anti-cheat** — submissions are rate-limited per IP (`lib/help/store.ts`'s `rateLimit`, same
  pattern the help-bot uses) and the server recomputes every score from the real question bank
  (`content/quiz.ts`), clamping each batch's submitted count to that batch's real length — a client
  can't submit more than what actually exists.
- **Tier certificates** — finishing a batch that pushes you into a new tier renders a distinct
  "certificate" share card (`ShareCardImage`'s `certificate` prop) in addition to the regular one.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub/GitLab/Bitbucket repo (or run `vercel` from inside it).
2. Import the repo at vercel.com/new. Framework preset is auto-detected as Next.js —
   no environment variables or build-command changes are needed.
3. Deploy. The DefiLlama fetch happens in the browser, so it works the same in
   production as in preview deployments.

## Regenerating content from the docs

The 24 doc pages are pre-parsed from the original markdown into
`content/docs.generated.ts` by a small script (no external markdown library, so there's
nothing extra to install):

```bash
node scripts/build-content.mjs /path/to/concrete-xyz-complete-guide/docs ./content/docs.generated.ts
```

Run this again if the source docs change.

## Translating more pages

1. Open `content/docs.generated.ts` and find the doc's `blocks` array (same shape as
   `content/translations/what-is-concrete.ts`).
2. Copy that array into a new file under `content/translations/`, translate the `text`,
   `items`, `headers` and `rows` strings (leave `type`, `level`, `lang`, and internal
   `/docs/...` links as-is).
3. Register it in `content/translations/index.ts` under the doc's slug and locale.

## Project structure

```
app/                     routes (home, /docs/[...slug], /vault, /tracker, /api/market, /api/gas)
components/              UI components (Sidebar, DocRenderer, LiveStats, LanguageToggle…)
content/docs.generated.ts   parsed doc content (generated, see above)
content/translations/    hand-written translations, keyed by doc slug → locale
lib/i18n.ts              locale list + Dictionary type
lib/dictionaries.ts       UI copy in all six languages
lib/LocaleProvider.tsx    client-side locale context (persists to localStorage)
scripts/build-content.mjs   markdown → content/docs.generated.ts converter
```

## Notes

- This guide is unofficial — not made, maintained, or endorsed by Blueprint Finance.
  That disclaimer is preserved verbatim (translated) in the site footer.

## Tracker pages

| Route | Shows |
| --- | --- |
| `/tracker` | Points balance only (auto-runs for the last wallet used) + collapsible top-1,000 leaderboard |
| `/tracker/leaderboard` | Top 1,000 leaderboard (search + pagination) |
| `/tracker/positions` | Vault positions only |
| `/tracker/airdrop` | Points auto-checked → airdrop estimator only |
| `/tracker/w/<address>` | Shareable public profile (everything) |

The estimator's "total community points" is the sum of every user's balance read from Fuul via `/api/points/total` (paginated, cached 15 min). If a read is partial the UI says so.

### Translations

All tracker pages (balance, leaderboard, positions, airdrop, public profile, alerts, share/export buttons) use the site's language switcher. Copy lives in `lib/vault/dictionary.tracker.ts` (en, ur, hi, pcm, zh, id); a missing key falls back to English. Not translated: browser tab titles (static metadata), the PDF report and CSV/JSON export contents.

## Batch: multi-wallet, risk score, PWA, PnL history, reviews, public API, alerts bot

A later pass added seven features on top of everything above. Each is additive and
degrades gracefully where it needs infrastructure this deployment might not have
configured.

- **Multi-wallet portfolio aggregation.** `WalletForm` already accepted a
  comma-separated wallet list; `components/MultiWalletSummary.tsx` (wired into
  `TrackerApp.tsx`) now sums points and per-token vault value **across** every
  wallet entered, shown above the per-wallet breakdown whenever more than one
  wallet is tracked at once.

- **Vault risk score (A–D).** `lib/vault/riskScore.ts` is a pure, documented
  weighted read of fields the terminal already tracks (health factor, yield
  consistency, liquidity depth, protocol maturity, strategy diversity, APY
  volatility) — no new data source. `components/vault/RiskScoreBadge.tsx` shows
  it in the Overview, Health Radar, and Compare tabs.

- **PWA / installable app.** `app/manifest.ts`, `public/sw.js`
  (offline app-shell cache + Web Push listener), `components/PwaInstallPrompt.tsx`
  (the `beforeinstallprompt` flow on Android/desktop Chrome; iOS Safari has no
  such event, so it's add-to-home-screen only there), and icons under
  `public/icons/`.

- **Personal deposit/withdrawal history (PnL).** `lib/ledger.ts` is a
  localStorage-only manual ledger per wallet+vault (the app has no way to see
  your real on-chain deposit/withdrawal history without indexing every vault's
  events). `components/PositionLedger.tsx`, embedded under each position in
  `VaultPanel.tsx` as a collapsible "Your history" section, computes realized
  vs. unrealized PnL against the live position value.

- **Community vault reviews.** Upvote/downvote + a short comment, one per
  person per vault (upserts, not duplicates). New **Reviews** tab in the Vault
  Terminal (`components/vault/tabs/ReviewsTab.tsx`), backed by
  `app/api/vault-reviews/route.ts` and `lib/reviewsStore.ts` — same Upstash/
  Vercel KV REST pattern as the quiz leaderboard. Shows `not_configured`
  gracefully if that env isn't set up rather than erroring.

- **Public API docs.** `/developers` documents every JSON endpoint this app
  itself calls (vault reads, points, market, gas, leaderboard, reviews, ENS,
  $CT price, quiz leaderboard, alert-check) as a stable, unauthenticated,
  read-only surface for third-party builders. Linked from the home page tools
  grid and the footer.

- **Telegram + Discord alerts.** Two ways to get pinged, both building on the
  existing stateless `/api/alert-check` (`AlertSetup.tsx`):
  - **Discord**: `/api/alert-check` now accepts `&format=discord`, which
    shapes the POST body as `{ content: "..." }` so a plain Discord channel
    webhook URL (Server Settings → Integrations → Webhooks, no bot needed)
    renders it as a normal message. Toggle it from the "Payload format"
    dropdown in `AlertSetup`.
  - **Telegram**: a real bot with memory. `lib/telegram.ts` (Bot API
    client), `lib/telegramStore.ts` (Redis-backed subscriptions with
    per-subscription `lastCrossed` dedup — unlike `/api/alert-check`, it
    only messages on the transition into a crossed state, not every tick),
    `app/api/telegram-webhook/route.ts` (handles `/watchprice`,
    `/watchapy`, `/watchct`, `/myalerts`, `/unwatch`, `/stop`, `/help`),
    and `app/api/telegram-check/route.ts` (the cron endpoint — reads each
    distinct price/APY/$CT source once per run, not once per subscription).
    Full setup steps (BotFather token, KV env vars, webhook registration,
    cron URL) are on `/developers#telegram`.
  - Env vars, all optional (each feature no-ops cleanly without them):
    `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CRON_SECRET` (optional — protects the
    cron endpoint from public triggering), plus the existing
    `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` /
    `UPSTASH_REDIS_REST_TOKEN` (shared with the quiz leaderboard and
    reviews).

None of these six features touch the docs pipeline (`content/translations/`,
`scripts/build-content.mjs`) — all new user-facing copy lives in
`lib/vault/dictionary.extras.ts`, English-only, falling back correctly per the
existing `useVT()` fallback rule so no other locale breaks.
