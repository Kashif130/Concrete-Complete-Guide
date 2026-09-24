"use client";

import TrackerShell from "@/components/TrackerShell";
import LeaderboardTable from "@/components/LeaderboardTable";
import { useVT } from "@/lib/vault/dictionary";

export default function LeaderboardPage() {
  const v = useVT();
  return (
    <TrackerShell title={v("trLbPageTitle")} subtitle={v("trLbPageSub")}>
      <LeaderboardTable />
    </TrackerShell>
  );
}
