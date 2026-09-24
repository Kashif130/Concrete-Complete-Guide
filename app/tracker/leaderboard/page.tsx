import type { Metadata } from "next";
import LeaderboardPage from "@/components/LeaderboardPage";

export const metadata: Metadata = {
  title: "Leaderboard — Concrete Guide",
  description: "Top 1,000 Concrete points holders, live from Fuul.",
};

export default function Page() {
  return <LeaderboardPage />;
}
