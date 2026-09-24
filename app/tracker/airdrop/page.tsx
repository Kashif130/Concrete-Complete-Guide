import type { Metadata } from "next";
import TrackerApp from "@/components/TrackerApp";

export const metadata: Metadata = {
  title: "Airdrop Estimator — Concrete Guide",
  description:
    "Unofficial $CT airdrop what-if using your real points and the real total of every user's points.",
};

export default function AirdropPage() {
  return <TrackerApp view="airdrop" />;
}
