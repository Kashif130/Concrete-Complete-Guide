import { createHash, timingSafeEqual } from "node:crypto";
import { readReport, storageConfigured } from "@/lib/help/store";

// Aggregated Help Center insights for the site owner: what people ask, what got 👎, and — most
// useful — the questions the guide could NOT answer (i.e. what's missing from the docs).
//
//   curl -H "Authorization: Bearer $HELP_ADMIN_KEY" "https://<site>/api/help/report?days=14"
//
// Disabled (404) unless HELP_ADMIN_KEY is set. Needs Redis storage (see .env.example).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const H = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const sha = (s: string) => createHash("sha256").update(s).digest();

export async function GET(req: Request): Promise<Response> {
  const adminKey = process.env.HELP_ADMIN_KEY;
  if (!adminKey) return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: H });

  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!timingSafeEqual(sha(given), sha(adminKey))) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: H });
  }
  if (!storageConfigured()) {
    return new Response(
      JSON.stringify({ error: "no_storage", hint: "Set UPSTASH_REDIS_REST_URL/TOKEN. Until then events are only in the server logs (search for help_event)." }),
      { status: 501, headers: H },
    );
  }
  const days = Number(new URL(req.url).searchParams.get("days") ?? 14);
  const report = await readReport(Number.isFinite(days) ? days : 14);
  if (!report) return new Response(JSON.stringify({ error: "storage_unreachable" }), { status: 502, headers: H });
  return new Response(JSON.stringify(report), { status: 200, headers: H });
}
