import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Same "stateless, no DB" pattern as /api/alert-check — see that file for the
// rationale. There's no API for "$CT has launched", so instead this endpoint
// fetches the Concrete Foundation's own $CT page server-side (avoids CORS),
// pulls out a normalized snapshot of the text that matters (page title, main
// heading, and the visible button/link labels — NOT the whole HTML, so
// unrelated markup/script changes don't cause false positives), and hashes
// it. The caller (browser or an external cron) supplies the hash it saw last
// time via `knownHash`; if today's hash differs, something in that key text
// changed — e.g. "CT Token is Coming" turning into a live claim/trading
// announcement — and `changed: true` is returned (and the webhook, if given,
// is pinged). The very first check has nothing to compare against, so
// `knownHash` omitted just returns today's baseline hash with changed: false.
const FOUNDATION_URL = "https://concretefoundation.xyz";

function normalize(html: string): string {
  // Strip tags/scripts/styles, collapse whitespace, keep it to visible text.
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const text = noScripts
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function hashOf(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const knownHash = searchParams.get("knownHash");
  const webhook = searchParams.get("webhook");

  try {
    const res = await fetch(FOUNDATION_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Concrete-Guide-CT-Watcher/1.0" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `concretefoundation.xyz returned ${res.status}.` },
        { status: 502 }
      );
    }
    const html = await res.text();
    const text = normalize(html);
    // Keep the snapshot short — just enough for a human to sanity-check what
    // was hashed, never the full page.
    const snapshot = text.slice(0, 400);
    const hash = hashOf(text);
    const changed = knownHash != null && knownHash !== hash;

    let webhookResult: "sent" | "skipped" | "failed" = "skipped";
    if (changed && webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: FOUNDATION_URL,
            changed: true,
            snapshot,
            checkedAt: new Date().toISOString(),
          }),
        });
        webhookResult = "sent";
      } catch {
        webhookResult = "failed";
      }
    }

    return NextResponse.json({
      hash,
      changed,
      snapshot,
      webhook: webhook ? webhookResult : "not_configured",
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Couldn't read concretefoundation.xyz.",
      },
      { status: 500 }
    );
  }
}
