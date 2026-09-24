import type { Metadata } from "next";
import TrackerApp from "@/components/TrackerApp";

export const metadata: Metadata = {
  title: "Vault Positions — Concrete Guide",
  description:
    "Enter a wallet and read its Concrete vault positions live, across chains.",
};

export default function PositionsPage() {
  return <TrackerApp view="positions" />;
}
