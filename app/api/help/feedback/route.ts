import { locales } from "@/lib/i18n";
import { clientKey, feedbackToEvent, rateLimit, recordEvent } from "@/lib/help/store";

// Anonymous 👍/👎 and "nothing found" reports from the Help Center widget.
// No name, no IP, no user id is stored; free text is redacted (addresses, emails, URLs, long numbers)
// and only kept for 👎 and unanswered questions. See lib/help/store.ts.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const H = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))) {
        return new Response(JSON.stringify({ ok: false }), { status: 403, headers: H });
      }
    } catch {
      return new Response(JSON.stringify({ ok: false }), { status: 403, headers: H });
    }
  }
  if (!rateLimit(`fb:${clientKey(req)}`, 20, 60_000)) {
    return new Response(JSON.stringify({ ok: false }), { status: 429, headers: H });
  }
  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 4000) return new Response(JSON.stringify({ ok: false }), { status: 413, headers: H });
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers: H });
  }
  const ev = feedbackToEvent(body, locales);
  if (!ev) return new Response(JSON.stringify({ ok: false }), { status: 400, headers: H });
  await recordEvent(ev);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: H });
}
