import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/help/store";
import { VAULT_BASE } from "@/lib/vault/data";
import {
  deleteReview,
  getReviews,
  reviewsStorageConfigured,
  upsertReview,
  type ReviewVote,
} from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const VALID_VAULT_IDS = new Set(VAULT_BASE.map((v) => v.id));
const MAX_LIMIT = 100;
const MAX_COMMENT_LEN = 280;

function isValidVaultId(id: unknown): id is string {
  return typeof id === "string" && VALID_VAULT_IDS.has(id as any);
}

export async function GET(req: NextRequest) {
  if (!reviewsStorageConfigured()) {
    return NextResponse.json({
      status: "not_configured",
      message: "Review storage isn't set up (KV_REST_API_URL/TOKEN or UPSTASH_REDIS_REST_URL/TOKEN).",
    });
  }

  if (!rateLimit(`reviews:get:${clientKey(req)}`, 60, 60_000)) {
    return NextResponse.json({ status: "error", message: "Too many requests." }, { status: 429 });
  }

  const url = new URL(req.url);
  const vaultId = url.searchParams.get("vaultId");
  if (!isValidVaultId(vaultId)) {
    return NextResponse.json({ status: "error", message: "Unknown vaultId." }, { status: 400 });
  }
  const rawLimit = Number(url.searchParams.get("limit"));
  const limit = Math.min(Math.max(Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 30, 1), MAX_LIMIT);
  const clientId = url.searchParams.get("clientId") ?? undefined;

  try {
    const summary = await getReviews(vaultId, limit, clientId);
    if (summary === null) {
      return NextResponse.json({ status: "error", message: "Couldn't read reviews right now." }, { status: 502 });
    }
    return NextResponse.json(
      { status: "ok", ...summary },
      { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" } }
    );
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function POST(req: NextRequest) {
  if (!reviewsStorageConfigured()) {
    return NextResponse.json({ status: "not_configured" });
  }

  // A real reviewer edits their own review at most a handful of times a
  // sitting — this keeps a script from mass-writing fake reviews.
  if (!rateLimit(`reviews:post:${clientKey(req)}`, 10, 60_000)) {
    return NextResponse.json({ status: "error", message: "Too many submissions — slow down." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid JSON." }, { status: 400 });
  }

  const b = body as {
    vaultId?: unknown;
    clientId?: unknown;
    name?: unknown;
    vote?: unknown;
    comment?: unknown;
  };

  if (!isValidVaultId(b.vaultId)) {
    return NextResponse.json({ status: "error", message: "Unknown vaultId." }, { status: 400 });
  }
  if (typeof b.clientId !== "string" || !/^[a-zA-Z0-9-_]{6,64}$/.test(b.clientId)) {
    return NextResponse.json({ status: "error", message: "Invalid client id." }, { status: 400 });
  }
  if (b.vote !== "up" && b.vote !== "down") {
    return NextResponse.json({ status: "error", message: "Vote must be 'up' or 'down'." }, { status: 400 });
  }

  const cleanName =
    typeof b.name === "string"
      ? b.name.replace(/[^\p{L}\p{N}\s_\-.]/gu, "").trim().slice(0, 24)
      : "";
  const cleanComment =
    typeof b.comment === "string" ? b.comment.trim().slice(0, MAX_COMMENT_LEN) : "";

  const ok = await upsertReview(b.vaultId, {
    clientId: b.clientId,
    name: cleanName || `Anon-${b.clientId.slice(0, 4)}`,
    vote: b.vote as ReviewVote,
    comment: cleanComment,
    updatedAt: Date.now(),
  });

  if (!ok) {
    return NextResponse.json({ status: "error", message: "Couldn't save your review right now." }, { status: 502 });
  }
  return NextResponse.json({ status: "ok" });
}

export async function DELETE(req: NextRequest) {
  if (!reviewsStorageConfigured()) {
    return NextResponse.json({ status: "not_configured" });
  }
  if (!rateLimit(`reviews:del:${clientKey(req)}`, 10, 60_000)) {
    return NextResponse.json({ status: "error", message: "Too many requests." }, { status: 429 });
  }

  const url = new URL(req.url);
  const vaultId = url.searchParams.get("vaultId");
  const clientId = url.searchParams.get("clientId");
  if (!isValidVaultId(vaultId) || typeof clientId !== "string" || !/^[a-zA-Z0-9-_]{6,64}$/.test(clientId)) {
    return NextResponse.json({ status: "error", message: "Invalid request." }, { status: 400 });
  }

  const ok = await deleteReview(vaultId, clientId);
  if (!ok) {
    return NextResponse.json({ status: "error", message: "Couldn't delete right now." }, { status: 502 });
  }
  return NextResponse.json({ status: "ok" });
}
