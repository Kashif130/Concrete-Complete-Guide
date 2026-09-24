"use client";

import { useVT } from "@/lib/vault/dictionary";
import { CT_CONTRACT_ADDRESS } from "@/lib/ctToken";
import CtPriceLive from "./CtPriceLive";

// Static facts sourced from concretefoundation.xyz (the Concrete Foundation's own
// $CT page) — Halborn audits and MiCAR white paper. These are on-chain / document
// facts, not projections, so they don't need live fetching. Re-verify against
// concretefoundation.xyz if the Foundation ever migrates them.
const CT_ETHERSCAN_URL = `https://etherscan.io/token/${CT_CONTRACT_ADDRESS}`;
const CT_AUDIT_CORE_URL =
  "https://concretefoundation.xyz/assets/documents/ct-token-audit-halborn.pdf";
const CT_AUDIT_SUPP_URL =
  "https://concretefoundation.xyz/assets/documents/ct-token-audit-halborn-supplemental.pdf";
const CT_MICAR_URL =
  "https://concretefoundation.xyz/assets/documents/ct-micar-white-paper.pdf";
const CT_BLOG_URL = "https://concretefoundation.xyz/blog/ct";
const CT_FOUNDATION_URL = "https://concretefoundation.xyz";

function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function CtTokenCard() {
  const t = useVT();

  return (
    <section id="ct-token-card" className="scroll-mt-20 border border-concreteMuted/40 bg-surface">
      <header className="border-b border-concreteMuted/40 px-6 py-4">
        <h2 className="text-lg text-ink">{t("trCtTitle")}</h2>
        <p className="mt-1 text-xs text-inkMuted">{t("trCtIntro")}</p>
      </header>

      <div className="space-y-4 px-6 py-5">
        <CtPriceLive contractAddress={CT_CONTRACT_ADDRESS} />

        <div>
          <div className="text-xs uppercase tracking-wide text-inkMuted">
            {t("trCtContractLabel")}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-brass" title={CT_CONTRACT_ADDRESS}>
              {shortAddress(CT_CONTRACT_ADDRESS)}
            </span>
            <a
              href={CT_ETHERSCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-steelBright underline underline-offset-2 hover:text-steel"
            >
              {t("trCtVerify")} ↗
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-inkMuted">
            {t("trCtAuditLabel")}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={CT_AUDIT_CORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-steelBright underline underline-offset-2 hover:text-steel"
            >
              {t("trCtAuditCore")} ↗
            </a>
            <a
              href={CT_AUDIT_SUPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-steelBright underline underline-offset-2 hover:text-steel"
            >
              {t("trCtAuditSupp")} ↗
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={CT_MICAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-steelBright underline underline-offset-2 hover:text-steel"
          >
            {t("trCtWhitepaper")} ↗
          </a>
          <a
            href={CT_BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-steelBright underline underline-offset-2 hover:text-steel"
          >
            {t("trCtBlog")} ↗
          </a>
        </div>

        <div className="border-t border-concreteMuted/30 pt-3">
          <a
            href={CT_FOUNDATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-inkMuted underline underline-offset-2 hover:text-ink"
          >
            {t("trCtOfficialSite")}
          </a>
          <p className="mt-2 text-xs text-inkMuted">{t("trCtNote")}</p>
        </div>
      </div>
    </section>
  );
}
