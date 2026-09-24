import { NextRequest, NextResponse } from "next/server";
import {
  getLeaderboardSnapshot,
  FuulNotConfiguredError,
} from "@/lib/fuul";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_LIMIT = 1000;

export async function GET(req: NextRequest) {
  const raw = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Math.min(
    Math.max(Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : MAX_LIMIT, 1),
    MAX_LIMIT
  );

  try {
    const snap = await getLeaderboardSnapshot(limit);
    return NextResponse.json(
      {
        status: "ok",
        rows: snap.rows,
        totalUsers: snap.totalUsers,
        calculatedAt: snap.calculatedAt,
        complete: snap.complete,
      },
      {
        headers: {
          "Cache-Control": snap.complete
            ? "public, s-maxage=300, stale-while-revalidate=600"
            : "public, s-maxage=30",
        },
      }
    );
  } catch (err) {
    if (err instanceof FuulNotConfiguredError) {
      return NextResponse.json({
        status: "not_configured",
        message: "FUUL_API_KEY is not set, so the leaderboard can't be read.",
      });
    }
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
