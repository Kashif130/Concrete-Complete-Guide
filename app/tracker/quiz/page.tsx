import type { Metadata } from "next";
import TrackerShell from "@/components/TrackerShell";
import QuizApp from "@/components/QuizApp";

export const metadata: Metadata = {
  title: "Quiz — Concrete Guide",
  description:
    "Test what you know about Concrete's vaults, points and architecture. Score only counts correct answers — climb the tiers and share your card.",
};

export default function QuizPage() {
  return (
    <TrackerShell
      title="Concrete Guide Quiz 🗿"
      subtitle="Answer questions pulled straight from the Guide's docs. Only correct answers score — build a streak, earn badges, try Speed Mode, and climb the global leaderboard."
      wide
    >
      <QuizApp />
    </TrackerShell>
  );
}
