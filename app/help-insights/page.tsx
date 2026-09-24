import type { Metadata } from "next";
import { HelpInsights } from "@/components/HelpInsights";

export const metadata: Metadata = {
  title: "Help Center insights — Concrete Guide",
  robots: { index: false, follow: false },
};

export default function HelpInsightsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <p className="font-mono text-xs text-rebar">OWNER</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Help Center insights</h1>
      <p className="mt-3 max-w-prose text-sm text-inkfaint">
        What people ask the help bot, what got a 👎, and — most useful — the questions the guide could not answer,
        i.e. what is missing from the docs. Anonymous: no names, IPs or wallet addresses are stored.
      </p>
      <HelpInsights />
    </div>
  );
}
