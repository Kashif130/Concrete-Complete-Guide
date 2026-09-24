// Question bank for the /tracker/quiz feature — "Moai Tier" edition.
// Batches now map 1:1 onto a numbered "Level" that mirrors the doc
// sections (Beginner -> Intermediate -> Advanced -> Ecosystem ->
// Institutional -> Moai Master), so a quiz always reinforces something
// explained elsewhere in the Guide, and climbing levels roughly tracks
// climbing the doc's own difficulty curve. English only for now — the
// quiz UI falls back to English the same way every other new feature in
// this app does until it's translated.

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizBatch = {
  id: string;
  /** 1-indexed difficulty rung, shown as "Level N" in the UI. */
  level: number;
  title: string;
  tagline: string;
  /** Cosmetic only — signals "this is the deeper / harder content", not a paywall. */
  premium: boolean;
  docHref?: string;
  questions: QuizQuestion[];
};

export const QUIZ_BATCHES: QuizBatch[] = [
  {
    id: "beginner",
    level: 1,
    title: "Level 1 · Beginner: Concrete Basics",
    tagline: "What Concrete is, vault shares, ERC-4626, and how deposits work.",
    premium: false,
    docHref: "/docs/01-beginner/01-what-is-concrete",
    questions: [
      {
        id: "b1",
        prompt: "What is Concrete, at its core?",
        options: [
          "A centralized exchange for trading crypto",
          "A DeFi platform that pools deposits into managed on-chain vaults",
          "A Layer 1 blockchain",
          "A stablecoin issuer",
        ],
        correctIndex: 1,
        explanation: "Concrete pools user deposits into vaults that run defined strategies on-chain.",
      },
      {
        id: "b2",
        prompt: "When you deposit into a Concrete vault, what do you receive?",
        options: [
          "A vault share (ct-token) representing your claim on the vault",
          "A locked NFT",
          "Nothing until you withdraw",
          "A fixed-rate bond",
        ],
        correctIndex: 0,
        explanation: "Deposits mint vault shares (ct-tokens) whose value tracks the vault's performance.",
      },
      {
        id: "b3",
        prompt: "Does depositing into a Concrete vault carry a deposit fee?",
        options: [
          "Yes, always 2%",
          "No — deposit and withdrawal fees are listed as none in the Fees guide",
          "Only for whales",
          "Only on Ethereum mainnet",
        ],
        correctIndex: 1,
        explanation: "Per the Fees guide, deposit and withdrawal fees are shown as none; management/performance fees are protocol-level.",
      },
      {
        id: "b4",
        prompt: "What does a vault's share price represent?",
        options: [
          "The gas price on that chain",
          "How much one vault share is worth in the underlying asset",
          "The vault's total TVL",
          "A random number for marketing",
        ],
        correctIndex: 1,
        explanation: "Share price rises as the vault's strategy earns yield, letting shares be redeemed for more of the underlying asset.",
      },
      {
        id: "b5",
        prompt: "Which Ethereum token standard do Concrete vaults follow?",
        options: ["ERC-4626 (tokenized yield vaults)", "ERC-721", "ERC-1155", "ERC-777"],
        correctIndex: 0,
        explanation: "ERC-4626 is the standard interface for tokenized yield vaults, letting wallets and other protocols integrate any Concrete vault without custom code.",
      },
      {
        id: "b6",
        prompt: "At the time the Guide was written, how long was the WBTC vault's withdrawal queue?",
        options: ["Instant", "7 days", "21 days", "90 days"],
        correctIndex: 2,
        explanation: "The Getting Started doc notes the WBTC vault card showed a 21-day withdrawal queue at snapshot time.",
      },
      {
        id: "b7",
        prompt: "What will no legitimate Concrete page or tool ever ask you for?",
        options: ["Your favorite color", "Your seed phrase or private key", "Your email address", "Your username"],
        correctIndex: 1,
        explanation: "The DeFi primer is explicit: no legitimate Concrete page or tool ever asks for a seed phrase.",
      },
      {
        id: "b8",
        prompt: "Roughly what APY does 8% APR compounded daily work out to?",
        options: ["8.33% APY", "8.00% APY flat", "16% APY", "4% APY"],
        correctIndex: 0,
        explanation: "The docs' worked example: 8% APR compounded daily ≈ 8.33% APY (APY = (1+APR/n)^n − 1).",
      },
    ],
  },
  {
    id: "intermediate",
    level: 2,
    title: "Level 2 · Intermediate: Vaults & Points",
    tagline: "Vault catalog, withdrawals, roles, and how the points system works.",
    premium: false,
    docHref: "/docs/02-intermediate/01-vault-catalog",
    questions: [
      {
        id: "i1",
        prompt: "Where does this app read a wallet's real Concrete points from?",
        options: [
          "It invents a number locally",
          "Fuul, via points.concrete.xyz's data",
          "A CSV the user uploads",
          "It can't — points aren't trackable",
        ],
        correctIndex: 1,
        explanation: "PointsPanel and the leaderboard read live totals through the Fuul API (see app/api/points).",
      },
      {
        id: "i2",
        prompt: "What does the Vault Terminal's health factor roughly indicate?",
        options: [
          "How many people follow the project on social media",
          "A vault's safety margin / risk buffer",
          "The exact APY for next month",
          "Gas price on that chain",
        ],
        correctIndex: 1,
        explanation: "The Health Radar tab visualizes each vault's health-factor zone as a risk-buffer indicator.",
      },
      {
        id: "i3",
        prompt: "Are Concrete withdrawals always instant?",
        options: [
          "Yes, always instant",
          "It depends on the vault — some use async withdrawal queues",
          "Withdrawals are disabled",
          "Only instant on weekends",
        ],
        correctIndex: 1,
        explanation: "The Withdrawals and Async Withdrawals Deep Dive docs cover queued, non-instant redemption for some vaults.",
      },
      {
        id: "i4",
        prompt: "In the Rebalancer tool, what do you get back?",
        options: [
          "A suggested allocation across the four vaults based on your holdings",
          "A guaranteed future price",
          "A tax report",
          "A new wallet address",
        ],
        correctIndex: 0,
        explanation: "Enter holdings and the Rebalancer scores strategies to suggest an allocation — no guarantees, just maths.",
      },
      {
        id: "i5",
        prompt: "Which role automatically moves capital between strategies inside a vault?",
        options: ["The Allocator", "The Depositor", "The Vault Admin", "The Factory Owner"],
        correctIndex: 0,
        explanation: "The Allocator is an automated, high-frequency role that routes capital between strategies; Withdrawal Manager advances epochs.",
      },
      {
        id: "i6",
        prompt: "What is the standard management fee on most Concrete vaults?",
        options: ["1.5% / year of AUM", "10% / year of AUM", "0.1% / year", "A one-time 5% charge"],
        correctIndex: 0,
        explanation: "The fee menu lists management fees at 0-10%/yr of AUM, with a standard rate of 1.5% on most vaults.",
      },
      {
        id: "i7",
        prompt: "Which naming convention marks an AssetCX qualified-custody vault in the app?",
        options: ["An `asset` + `cx` suffix, e.g. `WBTCcx`", "An `asset-v2` suffix", "An `.institutional` suffix", "A red exclamation icon only"],
        correctIndex: 0,
        explanation: "AssetCX vaults use `<asset>cx` naming and show as Permission Required in the Earn app.",
      },
      {
        id: "i8",
        prompt: "In a queued withdrawal, when is the share price for your redemption actually locked in?",
        options: [
          "At processing time, not at request time",
          "At the moment you submit the request",
          "Whenever you feel like claiming",
          "It never locks — it floats forever",
        ],
        correctIndex: 0,
        explanation: "Shares are burned and assets reserved once the epoch is processed; the price used is the one at processing time, which can move from the request price.",
      },
    ],
  },
  {
    id: "advanced",
    level: 3,
    title: "Level 3 · Advanced: Architecture & Accounting",
    tagline: "Subgraph events, yield math, and how the numbers are actually derived.",
    premium: true,
    docHref: "/docs/03-advanced/01-architecture-deep-dive",
    questions: [
      {
        id: "a1",
        prompt: "What does the app's home-page TVL figure use as its live source?",
        options: [
          "A number typed once and never updated",
          "DefiLlama's public TVL API, fetched client-side every 60s",
          "A press release",
          "The vault's Twitter bio",
        ],
        correctIndex: 1,
        explanation: "The README documents the TVL figure as fetched client-side from api.llama.fi with cache: no-store, refreshed every 60 seconds.",
      },
      {
        id: "a2",
        prompt: "The Gas & Fees tab's live gas price comes from where?",
        options: [
          "A fixed constant that never changes",
          "A server-side eth_gasPrice RPC call, cached ~30s, with a labeled simulated fallback",
          "The user's own MetaMask popup",
          "It's guessed from the vault APY",
        ],
        correctIndex: 1,
        explanation: "app/api/gas/route.ts calls eth_gasPrice server-side and falls back to a clearly labeled simulated value if RPCs fail.",
      },
      {
        id: "a3",
        prompt: "How does the $CT Launch Watcher detect a real change on concretefoundation.xyz?",
        options: [
          "It asks an AI to guess",
          "It hashes the page's visible text server-side and compares to the last-seen hash",
          "It checks Etherscan gas fees",
          "It polls Twitter",
        ],
        correctIndex: 1,
        explanation: "app/api/ct-check hashes stripped page text; a differing hash vs. the stored knownHash is treated as a real content change.",
      },
      {
        id: "a4",
        prompt: "Where do the Rebalancer's typed-in holdings get stored between tab switches?",
        options: [
          "localStorage, so they survive a page reload",
          "In-memory only (useTabState), deliberately not localStorage since they're financial inputs",
          "A remote database",
          "Cookies",
        ],
        correctIndex: 1,
        explanation: "lib/vault/useTabState.ts keeps typed figures in memory only, on purpose, because they're financial inputs.",
      },
      {
        id: "a5",
        prompt: "In Concrete's architecture, what deploys new vaults as ERC-1967 proxies?",
        options: ["The Factory, using CREATE2", "The Allocator", "A DAO vote", "Etherscan"],
        correctIndex: 0,
        explanation: "The Factory is UUPS-upgradeable and CREATE2-deploys vaults as ERC-1967 proxies from approved implementations.",
      },
      {
        id: "a6",
        prompt: "What is the purpose of the \"+1\" virtual shares/assets term in the share-conversion formula?",
        options: [
          "To defend against donation / inflation attacks",
          "To round every deposit up in the user's favor",
          "To charge a hidden extra fee",
          "To cover gas costs",
        ],
        correctIndex: 0,
        explanation: "The +1 in numerator and denominator is one of the documented defenses against classic ERC-4626 donation/inflation attacks.",
      },
      {
        id: "a7",
        prompt: "What happens if an operator misses the accountingValidityPeriod window for a custodied strategy?",
        options: [
          "The strategy's value function reverts and the vault halts deposits/withdrawals until fixed",
          "Nothing — the old price is used forever",
          "The vault auto-liquidates all positions",
          "The vault silently mints extra shares",
        ],
        correctIndex: 0,
        explanation: "A late accounting push causes the strategy's value function to revert, halting deposits, withdrawals and epoch processing until an admin intervenes.",
      },
      {
        id: "a8",
        prompt: "Per the architecture docs, who is allowed to call `distributeFees(vault)` to flush accrued fees?",
        options: ["Anyone", "Only the factory owner", "Only the curator", "Only Concrete's core team"],
        correctIndex: 0,
        explanation: "distributeFees(vault) is permissionless — anyone can call it to flush accrued fees to the fee splitter.",
      },
    ],
  },
  {
    id: "ecosystem",
    level: 4,
    title: "Level 4 · Ecosystem: Tools, Risks & $CT",
    tagline: "The tools catalog, risk factors, and verifying the real $CT token.",
    premium: true,
    docHref: "/docs/04-ecosystem/01-tools-catalog",
    questions: [
      {
        id: "e1",
        prompt: "Has Concrete Foundation published a real, on-chain-verifiable $CT contract address?",
        options: [
          "No, $CT doesn't exist yet",
          "Yes — the $CT Token card links the verified Etherscan contract, audits, and whitepaper",
          "Only on testnet",
          "It's a rumor with no source",
        ],
        correctIndex: 1,
        explanation: "CtTokenCard.tsx links the verified Etherscan contract, two Halborn audits, and the MiCAR white paper.",
      },
      {
        id: "e2",
        prompt: "What's the single biggest red flag the app warns about regarding $CT?",
        options: [
          "High gas fees",
          "Any source asking you to connect your wallet to \"claim\" $CT",
          "Slow page load times",
          "Using the wrong browser",
        ],
        correctIndex: 1,
        explanation: "The verification card carries an explicit warning: no legitimate source asks you to connect a wallet to claim $CT.",
      },
      {
        id: "e3",
        prompt: "Why does the Airdrop Estimator explicitly call its output a \"what-if\"?",
        options: [
          "Because the 1B token supply is unconfirmed",
          "Because no TGE/allocation formula has been announced — only the 1B supply is confirmed",
          "Because it's a joke feature",
          "Because points don't matter at all",
        ],
        correctIndex: 1,
        explanation: "The estimator models a hypothetical allocation from your points; the total supply is confirmed but the rest is speculative.",
      },
      {
        id: "e4",
        prompt: "Roughly what should you treat any DeFi vault's advertised APY as?",
        options: [
          "A guaranteed fixed return",
          "A variable, historical figure that can change with market conditions and strategy performance",
          "A legal contract",
          "Irrelevant — only TVL matters",
        ],
        correctIndex: 1,
        explanation: "Covered in the Risks guide: vault APY is variable and strategy-dependent, never a guaranteed fixed return.",
      },
      {
        id: "e5",
        prompt: "Fittingly for this quiz's 🗿 theme, what's the name of the community Builder Suite's browser arcade game?",
        options: ["Moai Saves: DeFi Rescue", "Vault Runner", "Concrete Crush", "Stone Age Yield"],
        correctIndex: 0,
        explanation: "The Builder Suite's tools catalog entry lists \"Moai Saves: DeFi Rescue\" — catch depositors, block liquidators, climb the Hall of Stone leaderboard.",
      },
      {
        id: "e6",
        prompt: "Which firm provides 24/7 threat monitoring of Concrete's vault addresses?",
        options: ["Hypernative", "Chainalysis", "The Graph", "Enso"],
        correctIndex: 0,
        explanation: "Hypernative is named as the 24/7 monitoring layer in the Security & Audits doc's oversight section.",
      },
      {
        id: "e7",
        prompt: "Which company holds a pre-delegated mandate to pause Concrete vaults if needed?",
        options: ["ZeroShadow", "Halborn", "LayerZero", "DefiLlama"],
        correctIndex: 0,
        explanation: "ZeroShadow is described as holding pre-delegated authority to pause vaults per its mandate.",
      },
      {
        id: "e8",
        prompt: "Which protocol handles the cross-chain messaging for pre-deposit vault claims?",
        options: ["LayerZero", "The Graph", "1inch", "Chainalysis"],
        correctIndex: 0,
        explanation: "Pre-deposit vaults bridge assets and let users claim shares on the destination chain via LayerZero messaging.",
      },
    ],
  },
  {
    id: "institutional",
    level: 5,
    title: "Level 5 · Institutional: AssetCX, Enterprise & Security",
    tagline: "Qualified custody, enterprise vault operations, audits, and campaign mechanics.",
    premium: true,
    docHref: "/docs/02-intermediate/03-institutional-assetcx-enterprise",
    questions: [
      {
        id: "n1",
        prompt: "In AssetCX, where do a client's underlying assets physically stay?",
        options: [
          "Inside their own qualified-custody account the whole time",
          "Moved into a Concrete-controlled hot wallet",
          "Bridged over to Solana",
          "Held directly by the factory owner",
        ],
        correctIndex: 0,
        explanation: "AssetCX mints a 1:1 on-chain representation while the underlying never leaves the client's qualified-custody environment.",
      },
      {
        id: "n2",
        prompt: "What update cadence does Concrete's Enterprise platform use for NAV and yield accounting?",
        options: ["Daily", "Real-time, every block", "Weekly", "Monthly"],
        correctIndex: 0,
        explanation: "Enterprise runs a three-party automation cycle updating exchange rates and yield accounting daily.",
      },
      {
        id: "n3",
        prompt: "Which of these is NOT one of Concrete's three described security layers?",
        options: [
          "An insurance fund that guarantees deposits",
          "Vault infrastructure (audits, role separation, controlled upgrades)",
          "Strategy layer (risk review, whitelisting, granular pausing)",
          "Oversight & verification (monitoring, pause authority, valuation checks)",
        ],
        correctIndex: 0,
        explanation: "The docs describe three layers — infrastructure, strategy, oversight — and explicitly note there is no separate insurance layer.",
      },
      {
        id: "n4",
        prompt: "Looking at the audit timeline, which firm has audited by far the most Concrete releases?",
        options: ["Halborn", "Cantina", "Zellic", "Code4rena"],
        correctIndex: 0,
        explanation: "Halborn appears repeatedly across the audit timeline, from Earn V1 through the AssetCX OFT Adapter audit in Aug 2026.",
      },
      {
        id: "n5",
        prompt: "On a pre-deposit (cross-chain) vault, how do users claim their shares on the destination chain?",
        options: [
          "Via LayerZero messaging, using the same wallet address",
          "By emailing Concrete support",
          "Automatically, with no user action",
          "Through a Discord bot command",
        ],
        correctIndex: 0,
        explanation: "Users deposit on a source chain, the vault locks and bridges, then shares are claimed on the target chain via LayerZero, from the same address.",
      },
      {
        id: "n6",
        prompt: "What happens to a Concrete campaign vault once its end date is reached?",
        options: [
          "It enters a controlled wind-down and becomes withdraw-only",
          "All deposits are deleted",
          "Its APY automatically doubles",
          "It becomes permanently locked with no exit",
        ],
        correctIndex: 0,
        explanation: "The campaign lifecycle runs: live → end date → controlled wind-down → withdraw-only.",
      },
      {
        id: "n7",
        prompt: "How do institutional / permissioned vaults appear in the Earn app?",
        options: [
          "Labeled \"Permission Required\"",
          "Hidden from the app entirely",
          "Marked \"Beta\" only",
          "Shown with no distinguishing label",
        ],
        correctIndex: 0,
        explanation: "Institutional and AssetCX vaults show as Permission Required / Permissioned in the Earn app's vault cards.",
      },
      {
        id: "n8",
        prompt: "Which of these is explicitly listed as a trust assumption depositors still accept, even with audits and monitoring?",
        options: [
          "Operators pushing correct valuations for custodied strategies",
          "Concrete guaranteeing a fixed return",
          "The vault being fully insured against loss",
          "Etherscan verifying every trade in real time",
        ],
        correctIndex: 0,
        explanation: "The Security doc lists operator valuation accuracy, custody providers, partner protocols and governance roles as trust assumptions that remain despite audits.",
      },
    ],
  },
  {
    id: "moai-master",
    level: 6,
    title: "Level 6 · Moai Master 🗿: Company, Glow & concUSD",
    tagline: "The deepest cuts — Blueprint Finance's history, its Solana sibling, and concUSD.",
    premium: true,
    docHref: "/docs/04-ecosystem/03-company-and-glow-finance",
    questions: [
      {
        id: "m1",
        prompt: "Blueprint Finance is the parent company behind Concrete — what's its separate, Solana-based sibling product?",
        options: ["Glow Finance", "Concrete Solana", "Blueprint DeFi", "SolConcrete"],
        correctIndex: 0,
        explanation: "Blueprint Finance runs Concrete on Ethereum/EVM chains and a separate product, Glow Finance, on Solana.",
      },
      {
        id: "m2",
        prompt: "What was Blueprint Finance CEO Nic Roberts-Huntley's profession before moving into finance?",
        options: ["Surgeon", "Lawyer", "Software engineer", "Accountant"],
        correctIndex: 0,
        explanation: "He trained and practiced as a surgeon before pivoting to finance via an MBA and a Master's at Oxford.",
      },
      {
        id: "m3",
        prompt: "Which firm led Blueprint Finance's June 2025 $9.5M strategic funding round?",
        options: ["Polychain Capital", "a16z", "Paradigm", "Sequoia Capital"],
        correctIndex: 0,
        explanation: "Polychain Capital led the June 2025 round, with Yzi Labs, VanEck, BitGo and others participating.",
      },
      {
        id: "m4",
        prompt: "In plain terms, what is concUSD?",
        options: [
          "A reward-bearing dollar token acting as an internal liquidity layer across Concrete's vaults",
          "A brand-new Layer 1 blockchain",
          "Concrete's governance/voting token",
          "A stablecoin pegged to gold",
        ],
        correctIndex: 0,
        explanation: "concUSD sits underneath the vaults as internal plumbing for deposits, withdrawals and inter-vault lending — not a product picked off a vault list.",
      },
      {
        id: "m5",
        prompt: "concUSD is issued on top of which platform, built by PayPal, M0 and MoonPay?",
        options: ["PYUSDx", "Circle Mint", "USDC.e bridge", "Base Onramp"],
        correctIndex: 0,
        explanation: "PYUSDx lets companies issue a custom on-chain dollar backed 1:1 by PYUSDx, itself backed by PYUSD reserves.",
      },
      {
        id: "m6",
        prompt: "What is Glow Finance's headline liquid-restaking token?",
        options: ["$glowSOL", "$glowETH", "$CT", "$concUSD"],
        correctIndex: 0,
        explanation: "Deposit SOL, receive $glowSOL, and use it as collateral to borrow, lend or trade on leverage within Glow's margin accounts.",
      },
      {
        id: "m7",
        prompt: "Glow Finance grew out of Blueprint's 2024 acquisition of which existing Solana lending protocol?",
        options: ["Jet Protocol", "Solend", "Mango Markets", "Kamino"],
        correctIndex: 0,
        explanation: "Blueprint acquired Jet Protocol in October 2024 and rebuilt it into Glow Finance, launching on Solana mainnet in April 2025.",
      },
      {
        id: "m8",
        prompt: "As of this Guide's last check, has $CT's token generation event (TGE) been officially announced?",
        options: [
          "No — supply is confirmed fixed at 1B, but no TGE or claim process has been announced",
          "Yes, it already launched",
          "Yes, but testnet only",
          "No, the token doesn't exist at all",
        ],
        correctIndex: 0,
        explanation: "$CT exists as a confirmed ERC-20 with a fixed 1B supply, but no TGE, distribution date, or points-conversion has been published.",
      },
    ],
  },
];

export function getBatch(id: string): QuizBatch | undefined {
  return QUIZ_BATCHES.find((b) => b.id === id);
}

export function totalQuestionCount(): number {
  return QUIZ_BATCHES.reduce((sum, b) => sum + b.questions.length, 0);
}

/** Batches in level order — the array is already sorted, but this is the explicit, future-proof accessor. */
export function batchesByLevel(): QuizBatch[] {
  return [...QUIZ_BATCHES].sort((a, b) => a.level - b.level);
}
