// Single source of truth for the app's own public URL, used in share text,
// share-card footers, QR codes, and public profile links. Override with
// NEXT_PUBLIC_SITE_URL in your environment if you deploy elsewhere.
// Ported from the community Concrete Tracker into the Guide app, which now
// hosts the wallet ledger under /tracker instead of at its own root.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://concrete-guide.vercel.app";

export const SITE_TAGLINE = "🗿 Concrete Guide — Wallet Tracker (unofficial)";

export function walletProfileUrl(wallet: string): string {
  return `${SITE_URL}/tracker/w/${wallet}`;
}
