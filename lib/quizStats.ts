"use client";

// Local, client-only "meta-game" layer that sits on top of lib/quiz.ts
// (which owns the raw per-batch results in localStorage). This file adds:
// streaks, badges, weak-spot review, speed-mode bonus points, weighted
// scoring, and the anonymous id used only for the opt-in leaderboard.
// Same fail-silent localStorage pattern as lib/quiz.ts throughout.

import { QUIZ_BATCHES, type QuizBatch, type QuizQuestion } from "@/content/quiz";
import type { QuizResult } from "./quiz";

/* ---------------------------------------------------------------------- */
/* Weighted scoring — a correct answer in a Level N batch is worth N pts. */
/* ---------------------------------------------------------------------- */

export function weightForBatch(batchId: string): number {
  return QUIZ_BATCHES.find((b) => b.id === batchId)?.level ?? 1;
}

/** Sum of best-ever correct answers, each weighted by its batch's level — the number the leaderboard ranks on. Separate from the plain "all-time correct" count that still drives tiers. */
export function getWeightedScore(bestByBatch: Record<string, QuizResult>): number {
  return Object.values(bestByBatch).reduce(
    (sum, r) => sum + r.bestCorrect * weightForBatch(r.batchId),
    0
  );
}

/* ---------------------------------------------------------------------- */
/* Streaks                                                                */
/* ---------------------------------------------------------------------- */

export type StreakState = { current: number; longest: number; lastPlayedDay: string | null };

const STREAK_KEY = "concrete-tracker:quiz-streak";

