"use client";

import { Inline } from "@/components/Inline";
import { hfZone, type MarketSource } from "@/lib/vault/data";
import { useVT, type VKey } from "@/lib/vault/dictionary";
import type { TabProps } from "../types";

const SOURCE_KEY: Record<MarketSource, VKey> = {
  live: "srcLive",
  partial: "srcPartial",
  rpc: "srcRpc",
  simulated: "srcSim",
};

const FAQ_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function FaqTab({ vault, market }: TabProps) {
  const v = useVT();
  const zone = hfZone(vault.healthFactor);
  const vars = {
    hf: vault.healthFactor.toFixed(2),
    zone: v(`zone${zone.name}` as VKey),
    src: v(SOURCE_KEY[market.source]),
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-semibold text-ink">{v("faqTitle")}</h3>

      <div className="divide-y divide-line border-y border-line">
        {FAQ_IDS.map((n) => (
          <details key={n} className="group py-1">
            <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-3 text-sm font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
              <span>{v(`faqQ${n}` as VKey)}</span>
              <span aria-hidden className="font-mono text-base text-rebar transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-prose pb-4 text-sm leading-relaxed text-ink/80">
              <Inline text={v(`faqA${n}` as VKey, vars)} />
            </p>
          </details>
        ))}
      </div>

      <div className="rounded-sm border border-line bg-paper2/60 px-6 py-8 text-center">
        <p aria-hidden className="text-2xl">🗿</p>
        <p className="mt-2 font-display text-base font-semibold text-ink">{v("faqStamp")}</p>
        <p className="mt-1 text-xs tracking-wide text-inkfaint">{v("faqBy")}</p>
        <p className="mt-4 text-[11px] uppercase tracking-wide text-inkfaint">{v("faqFoot")}</p>
      </div>
    </div>
  );
}
