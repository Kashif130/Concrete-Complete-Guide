import { NextResponse } from "next/server";
import {
  getLeaderboardSnapshot,
  FuulNotConfiguredError,
} from "@/lib/fuul";

export const dynamic = "force-dynamic";
// Reading every user takes many pages; give it room (Vercel plan limits apply).
export const maxDuration = 60;

export async function GET() {
  try {
    const snap = await getLeaderboardSnapshot(null);
    return NextResponse.json(
      {
        status: "ok",
        totalPoints: snap.totalPoints,
        usersRead: snap.usersRead,
        totalUsers: snap.totalUsers,
        calculatedAt: snap.calculatedAt,
        complete: snap.complete,
      },
      {
        headers: {
          "Cache-Control": snap.complete
            ? "public, s-maxage=900, stale-while-revalidate=1800"
            : "public, s-maxage=30",
        },
      }
    );
  } catch (err) {
    if (err instanceof FuulNotConfiguredError) {
      return NextResponse.json({
        status: "not_configured",
        message: "FUUL_API_KEY is not set, so community points can't be read.",
      });
    }
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
