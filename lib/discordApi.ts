// Thin wrapper around Discord's HTTP APIs — mirrors lib/telegram.ts's role
// for the Telegram bot. Two Discord surfaces are used:
//  - Interactions (slash commands + button clicks): Discord POSTs to a
//    webhook URL you configure in the Developer Portal; every request must
//    be Ed25519-verified with your app's public key, or Discord rejects
//    your endpoint outright.
//  - The regular Bot REST API (needs DISCORD_BOT_TOKEN): used for anything
//    outside the 15-minute interaction-response window, e.g. the alert cron
//    DMing someone hours after they set a watch.
import { createPublicKey, verify as nodeVerify } from "node:crypto";

function botToken(): string | null {
  const t = process.env.DISCORD_BOT_TOKEN;
  return t && t.trim() ? t.trim() : null;
}

function publicKeyHex(): string | null {
  const k = process.env.DISCORD_PUBLIC_KEY;
  return k && k.trim() ? k.trim() : null;
}

export function discordConfigured(): boolean {
  return botToken() !== null;
}

export function discordInteractionsConfigured(): boolean {
  return publicKeyHex() !== null;
}

// Ed25519 SubjectPublicKeyInfo DER prefix — fixed for every Ed25519 key,
// only the 32 raw key bytes that follow ever change. Wrapping a raw key in
// this lets Node's crypto module import Discord's raw hex public key
// without needing a third-party ed25519 library.
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

/** Verifies the X-Signature-Ed25519 / X-Signature-Timestamp pair Discord sends on every interaction request. `rawBody` MUST be the exact, unparsed request body text. */
export function verifyDiscordRequest(rawBody: string, signature: string | null, timestamp: string | null): boolean {
  const publicKey = publicKeyHex();
  if (!publicKey || !signature || !timestamp) return false;
  try {
    const key = createPublicKey({
      key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(publicKey, "hex")]),
      format: "der",
      type: "spki",
    });
    return nodeVerify(null, Buffer.from(timestamp + rawBody), key, Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

const API_BASE = "https://discord.com/api/v10";

async function botFetch(path: string, init: RequestInit = {}): Promise<Response | null> {
  const t = botToken();
  if (!t) return null;
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { Authorization: `Bot ${t}`, "content-type": "application/json", ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return null;
  }
}

/** DMs a Discord user by id — opens (or reuses) a DM channel, then posts. Used by the alert cron, which runs outside any interaction's 15-minute reply window. */
export async function sendDiscordDM(userId: string, content: string): Promise<boolean> {
  const dm = await botFetch("/users/@me/channels", {
    method: "POST",
    body: JSON.stringify({ recipient_id: userId }),
  });
  if (!dm || !dm.ok) return false;
  const channel = await dm.json();
  const res = await botFetch(`/channels/${channel.id}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return res?.ok ?? false;
}

// --- Interaction responses ---------------------------------------------
// Interaction response TYPE codes (Discord's own numbering):
export const INTERACTION_PONG = 1;
export const INTERACTION_CHANNEL_MESSAGE = 4;
export const INTERACTION_DEFERRED_CHANNEL_MESSAGE = 5;
export const INTERACTION_UPDATE_MESSAGE = 7;
export const INTERACTION_DEFERRED_UPDATE_MESSAGE = 6;

export type ButtonRow = { customId: string; label: string }[];

export function actionRow(buttons: ButtonRow) {
  return [
    {
      type: 1, // action row
      components: buttons.map((b) => ({
        type: 2, // button
        style: 1, // primary
        label: b.label,
        custom_id: b.customId,
      })),
    },
  ];
}

/** Sends an extra message tied to an already-answered interaction (used when a reply needs more than one message, e.g. a long doc page). Works up to 15 minutes after the original interaction. */
export async function sendInteractionFollowup(
  applicationId: string,
  interactionToken: string,
  content: string,
  components?: unknown[]
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/webhooks/${applicationId}/${interactionToken}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content, components }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Keeps a serverless function alive after its HTTP response is sent (Vercel's waitUntil), without needing the @vercel/functions package. Falls back to a plain fire-and-forget promise elsewhere (e.g. local dev). */
export function runInBackground(work: Promise<unknown>): void {
  const ctx = (globalThis as any)[Symbol.for("@vercel/request-context")]?.get?.();
  const safe = work.catch(() => {});
  if (ctx?.waitUntil) ctx.waitUntil(safe);
}
