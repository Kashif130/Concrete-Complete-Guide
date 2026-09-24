// Same tier ladder as lib/quiz.ts (kept in sync by hand — small, rarely
// changes). Duplicated rather than imported because lib/quiz.ts is marked
// "use client" for its localStorage-backed browser store, which has no
// place in a serverless API route. Only the pure, storage-free part is
// needed here.
export type QuizTier = {
  key: string;
  label: string;
  emoji: string;
  min: number;
};

export const QUIZ_TIERS: QuizTier[] = [
  { key: "novice", label: "Novice", emoji: "🪨", min: 0 },
  { key: "apprentice", label: "Apprentice", emoji: "🧰", min: 6 },
  { key: "builder", label: "Builder", emoji: "🧱", min: 12 },
  { key: "surveyor", label: "Surveyor", emoji: "📐", min: 18 },
  { key: "architect", label: "Architect", emoji: "🏗️", min: 24 },
  { key: "foreman", label: "Foreman", emoji: "🛠️", min: 30 },
  { key: "engineer", label: "Engineer", emoji: "⚙️", min: 36 },
  { key: "curator", label: "Curator", emoji: "👷", min: 40 },
  { key: "grandmaster", label: "Grandmaster", emoji: "💎", min: 44 },
  { key: "moai", label: "Moai Tier", emoji: "🗿", min: 48 },
];

export function tierForScore(totalCorrect: number): QuizTier {
  let current = QUIZ_TIERS[0];
  for (const tier of QUIZ_TIERS) {
    if (totalCorrect >= tier.min) current = tier;
  }
  return current;
}
