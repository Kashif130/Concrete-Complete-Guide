"use client";

// Client-only, localStorage-backed quiz progress — same pattern as
// lib/snapshots.ts. A "correct answer" is the only thing that ever adds to
// the score; picking a wrong option never subtracts and never awards
// anything. Nothing here touches the real Fuul points balance — this is a
// separate, purely-local quiz score used for the tier card.

export type QuizResult = {
  batchId: string;
  correct: number;
  total: number;
  bestCorrect: number; // best-ever correct count for this batch
  completedAt: number;
};

export type QuizTier = {
  key: string;
  label: string;
  emoji: string;
  min: number; // minimum total correct answers (all-time, all batches) to reach this tier
};

// Cumulative correct-answer thresholds across every batch ever taken.
// Deliberately generous early on, harder to climb later — same shape as the
// MILESTONES ladder in PointsPanel.tsx. With 6 levels × 8 questions the
// question bank tops out at 48 correct answers total, so Moai Tier — the
// premium, capstone rank — is reserved for a clean sweep.
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

export function nextTier(totalCorrect: number): QuizTier | null {
  return QUIZ_TIERS.find((t) => t.min > totalCorrect) ?? null;
}

/** 0-100 progress from the current tier's floor toward the next tier's floor. 100 once top tier is reached. */
export function progressToNextTier(totalCorrect: number): number {
  const current = tierForScore(totalCorrect);
  const upcoming = nextTier(totalCorrect);
  if (!upcoming) return 100;
  const span = upcoming.min - current.min;
  if (span <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round(((totalCorrect - current.min) / span) * 100)));
}

const STORAGE_KEY = "concrete-tracker:quiz";

type QuizStore = Record<string, QuizResult>; // keyed by batchId

function readAll(): QuizStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: QuizStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable (private browsing) — quiz history is a
    // nice-to-have, fail silently rather than breaking the app.
  }
}

/** Record a finished attempt at `batchId`. Only the best-ever correct count for that batch counts toward the all-time tier, so retrying never lowers your tier. */
export function recordQuizResult(batchId: string, correct: number, total: number): QuizStore {
  const all = readAll();
  const prev = all[batchId];
  all[batchId] = {
    batchId,
    correct,
    total,
    bestCorrect: Math.max(prev?.bestCorrect ?? 0, correct),
    completedAt: Date.now(),
  };
  writeAll(all);
  return all;
}

export function getAllResults(): QuizStore {
  return readAll();
}

/** Sum of best-ever correct answers across every batch attempted — the number the tier card is built from. */
export function getTotalScore(): number {
  const all = readAll();
  return Object.values(all).reduce((sum, r) => sum + r.bestCorrect, 0);
}

export function getBatchResult(batchId: string): QuizResult | undefined {
  return readAll()[batchId];
}
