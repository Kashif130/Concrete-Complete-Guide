import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { OfficialChecker } from "@/components/OfficialChecker";

export const metadata: Metadata = {
  title: "Is this official? — Concrete Guide",
  description:
    "Paste a domain or URL to check it against Concrete's verified domains and common typosquat patterns before you connect a wallet.",
};

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-7rem)] md:overflow-y-auto">
          <Sidebar />
        </aside>
        <article className="max-w-prose">
          <p className="font-mono text-xs text-rebar">Scam protection</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">
            Is this official?
          </h1>
          <p className="mt-4 text-sm text-ink/80">
            Paste a domain or link before you connect a wallet or sign anything. This checks it
            against Concrete's verified domain family and flags common typosquat patterns (swapped
            letters, extra hyphens, wrong TLD) — it's a sanity check, not a guarantee.
          </p>

          <OfficialChecker />

          <p className="text-sm text-ink/80">
            For the wider context on scams and how to verify a partnership or announcement, see{" "}
            <Link href="/docs/04-ecosystem/02-partners-and-institutions" className="text-blueprint underline">
              Ecosystem &amp; partners
            </Link>{" "}
            and the{" "}
            <Link href="/docs/05-reference/01-faq-a-to-z" className="text-blueprint underline">
              FAQ A–Z
            </Link>
            . Never enter a seed phrase or private key anywhere — no legitimate Concrete page or
            tool (including this guide's own Wallet Tracker) will ever ask for one.
          </p>
        </article>
      </div>
    </div>
  );
}
