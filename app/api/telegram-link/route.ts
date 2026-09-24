import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { isChainKey } from "@/lib/chains";
import { VAULT_BASE } from "@/lib/vault/data";
import {
  createPendingLink,
  telegramStorageConfigured,
  type Direction,
  type PendingAlert,
  type SubKind,
} from "@/lib/telegramStore";

// Website side of the linking flow (see the comment in lib/telegramStore.ts
// for why this can't just take a Telegram username). The frontend calls this
// with the alert the user configured in the UI; it stages the alert under a
// short-lived code and hands back a `t.me/<bot>?start=<code>` link. Tapping
// that link opens Telegram and auto-sends "/start <code>" to the bot, which
// is handled in app/api/telegram-webhook/route.ts.

export const dynamic = "force-dynamic";

const VAULT_IDS = VAULT_BASE.map((v) => v.id);

function generateCode(): string {
  return Math.random().toString(36).slice(2, 10);
}

function parseDirection(s: unknown): Direction | null {
  return s === "above" || s === "below" ? s : null;
}

export async function POST(req: NextRequest) {
  if (!telegramStorageConfigured()) {
    return NextResponse.json({ error: "Telegram alerts aren't configured on this deployment." }, { status: 503 });
  }
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return NextResponse.json({ error: "TELEGRAM_BOT_USERNAME is not set." }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const kind = body?.kind as SubKind;
  const direction = parseDirection(body?.direction);
  const threshold = Number(body?.threshold);

  if (!direction || !Number.isFinite(threshold)) {
    return NextResponse.json({ error: "direction (above|below) and a numeric threshold are required." }, { status: 400 });
  }

  let alert: PendingAlert;

  if (kind === "price") {
    const chain = body?.chain;
    const vaultAddress = body?.vaultAddress;
    if (!chain || !isChainKey(chain) || !vaultAddress || !isAddress(vaultAddress)) {
      return NextResponse.json({ error: "chain and a valid vaultAddress are required for kind=price." }, { status: 400 });
    }
    alert = {
      kind,
      direction,
      threshold,
      chain,
      vaultAddress,
      label: `${vaultAddress.slice(0, 8)}… share price (${chain})`,
    };
  } else if (kind === "apy") {
    const vaultId = body?.vaultId;
    if (!vaultId || !VAULT_IDS.includes(vaultId)) {
      return NextResponse.json({ error: `vaultId must be one of: ${VAULT_IDS.join(", ")}` }, { status: 400 });
    }
    const vaultName = VAULT_BASE.find((v) => v.id === vaultId)?.name ?? vaultId;
    alert = { kind, direction, threshold, vaultId, label: `${vaultName} APY` };
  } else if (kind === "ct") {
    alert = { kind, direction, threshold, label: "$CT price" };
  } else {
    return NextResponse.json({ error: "kind must be price, apy, or ct." }, { status: 400 });
  }

  const code = generateCode();
  const ok = await createPendingLink(code, alert);
  if (!ok) {
    return NextResponse.json({ error: "Couldn't create link right now — try again." }, { status: 500 });
  }

  return NextResponse.json({
    deepLink: `https://t.me/${botUsername}?start=${code}`,
    expiresInSeconds: 600,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST { kind, direction, threshold, ...kind-specific fields } to get a Telegram deep link.",
  });
}
