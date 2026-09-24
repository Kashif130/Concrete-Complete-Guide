import { NextRequest, NextResponse } from "next/server";
import { isAddress, getAddress } from "viem";
import { isChainKey } from "@/lib/chains";
import { readVaultSharePrice } from "@/lib/vaultSharePrice";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// IMPORTANT — read this before wiring up alerts:
// This app is a stateless Vercel deployment with no database, so it can't
// run its own background cron or remember "already fired" state between
// checks. This endpoint instead does ONE stateless thing well: given a
// vault + threshold + direction, it reads the CURRENT share price and, if
// the threshold is currently crossed, POSTs a small JSON payload to the
// webhook URL you provide. Point a free external cron (e.g. cron-job.org,
// EasyCron, or a GitHub Actions scheduled workflow) at this URL on
// whatever interval you want checked. Because there's no persistence, it
// will re-fire on every check for as long as the condition stays true —
// have your webhook receiver (Slack, Discord, Zapier, etc.) de-duplicate
// if you only want a one-time ping.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chainParam = searchParams.get("chain") ?? "ethereum";
  const vaultParam = searchParams.get("vault");
  const direction = searchParams.get("direction") ?? "above"; // "above" | "below"
  const thresholdParam = searchParams.get("threshold");
  const webhook = searchParams.get("webhook");
  // "raw" (default, existing behaviour) posts the full JSON payload as-is.
  // "discord" wraps it as { content: "..." } so a Discord channel webhook
  // (Server Settings → Integrations → Webhooks — no bot/code needed on
  // Discord's side) renders it as a normal chat message.
  const format = searchParams.get("format") === "discord" ? "discord" : "raw";

  if (!vaultParam || !isAddress(vaultParam)) {
    return NextResponse.json(
      { error: "A valid `vault` address query param is required." },
      { status: 400 }
    );
  }
  if (!isChainKey(chainParam)) {
    return NextResponse.json(
      { error: `Unsupported chain "${chainParam}".` },
      { status: 400 }
    );
  }
  const threshold = Number(thresholdParam);
  if (!thresholdParam || Number.isNaN(threshold)) {
    return NextResponse.json(
      { error: "A numeric `threshold` query param is required." },
      { status: 400 }
    );
  }
  if (direction !== "above" && direction !== "below") {
    return NextResponse.json(
      { error: '`direction` must be "above" or "below".' },
      { status: 400 }
    );
  }

  const vault = getAddress(vaultParam);

  try {
    const sharePrice = await readVaultSharePrice(chainParam, vault);

    if (sharePrice === null) {
      return NextResponse.json(
        { error: "Couldn't compute a share price for this vault." },
        { status: 422 }
      );
    }

    const crossed =
      direction === "above" ? sharePrice >= threshold : sharePrice <= threshold;

    let webhookResult: "sent" | "skipped" | "failed" = "skipped";
    if (crossed && webhook) {
      try {
        const rawPayload = {
          vault,
          chain: chainParam,
          sharePrice,
          threshold,
          direction,
          crossed,
          checkedAt: new Date().toISOString(),
        };
        const body =
          format === "discord"
            ? {
                content: `⚠️ **Concrete Guide alert** — vault \`${vault.slice(0, 10)}…\` share price is now ${sharePrice.toFixed(
                  6
                )} (${direction} ${threshold} on ${chainParam}).`,
              }
            : rawPayload;
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        webhookResult = "sent";
      } catch {
        webhookResult = "failed";
      }
    }

    return NextResponse.json({
      vault,
      chain: chainParam,
      sharePrice,
      threshold,
      direction,
      crossed,
      webhook: webhook ? webhookResult : "not_configured",
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't read this vault's share price.",
      },
      { status: 500 }
    );
  }
}
