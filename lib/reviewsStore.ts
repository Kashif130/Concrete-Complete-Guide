// Server-side storage for per-vault community reviews: one vote
// (up/down) + a short comment per client per vault, upsertable (a client
// editing their own review replaces it rather than adding a duplicate).
// Same REST-Redis approach as lib/quizLeaderboardStore.ts and
// lib/help/store.ts — reads the same env vars, so nothing new has to be
// configured if either of those is already set up.

export type ReviewVote = "up" | "down";

export type VaultReview = {
  clientId: string;
  name: string;
  vote: ReviewVote;
  comment: string;
  updatedAt: number;
};

type Cmd = Array<string | number>;

function redisCfg(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

export function reviewsStorageConfigured(): boolean {
  return redisCfg() !== null;
}

async function pipeline(cmds: Cmd[]): Promise<Array<{ result?: unknown; error?: string }> | null> {
  const cfg = redisCfg();
  if (!cfg) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${cfg.token}`, "content-type": "application/json" },
      body: JSON.stringify(cmds),
    });
    if (!res.ok) return null;
    return (await res.json()) as Array<{ result?: unknown; error?: string }>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const HASH_PREFIX = "reviews:vault:"; // + vaultId -> HSET clientId -> JSON

export async function upsertReview(vaultId: string, review: VaultReview): Promise<boolean> {
  const out = await pipeline([["HSET", HASH_PREFIX + vaultId, review.clientId, JSON.stringify(review)]]);
  return out !== null;
}

export async function deleteReview(vaultId: string, clientId: string): Promise<boolean> {
  const out = await pipeline([["HDEL", HASH_PREFIX + vaultId, clientId]]);
  return out !== null;
}

export type ReviewsSummary = {
  upvotes: number;
  downvotes: number;
  reviews: Omit<VaultReview, "clientId">[];
  yourReview: VaultReview | null;
};

/** Newest first, capped at `limit` comments returned (vote counts are always exact, over the full set). */
export async function getReviews(
  vaultId: string,
  limit: number,
  requestingClientId?: string
): Promise<ReviewsSummary | null> {
  const out = await pipeline([["HGETALL", HASH_PREFIX + vaultId]]);
  if (out === null) return null;
  const flat = (out[0]?.result as string[] | undefined) ?? [];

  const all: VaultReview[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    try {
      const parsed = JSON.parse(flat[i + 1]) as VaultReview;
      if (parsed && (parsed.vote === "up" || parsed.vote === "down")) {
        all.push({ ...parsed, clientId: flat[i] });
      }
    } catch {
      // skip malformed entry
    }
  }

  all.sort((a, b) => b.updatedAt - a.updatedAt);
  const upvotes = all.filter((r) => r.vote === "up").length;
  const downvotes = all.length - upvotes;
  const yourReview = requestingClientId ? all.find((r) => r.clientId === requestingClientId) ?? null : null;

  return {
    upvotes,
    downvotes,
    reviews: all.slice(0, limit).map(({ clientId, ...rest }) => rest),
    yourReview,
  };
}
