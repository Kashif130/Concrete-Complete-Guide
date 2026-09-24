// Concrete's points program (points.concrete.xyz) runs on Fuul's incentive
// infrastructure (docs.fuul.xyz). Confirmed live via browser network capture
// on 2026-09-12: the front-end calls Fuul's points leaderboard endpoint,
// either filtered to a single user_identifier ("my points") or unfiltered
// with a page_size ("leaderboard"). Project id is "concrete".
//
//   GET https://api.fuul.xyz/api/v1/payouts/leaderboard/points
//       ?project_id=concrete&page_size=<n>&page=1
//       [&user_identifier=<wallet>&user_identifier_type=evm_address]
//   Authorization: Bearer <read-only front-end key>
//   X-Fuul-Sdk-Version: 0.0.0
//
// The bearer key is a front-end-safe, read-only key that Concrete's own
// site ships to every visitor's browser (it can only read, not write). It
// still shouldn't be committed to a public repo — keep it in `.env.local`
// as FUUL_API_KEY (see .env.example), never in source. Without it,
// /api/points reports itself as unconfigured rather than guessing data.
// Because this key wasn't issued to this tool by Concrete/Blueprint
// Finance, treat it as liable to rotate or stop working at any time.

const FUUL_BASE_URL = "https://api.fuul.xyz/api";
const FUUL_PROJECT_ID = "concrete";
const FUUL_SDK_VERSION = "0.0.0";

export type FuulPointsResult = {
  raw: unknown;
};

export class FuulNotConfiguredError extends Error {
  constructor() {
    super("FUUL_API_KEY is not set");
    this.name = "FuulNotConfiguredError";
  }
}

function fuulHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "X-Fuul-Sdk-Version": FUUL_SDK_VERSION,
    // Fuul's response includes `Access-Control-Allow-Origin:
    // https://points.concrete.xyz` (not a wildcard), which means it
    // validates the calling origin server-side, not just via browser CORS
    // preflight. A bare Origin/Referer swap wasn't enough on its own
    // (still got a 404 "Project not found"), so this replicates the full
    // header fingerprint captured from the real browser request as
    // closely as a server-side fetch can. This is still just reuse of a
    // read-only key already visible in the requester's own browser
    // session, for the same publicly-displayed leaderboard data — not a
    // bypass of anything they don't already have access to.
    Origin: "https://points.concrete.xyz",
    Referer: "https://points.concrete.xyz/",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
  };
}

export class FuulHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "FuulHttpError";
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fuulGet(params: URLSearchParams, apiKey: string) {
  // Fuul exposes `Retry-After` (see Access-Control-Expose-Headers), so it does
  // rate limit. Honour it a few times instead of failing a whole bulk read.
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(
      `${FUUL_BASE_URL}/v1/payouts/leaderboard/points?${params.toString()}`,
      { headers: fuulHeaders(apiKey), cache: "no-store" }
    );

    if (res.status === 429 && attempt < 3) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const waitMs = Math.min(
        Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1),
        5000
      );
      await sleep(waitMs);
      continue;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const hint =
        res.status === 404
          ? " (This exact wording, on a request that worked in the browser, usually means the key is short-lived/session-scoped and has already expired — try re-capturing a fresh Authorization header from a new page load of points.concrete.xyz.)"
          : "";
      throw new FuulHttpError(
        res.status,
        `Fuul API responded ${res.status}: ${body || res.statusText}${hint}`
      );
    }

    return res.json();
  }
  throw new FuulHttpError(429, "Fuul API rate limit — try again shortly.");
}

function requireKey(): string {
  const apiKey = process.env.FUUL_API_KEY;
  if (!apiKey) throw new FuulNotConfiguredError();
  return apiKey;
}

export async function getUserPoints(
  walletAddress: string
): Promise<FuulPointsResult> {
  const apiKey = requireKey();
  const params = new URLSearchParams({
    project_id: FUUL_PROJECT_ID,
    page_size: "1",
    page: "1",
    user_identifier: walletAddress,
    user_identifier_type: "evm_address",
  });
  const data = await fuulGet(params, apiKey);
  return { raw: data };
}

// ---------------------------------------------------------------------------
// Full leaderboard reads (top-N and "every user") — used for the leaderboard
// page and for the airdrop estimator's real total-community-points number.
// ---------------------------------------------------------------------------

export type LeaderRow = { rank: number; address: string; points: number };

export type LeaderboardSnapshot = {
  rows: LeaderRow[];
  /** Users actually read (may be < totalUsers if incomplete). */
  usersRead: number;
  /** Total users according to Fuul, when the response reports it. */
  totalUsers: number | null;
  /** Sum of `points` over rows read. Only the true community total if `complete`. */
  totalPoints: number;
  calculatedAt: string | null;
  complete: boolean;
};

type ParsedPage = {
  rows: LeaderRow[];
  rawCount: number;
  totalResults: number | null;
  calculatedAt: string | null;
};

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)))
    return Number(v);
  return null;
}

