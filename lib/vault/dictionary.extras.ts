// Additional English-only copy for features added after the six-language
// translation pass (risk score, multi-wallet summary, PWA install). Per the
// fallback rule documented at the top of dictionary.ts, any locale that
// doesn't define these keys just shows the English text below — so this
// file only needs one language to keep every existing page working.

export const enExtras = {
  // ── Reference vaults (lib/vault/data.ts entries with reference: true) ──
  refVaultNote:
    "APY is the Earn page's reported figure ({label}), a snapshot. TVL is read on-chain. Risk metrics are this terminal's estimates, not published by Concrete.",
  refVaultPerm: "Permission required to deposit on app.concrete.xyz.",
  refVaultDeposit: "Deposit via",
  refVaultCurator: "Curator",

  // ── Risk score badge (lib/vault/riskScore.ts) ──
  rsTitle: "Risk Score",
  rsShort: "Risk score",
  rsNote:
    "A weighted read of health factor, yield consistency, liquidity, protocol maturity, strategy diversity and APY volatility — a quick heuristic, not an audit.",
  colRiskScore: "Risk score",

  // ── Multi-wallet portfolio summary (components/MultiWalletSummary.tsx) ──
  mwsTitle: "Combined portfolio",
  mwsSub: "Totals across all {count} wallets below.",
  mwsPoints: "Combined points",
  mwsVaultValue: "Combined vault value",
  mwsWallets: "Wallets",
  mwsNoPoints: "No points data across these wallets.",
  mwsMultiToken: "Held in more than one token — shown separately, not summed.",

  // ── PWA install (components/PwaInstallPrompt.tsx) ──
  pwaInstallTitle: "Install Concrete Guide",
  pwaInstallBody: "Add it to your home screen for one-tap access and offline reading of the docs you've visited.",
  pwaInstallCta: "Install",
  pwaInstallDismiss: "Not now",
  pwaInstalledToast: "Installed. Look for Concrete Guide on your home screen.",

  // ── Personal deposit/withdrawal ledger (components/PositionLedger.tsx) ──
  ledgerOpen: "Your history",
  ledgerClose: "Close",
  ledgerTitle: "Your history — deposits & withdrawals",
  ledgerEmpty: "No entries logged yet — add your deposits and withdrawals below to see realized vs. unrealized gains.",
  ledgerDeposited: "Total deposited",
  ledgerWithdrawn: "Total withdrawn",
  ledgerUnrealized: "Unrealized gain",
  ledgerTotalPnl: "Total PnL",
  ledgerDeposit: "Deposit",
  ledgerWithdrawal: "Withdrawal",
  ledgerDelete: "Delete",
  ledgerAdd: "Add",
  ledgerAmountPh: "Amount",
  ledgerNotePh: "Note (optional)",
  ledgerNote:
    "Logged by you and kept only in this browser — the app can't see your real on-chain deposit/withdrawal history, so this is a manual ledger to compute PnL against your live position.",

  // ── Reviews tab (components/vault/tabs/ReviewsTab.tsx) ──
  tabReviews: "Reviews",
  dashDescReviews: "See what other users say about each vault — upvotes/downvotes plus short reviews.",
  rvTitle: "Community reviews",
  rvNote:
    "Anonymous, one review per person per vault — vote and leave a short note on your real experience. Not verified deposits, just community sentiment.",
  rvNotConfigured: "Review storage isn't configured for this deployment yet.",
  rvNoVotes: "No votes yet",
  rvSwitchVault: "Select this vault above to review it",
  rvYourReview: "Your review",
  rvUpvote: "Good experience",
  rvDownvote: "Bad experience",
  rvNamePh: "Display name (optional)",
  rvCommentPh: "What's your experience been with this vault? (optional, 280 chars)",
  rvSubmit: "Save review",
  rvSubmitting: "Saving…",
  rvSubmitted: "Saved — thanks for sharing.",
  rvErrSubmit: "Couldn't save your review — try again.",
  rvErrLoad: "Couldn't load reviews.",
  rvAllReviews: "All reviews ({n})",
  rvNoReviews: "No reviews yet for this vault — be the first.",

  // ── Developers / public API card (app/page.tsx, app/developers/page.tsx) ──
  dashTitleDevelopers: "Public API",
  dashDescDevelopers: "Every JSON endpoint this app itself calls — documented for third-party builders. No key required.",

  // ── Alert format + Telegram pointer (components/AlertSetup.tsx) ──
  trAlFormat: "Payload format",
  trAlFormatRaw: "Raw JSON",
  trAlFormatDiscord: "Discord webhook",
  trAlTelegram: "Telegram bot",
  trAlTelegramNote: "Prefer a DM over a webhook? Message the bot directly and watch price, APY or $CT thresholds with simple commands — no webhook URL to host.",
  trAlTelegramLink: "Setup & commands →",
} as const;
