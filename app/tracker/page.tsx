import type { Metadata } from "next";
import TrackerApp from "@/components/TrackerApp";

export const metadata: Metadata = {
  title: "Points Balance — Concrete Guide",
  description:
    "Check a wallet's Concrete points balance and rank, with the top-1,000 leaderboard one click away.",
};

export default function TrackerPage() {
  return <TrackerApp view="balance" />;
}
