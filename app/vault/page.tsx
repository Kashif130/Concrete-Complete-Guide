import type { Metadata } from "next";
import { VaultTerminal } from "@/components/vault/VaultTerminal";

export const metadata: Metadata = {
  title: "Vault Terminal — Concrete Guide",
  description:
    "Yield simulator, stability analytics and risk tools for Concrete's ERC-4626 vaults — unofficial community tool.",
};

export default function VaultPage() {
  return <VaultTerminal />;
}
