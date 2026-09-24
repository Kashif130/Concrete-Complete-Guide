"use client";

import { useMemo, useState } from "react";

// Only domains this guide can actually source (see Ecosystem & partners and
// the site's own footer/tracker copy). We deliberately do NOT include a
// Blueprint Finance / Glow Finance domain here — we could not confirm one
// from independent sources, and a wrong entry in a "is this official"
// allowlist is worse than no entry at all. See the note in the UI below.
const VERIFIED_DOMAINS = [
  "concrete.xyz",
  "app.concrete.xyz",
  "points.concrete.xyz",
  "concretefoundation.xyz",
];

// Extra path/query fragments that, combined with an unverified domain,
// point specifically at the known "$CT claim" scam pattern documented in
// the FAQ.
const CLAIM_SCAM_HINTS = ["claim", "airdrop", "connect-wallet", "connectwallet"];

type Verdict = {
  level: "official" | "lookalike" | "unknown" | "invalid";
  headline: string;
  detail: string;
};

function normalizeInput(raw: string): { host: string; original: string } | null {
  let s = raw.trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const url = new URL(s);
    return { host: url.hostname.toLowerCase().replace(/^www\./, ""), original: raw.trim() };
  } catch {
    return null;
  }
}

// Classic Levenshtein edit distance — small and dependency-free.
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function checkDomain(host: string, path: string): Verdict {
  const isVerified = VERIFIED_DOMAINS.some((d) => host === d || host.endsWith("." + d));
  if (isVerified) {
    return {
      level: "official",
      headline: "✅ Matches a verified Concrete domain",
      detail:
        "This host matches concrete.xyz's own domain family as sourced in this guide. That confirms the domain only — it doesn't confirm what a specific page or link on it is asking you to do, so still read before you sign or approve anything.",
    };
  }

  // Lookalike check: small edit distance to a verified domain, or the
  // verified domain's name with a different TLD / extra hyphen.
  const bareHost = host.replace(/\.[a-z]{2,}$/i, "");
  let nearest: { domain: string; dist: number } | null = null;
  for (const d of VERIFIED_DOMAINS) {
    const bareD = d.replace(/\.[a-z]{2,}$/i, "");
    const dist = editDistance(bareHost, bareD);
    if (!nearest || dist < nearest.dist) nearest = { domain: d, dist };
  }
  const looksLikeTyposquat = !!nearest && nearest.dist > 0 && nearest.dist <= 2;

  if (looksLikeTyposquat && nearest) {
    return {
      level: "lookalike",
      headline: `🚫 Looks like a lookalike of ${nearest.domain}`,
      detail: `The name is very close to a verified domain (${nearest.domain}) but not an exact match — a common typosquat pattern (swapped letter, extra hyphen, wrong TLD). Do not connect a wallet or sign anything here.`,
    };
  }

  const hasClaimHint = CLAIM_SCAM_HINTS.some((hint) => path.toLowerCase().includes(hint));
  if (hasClaimHint) {
    return {
      level: "lookalike",
      headline: "🚫 Unverified domain + a claim/connect link",
      detail:
        "This domain isn't on the verified list, and the URL includes a \"claim\" / \"connect wallet\" style path. Concrete has confirmed $CT exists but has not announced a TGE or claim process — treat any \"claim your $CT\" link as a scam regardless of which site it's on.",
    };
  }

  return {
    level: "unknown",
    headline: "⚠️ Not on the verified list",
    detail:
      "That doesn't automatically make it a scam — this guide only tracks concrete.xyz's own domain family, not every legitimate Blueprint Finance / Glow Finance property. Before connecting a wallet, verify the link yourself from concrete.xyz's own site/footer or its official X account, rather than trusting a link shared elsewhere.",
  };
}

export function OfficialChecker() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");

  const verdict = useMemo<Verdict | null>(() => {
    if (!submitted) return null;
    const parsed = normalizeInput(submitted);
    if (!parsed) {
      return {
        level: "invalid",
        headline: "Couldn't read that as a domain or URL",
        detail: "Paste a full link (https://...) or just the domain, e.g. concrete.xyz.",
      };
    }
    let path = "";
    try {
      path = new URL(submitted.startsWith("http") ? submitted : `https://${submitted}`).pathname;
    } catch {
      path = "";
    }
    return checkDomain(parsed.host, path);
  }, [submitted]);

  const levelStyles: Record<Verdict["level"], string> = {
    official: "border-blueprint bg-blueprint/5 text-blueprint",
    lookalike: "border-rebar bg-rebar/5 text-rebar",
    unknown: "border-line bg-line/20 text-ink",
    invalid: "border-line bg-line/20 text-inkfaint",
  };

  return (
    <div className="not-prose my-8 border border-line bg-white/40 p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(input);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a domain or URL, e.g. concrete.xyz or https://app.concrete.xyz/vaults"
          className="focus-ring flex-1 border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-inkfaint"
        />
        <button
          type="submit"
          className="focus-ring whitespace-nowrap border border-blueprint bg-blueprint px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-blueprint2"
        >
          Check
        </button>
      </form>

      {verdict && (
        <div className={`mt-4 border-l-4 px-4 py-3 text-sm ${levelStyles[verdict.level]}`}>
          <p className="font-semibold">{verdict.headline}</p>
          <p className="mt-1 text-ink/80">{verdict.detail}</p>
        </div>
      )}

      <p className="mt-4 text-xs text-inkfaint">
        Verified against: {VERIFIED_DOMAINS.join(", ")}. This list only covers Concrete's own
        Ethereum-side domains sourced from this guide — it does not include a Blueprint Finance
        or Glow Finance (Solana) domain, since we could not independently confirm one. Never
        enter a seed phrase anywhere; no legitimate Concrete page will ask for it.
      </p>
    </div>
  );
}

export default OfficialChecker;
