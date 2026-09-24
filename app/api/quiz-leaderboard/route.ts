import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/help/store";
import {
  quizStorageConfigured,
  scoreFromBestByBatch,
  submitScore,
  getTop,
} from "@/lib/quizLeaderboardStore";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const MAX_LIMIT = 200;

export async function GET(req: NextRequest) {
  if (!quizStorageConfigured()) {
    return NextResponse.json({
      status: "not_configured",
      message: "Quiz leaderboard storage isn't set up (KV_REST_API_URL/TOKEN or UPSTASH_REDIS_REST_URL/TOKEN).",
    });
  }

  // Read-side rate limit too — cheap, but keeps a scripted poller off Redis.
  if (!rateLimit(`quizlb:get:${clientKey(req)}`, 30, 60_000)) {
    return NextResponse.json({ status: "error", message: "Too many requests." }, { status: 429 });
  }

  const raw = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Math.min(Math.max(Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 50, 1), MAX_LIMIT);

  try {
    const rows = await getTop(limit);
    return NextResponse.json(
      { status: "ok", rows },
      { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=60" } }
    );
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function POST(req: NextRequest) {
  if (!quizStorageConfigured()) {
    return NextResponse.json({ status: "not_configured" });
  }

  // Anti-cheat: a real player finishing batches submits a handful of times
  // a minute at most; anything past that is a script hammering the
  // endpoint. Same rate-limit primitive the help-bot already uses.
  if (!rateLimit(`quizlb:post:${clientKey(req)}`, 6, 60_000)) {
    return NextResponse.json({ status: "error", message: "Too many submissions — slow down." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid JSON." }, { status: 400 });
  }

  const b = body as {
    clientId?: unknown;
    name?: unknown;
    bestByBatch?: unknown;
    tierKey?: unknown;
    streak?: unknown;
  };

  if (typeof b.clientId !== "string" || !/^[a-zA-Z0-9-_]{6,64}$/.test(b.clientId)) {
    return NextResponse.json({ status: "error", message: "Invalid client id." }, { status: 400 });
  }
  if (!b.bestByBatch || typeof b.bestByBatch !== "object") {
    return NextResponse.json({ status: "error", message: "Invalid score payload." }, { status: 400 });
  }

  // Everything numeric here gets re-clamped against the real question bank
  // server-side in scoreFromBestByBatch — the client's own arithmetic is
  // never trusted for what actually gets stored.
  const bestByBatch: Record<string, number> = {};
  for (const [k, v] of Object.entries(b.bestByBatch as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) bestByBatch[k] = v;
  }
  const { weightedScore, totalCorrect } = scoreFromBestByBatch(bestByBatch);

  const cleanName =
    typeof b.name === "string"
      ? b.name.replace(/[^\p{L}\p{N}\s_\-.]/gu, "").trim().slice(0, 24)
      : "";
  const tierKey = typeof b.tierKey === "string" ? b.tierKey.slice(0, 20) : "novice";
  const streak =
    typeof b.streak === "number" && Number.isFinite(b.streak)
      ? Math.max(0, Math.min(9999, Math.round(b.streak)))
      : 0;

  const ok = await submitScore({
    clientId: b.clientId,
    name: cleanName || `Anon-${b.clientId.slice(0, 4)}`,
    weightedScore,
    totalCorrect,
    tierKey,
    streak,
    updatedAt: Date.now(),
  });

  if (!ok) {
    return NextResponse.json({ status: "error", message: "Couldn't save score right now." }, { status: 502 });
  }
  return NextResponse.json({ status: "ok", weightedScore, totalCorrect });
}
