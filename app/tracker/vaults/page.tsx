import type { Metadata } from "next";
import Link from "next/link";
import LiveVaultsDashboard from "@/components/LiveVaultsDashboard";

export const metadata: Metadata = {
  title: "Live Vaults — Concrete Guide",
  description:
    "Every known Concrete vault across chains, read live on-chain, with an allocation optimizer and compound-growth earning prediction. Ported from the community Concrete Tracker.",
};

export default function TrackerVaultsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/tracker"
          className="focus-ring border border-concreteMuted/40 px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab"
        >
          ← Wallet tracker
        </Link>
        <Link
          href="/vault"
          className="focus-ring border border-steelBright/40 bg-steelBright/10 px-3 py-1.5 text-xs text-steelBright transition-colors hover:bg-steelBright/20"
        >
          Vault Terminal ↗
        </Link>
      </div>
      <LiveVaultsDashboard />
    </main>
  );
}