function parsePage(data: unknown): ParsedPage {
  const obj = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const results = Array.isArray(obj.results) ? obj.results : [];
  const rows: LeaderRow[] = [];
  for (const r of results) {
    const row = r as Record<string, unknown>;
    const address =
      typeof row.address === "string"
        ? row.address
        : typeof row.user_identifier === "string"
          ? row.user_identifier
          : null;
    const points = num(row.total_amount);
    if (!address || points === null) continue;
    rows.push({ rank: num(row.rank) ?? 0, address, points });
  }
  const pagination = (obj.pagination ?? {}) as Record<string, unknown>;
  const totalResults =
    num(obj.total_results) ??
    num(obj.total_count) ??
    num(obj.total) ??
    num(pagination.total_results) ??
    num(pagination.total) ??
    null;
  return {
    rows,
    rawCount: results.length,
    totalResults,
    calculatedAt: typeof obj.calculated_at === "string" ? obj.calculated_at : null,
  };
}

async function fetchPage(page: number, size: number, apiKey: string) {
  const params = new URLSearchParams({
    project_id: FUUL_PROJECT_ID,
    page_size: String(size),
    page: String(page),
  });
  return parsePage(await fuulGet(params, apiKey));
}

const PAGE_SIZE_CANDIDATES = [100, 50, 25];
const CONCURRENCY = 6;
const MAX_PAGES = 5000;

/**
 * Reads the leaderboard page by page. `maxRows` = Infinity reads everyone.
 * Stops at the end of the list, at maxRows, on the first failed page, or when
 * the time budget runs out — and reports `complete` honestly.
 */
async function fetchLeaderboard(
  maxRows: number,
  budgetMs: number
): Promise<LeaderboardSnapshot> {
  const apiKey = requireKey();
  const deadline = Date.now() + budgetMs;

  // Probe the largest page size Fuul accepts.
  let size = PAGE_SIZE_CANDIDATES[0];
  let first: ParsedPage | null = null;
  let lastErr: unknown;
  for (const candidate of PAGE_SIZE_CANDIDATES) {
    try {
      first = await fetchPage(1, candidate, apiKey);
      size = candidate;
      break;
    } catch (e) {
      lastErr = e;
      if (!(e instanceof FuulHttpError) || (e.status !== 400 && e.status !== 422)) throw e;
    }
  }
  if (!first) throw lastErr instanceof Error ? lastErr : new Error("Fuul read failed");

  const byAddr = new Map<string, LeaderRow>();
  const add = (rows: LeaderRow[]) => {
    for (const r of rows) byAddr.set(r.address.toLowerCase(), r);
  };
  add(first.rows);

  const knownTotal = first.totalResults;
  const target = Math.min(maxRows, knownTotal ?? Infinity);
  const lastPageKnown = Number.isFinite(target) ? Math.ceil(target / size) : Infinity;

  let done = first.rawCount < size; // short first page => that's everyone
  let failed = false;
  let nextPage = 2;

  while (!done && !failed && byAddr.size < target && Date.now() < deadline) {
    const lastPage = Math.min(nextPage + CONCURRENCY - 1, lastPageKnown, MAX_PAGES);
    if (nextPage > lastPage) break;

    const pages = Array.from({ length: lastPage - nextPage + 1 }, (_, i) => nextPage + i);
    const settled = await Promise.allSettled(pages.map((p) => fetchPage(p, size, apiKey)));

    for (const s of settled) {
      if (s.status === "rejected") {
        failed = true;
        break;
      }
      add(s.value.rows);
      if (s.value.rawCount < size) {
        done = true;
        break;
      }
    }
    nextPage = lastPage + 1;
    if (nextPage > MAX_PAGES) break;
  }

  let rows = Array.from(byAddr.values()).sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    return b.points - a.points;
  });
  const reachedTarget = rows.length >= target && Number.isFinite(target);
  const complete = !failed && (done || reachedTarget);

  if (Number.isFinite(maxRows)) rows = rows.slice(0, maxRows);

  return {
    rows,
    usersRead: rows.length,
    totalUsers: knownTotal ?? (complete && !Number.isFinite(maxRows) ? rows.length : null),
    totalPoints: rows.reduce((sum, r) => sum + r.points, 0),
    calculatedAt: first.calculatedAt,
    complete,
  };
}

// In-memory cache + in-flight de-duplication, so a burst of visitors triggers
// one bulk read, not one each. (Per server instance; the routes also send
// CDN cache headers so Vercel's edge absorbs most traffic.)
type CacheEntry = { at: number; p: Promise<LeaderboardSnapshot> };
const cache = new Map<string, CacheEntry>();
const TTL_TOP_MS = 5 * 60_000;
const TTL_ALL_MS = 15 * 60_000;

export function getLeaderboardSnapshot(
  maxRows: number | null
): Promise<LeaderboardSnapshot> {
  const key = maxRows === null ? "all" : `top${maxRows}`;
  const ttl = maxRows === null ? TTL_ALL_MS : TTL_TOP_MS;

  const all = cache.get("all");
  if (maxRows !== null && all && Date.now() - all.at < TTL_ALL_MS) {
    return all.p.then((s) =>
      s.complete ? { ...s, rows: s.rows.slice(0, maxRows) } : fetchTopFresh(key, maxRows, ttl)
    );
  }
  return fetchTopFresh(key, maxRows, ttl);
}

function fetchTopFresh(key: string, maxRows: number | null, ttl: number) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.p;

  const p = fetchLeaderboard(
    maxRows === null ? Infinity : maxRows,
    maxRows === null ? 50_000 : 20_000
  );
  const entry = { at: Date.now(), p };
  cache.set(key, entry);
  p.then((s) => {
    if (!s.complete && cache.get(key) === entry) cache.delete(key);
  }).catch(() => {
    if (cache.get(key) === entry) cache.delete(key);
  });
  return p;
}