function todayKey(t = Date.now()): string {
  return new Date(t).toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

export function readStreak(): StreakState {
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { current: 0, longest: 0, lastPlayedDay: null };
}

/** Call once per finished batch. First play of a new calendar day increments the streak; a same-day replay leaves it unchanged; a missed day resets it to 1. */
export function bumpStreak(now = Date.now()): StreakState {
  const today = todayKey(now);
  const prev = readStreak();
  let next: StreakState;
  if (prev.lastPlayedDay === today) {
    next = prev;
  } else if (prev.lastPlayedDay && daysBetween(prev.lastPlayedDay, today) === 1) {
    next = { current: prev.current + 1, longest: Math.max(prev.longest, prev.current + 1), lastPlayedDay: today };
  } else {
    next = { current: 1, longest: Math.max(prev.longest, 1), lastPlayedDay: today };
  }
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

/* ---------------------------------------------------------------------- */
/* Weak-spot review                                                       */
/* ---------------------------------------------------------------------- */

const WEAK_KEY = "concrete-tracker:quiz-weakspots";
type WeakStore = Record<string, true>; // `${batchId}:${questionId}` -> true

function readWeak(): WeakStore {
  try {
    const raw = window.localStorage.getItem(WEAK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeWeak(w: WeakStore) {
  try {
    window.localStorage.setItem(WEAK_KEY, JSON.stringify(w));
  } catch {
    // ignore
  }
}

export function recordMiss(batchId: string, questionId: string) {
  const w = readWeak();
  w[`${batchId}:${questionId}`] = true;
  writeWeak(w);
}

const WEAK_CLEARED_KEY = "concrete-tracker:quiz-weakspots-cleared";

export function getWeakSpotsClearedTotal(): number {
  try {
    return Number(window.localStorage.getItem(WEAK_CLEARED_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

/** Returns true if this was actually tracked as a weak spot (so callers can count real clears). Also bumps the all-time cleared counter, which the "Weak-Spot Slayer" badge reads. */
export function clearMiss(batchId: string, questionId: string): boolean {
  const w = readWeak();
  const key = `${batchId}:${questionId}`;
  if (!w[key]) return false;
  delete w[key];
  writeWeak(w);
  try {
    window.localStorage.setItem(WEAK_CLEARED_KEY, String(getWeakSpotsClearedTotal() + 1));
  } catch {
    // ignore
  }
  return true;
}

export function getWeakSpotCount(): number {
  return Object.keys(readWeak()).length;
}

/** A synthetic batch made of every question currently marked missed, pulled live from the real batches, plus a questionId -> source batchId map (since the synthetic batch's own id is "weak-spot-review", not any real batch — that map is what lets clearMiss/recordMiss target the right original entry). Correct answers here clear the question from the list; wrong answers leave it. Doesn't touch bestByBatch/tier score — review is practice, not points. */
export function buildWeakSpotBatch(): { batch: QuizBatch; sourceOf: Record<string, string> } | null {
  const keys = Object.keys(readWeak());
  if (keys.length === 0) return null;
  const questions: QuizQuestion[] = [];
  const sourceOf: Record<string, string> = {};
  for (const key of keys) {
    const [batchId, qId] = key.split(":");
    const q = QUIZ_BATCHES.find((b) => b.id === batchId)?.questions.find((qq) => qq.id === qId);
    if (q) {
      questions.push(q);
      sourceOf[q.id] = batchId;
    }
  }
  if (questions.length === 0) return null;
  return {
    batch: {
      id: "weak-spot-review",
      level: 0,
      title: "Weak-Spot Review",
      tagline: "Every question you've missed so far, in one batch — clear them to shrink this list.",
      premium: false,
      questions,
    },
    sourceOf,
  };
}

/* ---------------------------------------------------------------------- */
/* Speed / timed mode                                                     */
/* ---------------------------------------------------------------------- */

export const SPEED_LIMIT_MS = 12_000;

const SPEED_KEY = "concrete-tracker:quiz-speed-bonus";

export function getSpeedBonus(): number {
  try {
    return Number(window.localStorage.getItem(SPEED_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function addSpeedBonus(n: number): number {
  const next = getSpeedBonus() + Math.max(0, Math.round(n));
  try {
    window.localStorage.setItem(SPEED_KEY, String(next));
  } catch {
    // ignore
  }
  return next;
}

/** Bonus for a correct answer with `timeLeftMs` left out of `limitMs`, scaled by the batch's level — max bonus per question is 2x the level, so speed rewards without dominating the real score. */
export function speedBonusForAnswer(level: number, timeLeftMs: number, limitMs = SPEED_LIMIT_MS): number {
  const frac = Math.max(0, Math.min(1, timeLeftMs / limitMs));
  return Math.round(frac * Math.max(level, 1) * 2);
}

/* ---------------------------------------------------------------------- */
/* Question / option shuffle                                              */
/* ---------------------------------------------------------------------- */

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Returns a copy of the batch with question order shuffled and each question's own options shuffled (correctIndex remapped to match) — plain memorization of "option 2 is always right" stops working. Question ids are untouched so weak-spot tracking still lines up. */
export function shuffleBatch(batch: QuizBatch): QuizBatch {
  const questions = shuffle(batch.questions).map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      correctIndex: order.indexOf(q.correctIndex),
    };
  });
  return { ...batch, questions };
}

/* ---------------------------------------------------------------------- */
/* Anonymous client id (leaderboard only — no account, no wallet)         */
/* ---------------------------------------------------------------------- */

const CLIENT_ID_KEY = "concrete-tracker:quiz-client-id";

export function getClientId(): string {
  try {
    let id = window.localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto?.randomUUID?.() ?? `q-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

const NAME_KEY = "concrete-tracker:quiz-name";

export function getSavedName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}
export function saveName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name.slice(0, 24));
  } catch {
    // ignore
  }
}

/* ---------------------------------------------------------------------- */
/* Badges / achievements                                                  */
/* ---------------------------------------------------------------------- */

export type Badge = { key: string; label: string; emoji: string; description: string };

export const QUIZ_BADGES: Badge[] = [
  { key: "first-batch", emoji: "🎯", label: "First Steps", description: "Finish your first quiz batch." },
  { key: "perfect-1", emoji: "🪨", label: "Perfect Level 1", description: "Full marks on Level 1." },
  { key: "perfect-3", emoji: "🧱", label: "Perfect Level 3", description: "Full marks on Level 3." },
  { key: "perfect-6", emoji: "🗿", label: "Perfect Level 6", description: "Full marks on Level 6." },
  { key: "all-perfect", emoji: "💯", label: "Clean Sweep", description: "Full marks on every batch." },
  { key: "streak-3", emoji: "🔥", label: "3-Day Streak", description: "Play 3 days in a row." },
  { key: "streak-5", emoji: "🔥", label: "5-Day Streak", description: "Play 5 days in a row." },
  { key: "streak-10", emoji: "🔥", label: "10-Day Streak", description: "Play 10 days in a row." },
  { key: "moai", emoji: "🗿", label: "Moai Tier Reached", description: "Reach the top tier." },
  { key: "speed-demon", emoji: "⏱️", label: "Speed Demon", description: "Perfect batch in Speed Mode." },
  { key: "weak-spot-slayer", emoji: "🛡️", label: "Weak-Spot Slayer", description: "Clear 5+ missed questions in review." },
];

const BADGES_KEY = "concrete-tracker:quiz-badges";
type BadgeStore = Record<string, number>; // badge key -> unlockedAt ms

function readBadges(): BadgeStore {
  try {
    const raw = window.localStorage.getItem(BADGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeBadges(b: BadgeStore) {
  try {
    window.localStorage.setItem(BADGES_KEY, JSON.stringify(b));
  } catch {
    // ignore
  }
}

export function getUnlockedBadges(): BadgeStore {
  return readBadges();
}

export type BadgeCheckInput = {
  bestByBatch: Record<string, QuizResult>;
  tierKey: string;
  streak: number;
  justSpeedPerfect?: boolean;
  weakSpotsClearedTotal?: number;
};

/** Recomputes which badges should be unlocked from current state and persists any newly-earned ones. Returns the ones newly unlocked THIS call (for a toast) plus the full unlocked set. */
export function checkBadges(input: BadgeCheckInput): { newly: Badge[]; all: BadgeStore } {
  const store = readBadges();
  const now = Date.now();
  const newly: Badge[] = [];
  const unlock = (key: string) => {
    if (!store[key]) {
      store[key] = now;
      const b = QUIZ_BADGES.find((x) => x.key === key);
      if (b) newly.push(b);
    }
  };

  const results = Object.values(input.bestByBatch);
  if (results.length > 0) unlock("first-batch");

  for (const r of results) {
    const batch = QUIZ_BATCHES.find((b) => b.id === r.batchId);
    if (!batch) continue;
    if (r.bestCorrect === batch.questions.length) {
      if (batch.level === 1) unlock("perfect-1");
      if (batch.level === 3) unlock("perfect-3");
      if (batch.level === 6) unlock("perfect-6");
    }
  }

  const attempted = new Set(results.map((r) => r.batchId));
  if (
    QUIZ_BATCHES.every(
      (b) => attempted.has(b.id) && input.bestByBatch[b.id]?.bestCorrect === b.questions.length
    )
  ) {
    unlock("all-perfect");
  }

  if (input.streak >= 3) unlock("streak-3");
  if (input.streak >= 5) unlock("streak-5");
  if (input.streak >= 10) unlock("streak-10");
  if (input.tierKey === "moai") unlock("moai");
  if (input.justSpeedPerfect) unlock("speed-demon");
  if ((input.weakSpotsClearedTotal ?? 0) >= 5) unlock("weak-spot-slayer");

  writeBadges(store);
  return { newly, all: store };
}
