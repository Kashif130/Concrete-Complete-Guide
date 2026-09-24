"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_BATCHES, type QuizBatch } from "@/content/quiz";
import {
  getAllResults,
  getTotalScore,
  recordQuizResult,
  tierForScore,
  nextTier,
  progressToNextTier,
  QUIZ_TIERS,
  type QuizResult,
  type QuizTier,
} from "@/lib/quiz";
import {
  getWeightedScore,
  weightForBatch,
  readStreak,
  bumpStreak,
  type StreakState,
  getWeakSpotCount,
  getWeakSpotsClearedTotal,
  buildWeakSpotBatch,
  recordMiss,
  clearMiss,
  getSpeedBonus,
  addSpeedBonus,
  speedBonusForAnswer,
  SPEED_LIMIT_MS,
  shuffleBatch,
  getClientId,
  getSavedName,
  saveName,
  getUnlockedBadges,
  checkBadges,
  type Badge,
} from "@/lib/quizStats";
import { submitLeaderboardScore } from "@/lib/quizLeaderboardClient";
import { SITE_URL } from "@/lib/siteConfig";
import ShareButtons from "./ShareButtons";
import ShareCardImage from "./ShareCardImage";
import QuizBadges from "./QuizBadges";
import QuizLeaderboard from "./QuizLeaderboard";

type Stage = "pick" | "question" | "result";

export default function QuizApp() {
  const [stage, setStage] = useState<Stage>("pick");
  const [batch, setBatch] = useState<QuizBatch | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null); // -1 = timed out
  const [correctCount, setCorrectCount] = useState(0);

  // Read from localStorage only after mount, so server and first client
  // render match (same pattern PointsPanel uses for snapshot history).
  const [totalScore, setTotalScore] = useState(0);
  const [bestByBatch, setBestByBatch] = useState<Record<string, QuizResult>>({});
  const [streak, setStreak] = useState<StreakState>({ current: 0, longest: 0, lastPlayedDay: null });
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, number>>({});
  const [weakSpotCount, setWeakSpotCount] = useState(0);
  const [totalSpeedBonus, setTotalSpeedBonus] = useState(0);

  // Per-run-through state
  const [speedModeSelected, setSpeedModeSelected] = useState(false); // toggle on the picker
  const [speedMode, setSpeedMode] = useState(false); // locked in for the batch in progress
  const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null);
  const [batchSpeedBonus, setBatchSpeedBonus] = useState(0);
  const [weakSourceOf, setWeakSourceOf] = useState<Record<string, string>>({});
  const [weakClearedThisBatch, setWeakClearedThisBatch] = useState(0);
  const [badgeToast, setBadgeToast] = useState<Badge[] | null>(null);
  const [tierJustUnlocked, setTierJustUnlocked] = useState<QuizTier | null>(null);
  const [lbRefresh, setLbRefresh] = useState(0);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    setTotalScore(getTotalScore());
    setBestByBatch(getAllResults());
    setStreak(readStreak());
    setUnlockedBadges(getUnlockedBadges());
    setWeakSpotCount(getWeakSpotCount());
    setTotalSpeedBonus(getSpeedBonus());
    setNameInput(getSavedName());
  }, []);

  const tier = tierForScore(totalScore);
  const upcoming = nextTier(totalScore);
  const weightedScore = getWeightedScore(bestByBatch);
  const isReviewMode = batch?.id === "weak-spot-review";

  function startBatch(b: QuizBatch) {
    setWeakSourceOf({});
    setSpeedMode(speedModeSelected);
    setBatch(shuffleBatch(b));
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setBatchSpeedBonus(0);
    setWeakClearedThisBatch(0);
    setBadgeToast(null);
    setTierJustUnlocked(null);
    setStage("question");
  }

  function startWeakSpotReview() {
    const built = buildWeakSpotBatch();
    if (!built) return;
    setWeakSourceOf(built.sourceOf);
    setSpeedMode(false);
    setBatch(shuffleBatch(built.batch));
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setBatchSpeedBonus(0);
    setWeakClearedThisBatch(0);
    setBadgeToast(null);
    setTierJustUnlocked(null);
    setStage("question");
  }

  function handleTimeUp() {
    if (selected !== null || !batch) return;
    setSelected(-1);
    const q = batch.questions[qIndex];
    if (!isReviewMode) recordMiss(batch.id, q.id);
  }

  // Speed-mode countdown. Only runs while an unanswered question is showing
  // in speed mode; resets on every new question.
  useEffect(() => {
    if (stage !== "question" || !speedMode || selected !== null || !batch) {
      setTimeLeftMs(null);
      return;
    }
    const start = Date.now();
    setTimeLeftMs(SPEED_LIMIT_MS);
    const iv = window.setInterval(() => {
      const left = SPEED_LIMIT_MS - (Date.now() - start);
      if (left <= 0) {
        window.clearInterval(iv);
        setTimeLeftMs(0);
        handleTimeUp();
      } else {
        setTimeLeftMs(left);
      }
    }, 100);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, speedMode, qIndex, selected, batch]);

  function pickOption(i: number) {
    if (selected !== null || !batch) return;
    setSelected(i);
    const q = batch.questions[qIndex];
    // Score only ever goes up, and only when the picked option is the
    // correct one — a wrong pick never adds to the score.
    if (i === q.correctIndex) {
      setCorrectCount((c) => c + 1);
      if (speedMode && timeLeftMs !== null) {
        setBatchSpeedBonus((b) => b + speedBonusForAnswer(batch.level || 1, timeLeftMs));
      }
      if (isReviewMode) {
        const srcBatchId = weakSourceOf[q.id];
        if (srcBatchId && clearMiss(srcBatchId, q.id)) {
          setWeakClearedThisBatch((n) => n + 1);
        }
      }
    } else if (!isReviewMode) {
      recordMiss(batch.id, q.id);
    }
  }

  function next() {
    if (!batch) return;
    if (qIndex + 1 < batch.questions.length) {
      setQIndex((n) => n + 1);
      setSelected(null);
    } else {
      finishBatch();
    }
  }

  function finishBatch() {
    if (!batch) return;
    const prevTier = tier;

    let updatedBest = bestByBatch;
    let newTotalScore = totalScore;
    if (!isReviewMode) {
      updatedBest = recordQuizResult(batch.id, correctCount, batch.questions.length);
      setBestByBatch(updatedBest);
      newTotalScore = Object.values(updatedBest).reduce((sum, r) => sum + r.bestCorrect, 0);
      setTotalScore(newTotalScore);
    }

    const newStreak = bumpStreak();
    setStreak(newStreak);

    if (batchSpeedBonus > 0) {
      setTotalSpeedBonus(addSpeedBonus(batchSpeedBonus));
    }

    const newTier = tierForScore(newTotalScore);
    const justSpeedPerfect = speedMode && !isReviewMode && correctCount === batch.questions.length;
    const { newly, all } = checkBadges({
      bestByBatch: updatedBest,
      tierKey: newTier.key,
      streak: newStreak.current,
      justSpeedPerfect,
      weakSpotsClearedTotal: getWeakSpotsClearedTotal(),
    });
    setUnlockedBadges(all);
    setBadgeToast(newly.length > 0 ? newly : null);
    setTierJustUnlocked(!isReviewMode && newTier.key !== prevTier.key ? newTier : null);
    setWeakSpotCount(getWeakSpotCount());

    if (!isReviewMode) {
      const cid = getClientId();
      const nm = getSavedName() || `Player-${cid.slice(0, 4)}`;
      submitLeaderboardScore({
        clientId: cid,
        name: nm,
        bestByBatch: updatedBest,
        tierKey: newTier.key,
        streak: newStreak.current,
      }).then(() => setLbRefresh((n) => n + 1));
    }

    setStage("result");
  }

  function backToBatches() {
    setStage("pick");
    setBatch(null);
    setSelected(null);
  }

  function handleSaveName(v: string) {
    setNameInput(v);
    saveName(v);
  }

  if (stage === "pick") {
    return (
      <BatchPicker
        onStart={startBatch}
        onStartReview={startWeakSpotReview}
        totalScore={totalScore}
        weightedScore={weightedScore}
        bestByBatch={bestByBatch}
        tierLabel={`${tier.emoji} ${tier.label}`}
        tierKey={tier.key}
        progress={progressToNextTier(totalScore)}
        nextTierLabel={
          upcoming
            ? `${upcoming.min - totalScore} correct to ${upcoming.emoji} ${upcoming.label}`
            : "Top tier reached — you're carved in stone 🗿"
        }
        streak={streak}
        unlockedBadges={unlockedBadges}
        weakSpotCount={weakSpotCount}
        speedModeSelected={speedModeSelected}
        onToggleSpeedMode={() => setSpeedModeSelected((s) => !s)}
        totalSpeedBonus={totalSpeedBonus}
        nameInput={nameInput}
        onNameChange={handleSaveName}
        lbRefresh={lbRefresh}
      />
    );
  }

  if (stage === "question" && batch) {
    const q = batch.questions[qIndex];
    const timedOut = selected === -1;
    return (
      <section className="border border-concreteMuted/40 bg-surface">
        <header className="border-b border-concreteMuted/40 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-steelBright">
                {isReviewMode ? (
                  <span className="border border-brass/40 bg-brass/10 px-1.5 py-0.5 text-[10px] font-medium text-brass">
                    🔁 REVIEW
                  </span>
                ) : (
                  <span className="border border-steel/40 bg-steel/10 px-1.5 py-0.5 text-[10px] font-medium text-steelBright">
                    LVL {batch.level}
                  </span>
                )}{" "}
                {batch.title} {batch.premium && <span className="text-brass">· 🗿 Premium</span>}
                {speedMode && !isReviewMode && <span className="text-brass"> · ⏱️ Speed Mode</span>}
              </p>
              <h2 className="text-lg text-ink">
                Question {qIndex + 1} of {batch.questions.length}
              </h2>
            </div>
            <button
              type="button"
              onClick={backToBatches}
              className="focus-ring shrink-0 border border-concreteMuted/40 bg-base px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab"
            >
              Exit quiz
            </button>
          </div>
          {speedMode && !isReviewMode && (
            <div className="mt-3 h-1.5 w-full overflow-hidden border border-concreteMuted/30 bg-base">
              <div
                className={`h-full transition-[width] duration-100 ${
                  timeLeftMs !== null && timeLeftMs < 3000 ? "bg-red-500" : "bg-brass"
                }`}
                style={{ width: `${timeLeftMs === null ? 100 : (timeLeftMs / SPEED_LIMIT_MS) * 100}%` }}
                aria-hidden
              />
            </div>
          )}
        </header>

        <div className="px-6 py-6">
          <p className="mb-5 text-base text-ink">{q.prompt}</p>

          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isPicked = i === selected;
              let cls =
                "focus-ring border px-4 py-3 text-left text-sm transition-colors border-concreteMuted/40 text-ink hover:bg-slab";
              if (selected !== null) {
                if (isCorrect) {
                  cls = "border px-4 py-3 text-left text-sm border-emerald-600/60 bg-emerald-600/15 text-emerald-800";
                } else if (isPicked) {
                  cls = "border px-4 py-3 text-left text-sm border-red-600/50 bg-red-600/10 text-red-800";
                } else {
                  cls = "border px-4 py-3 text-left text-sm border-concreteMuted/30 text-inkMuted opacity-60";
                }
              }
              return (
                <button key={i} type="button" onClick={() => pickOption(i)} disabled={selected !== null} className={cls}>
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-5 border border-concreteMuted/30 bg-base px-4 py-3">
              <p className="text-sm text-inkMuted">
                {timedOut
                  ? "⏱️ Time's up — no points for this one."
                  : selected === q.correctIndex
                  ? isReviewMode
                    ? "✅ Correct — cleared from your weak spots."
                    : `✅ Correct — score +1${speedMode ? ` (+${speedBonusForAnswer(batch.level || 1, timeLeftMs ?? 0)} speed bonus)` : ""}.`
                  : "❌ Not quite — no points for this one."}{" "}
                {q.explanation}
              </p>
              <button
                type="button"
                onClick={next}
                className="focus-ring mt-3 border border-steel bg-steel/10 px-4 py-1.5 text-xs font-medium text-steelBright transition-colors hover:bg-steel/20"
              >
                {qIndex + 1 < batch.questions.length ? "Next question" : "See results"}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (stage === "result" && batch) {
    const shareText = buildShareText(batch, correctCount, totalScore, isReviewMode);
    return (
      <section className="border border-concreteMuted/40 bg-surface">
        <header className="border-b border-concreteMuted/40 px-6 py-4">
          <h2 className="text-lg text-ink">
            {isReviewMode ? "Review complete" : `Batch complete: ${batch.title}`}
          </h2>
          <p className="text-xs text-inkMuted">
            You scored {correctCount} / {batch.questions.length}
            {isReviewMode
              ? " — weak-spot review doesn't affect your tier score."
              : " — points are only awarded for correct answers."}
          </p>
        </header>

        <div className="px-6 py-6">
          {badgeToast && badgeToast.length > 0 && (
            <div className="mb-5 border border-brass/50 bg-brass/10 px-4 py-3">
              <p className="text-sm font-medium text-brass">🎉 New badge{badgeToast.length > 1 ? "s" : ""} unlocked!</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {badgeToast.map((b) => (
                  <span key={b.key} className="border border-brass/50 bg-brass/15 px-2 py-1 text-[11px] text-brass">
                    {b.emoji} {b.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Batch score" value={`${correctCount}/${batch.questions.length}`} />
            {!isReviewMode && <Stat label="All-time correct" value={String(totalScore)} accent />}
            {!isReviewMode && <Stat label="Weighted score" value={String(weightedScore)} accent />}
            <Stat label="Streak" value={`🔥 ${streak.current}d`} />
            {batchSpeedBonus > 0 && <Stat label="Speed bonus" value={`+${batchSpeedBonus}`} accent />}
            {isReviewMode && weakClearedThisBatch > 0 && (
              <Stat label="Weak spots cleared" value={String(weakClearedThisBatch)} accent />
            )}
            {!isReviewMode && <Stat label="Current tier" value={`${tier.emoji} ${tier.label}`} accent />}
          </div>

          {tierJustUnlocked && (
            <div className="mb-4">
              <p className="mb-2 text-sm text-brass">
                🎫 New tier unlocked — here&apos;s your certificate:
              </p>
              <ShareCardImage
                certificate
                kicker="concrete.xyz · Quiz"
                headline={tierJustUnlocked.emoji}
                headlineLabel={`${tierJustUnlocked.label} unlocked · ${totalScore} correct`}
                stats={[
                  { label: "All-time score", value: String(totalScore), accent: true },
                  { label: "Weighted score", value: String(weightedScore) },
                  { label: "Streak", value: `${streak.current}d` },
                ]}
                filename={`concrete-quiz-tier-${tierJustUnlocked.key}`}
              />
            </div>
          )}

          {!isReviewMode && (
            <ShareCardImage
              kicker="concrete.xyz · Quiz"
              headline={`${tier.emoji}`}
              headlineLabel={`${tier.label} · ${totalScore} correct`}
              stats={[
                { label: "This batch", value: `${correctCount}/${batch.questions.length}`, accent: true },
                { label: "All-time score", value: String(totalScore) },
                { label: "Tier", value: tier.label },
              ]}
              filename={`concrete-quiz-${batch.id}`}
            />
          )}

          {!isReviewMode && <ShareButtons text={shareText} />}

          <div className="mt-6 flex flex-wrap gap-2">
            {!isReviewMode && (
              <button
                type="button"
                onClick={() => startBatch(batch)}
                className="focus-ring border border-concreteMuted/40 bg-base px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab"
              >
                Retry this batch
              </button>
            )}
            <button
              type="button"
              onClick={backToBatches}
              className="focus-ring border border-steel bg-steel/10 px-3 py-1.5 text-xs font-medium text-steelBright transition-colors hover:bg-steel/20"
            >
              More batches
            </button>
            {!isReviewMode && batch.docHref && (
              <Link
                href={batch.docHref}
                className="focus-ring border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs text-brass transition-colors hover:bg-brass/20"
              >
                Review the doc ↗
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return null;
}

function buildShareText(batch: QuizBatch, correct: number, totalScore: number, isReviewMode: boolean): string {
  const tier = tierForScore(totalScore);
  if (isReviewMode) {
    return [
      `Cleared ${correct}/${batch.questions.length} weak spots on the Concrete Guide Quiz`,
      `Try it: ${SITE_URL}/tracker/quiz`,
    ].join("\n");
  }
  const lines = [
    `I scored ${correct}/${batch.questions.length} on "${batch.title}" — Concrete Guide Quiz`,
    `All-time: ${totalScore} correct · Tier: ${tier.emoji} ${tier.label}`,
    `Try it: ${SITE_URL}/tracker/quiz`,
  ];
  return lines.join("\n");
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-concreteMuted/30 bg-base px-4 py-3">
      <p className="font-mono text-[11px] uppercase tracking-wide text-inkMuted">{label}</p>
      <p className={`mt-1 text-xl ${accent ? "text-brass" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function BatchPicker({
  onStart,
  onStartReview,
  totalScore,
  weightedScore,
  bestByBatch,
  tierLabel,
  tierKey,
  progress,
  nextTierLabel,
  streak,
  unlockedBadges,
  weakSpotCount,
  speedModeSelected,
  onToggleSpeedMode,
  totalSpeedBonus,
  nameInput,
  onNameChange,
  lbRefresh,
}: {
  onStart: (b: QuizBatch) => void;
  onStartReview: () => void;
  totalScore: number;
  weightedScore: number;
  bestByBatch: Record<string, QuizResult>;
  tierLabel: string;
  tierKey: string;
  progress: number;
  nextTierLabel: string;
  streak: StreakState;
  unlockedBadges: Record<string, number>;
  weakSpotCount: number;
  speedModeSelected: boolean;
  onToggleSpeedMode: () => void;
  totalSpeedBonus: number;
  nameInput: string;
  onNameChange: (v: string) => void;
  lbRefresh: number;
}) {
  return (
    <section>
      <div className="mb-4 border border-concreteMuted/40 bg-surface px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-steelBright">Your quiz tier</p>
            <p className="text-xl text-ink">{tierLabel}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-inkMuted">All-time correct answers</p>
            <p className="text-xl text-brass">{totalScore}</p>
            <p className="text-xs text-inkMuted">{nextTierLabel}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden border border-concreteMuted/30 bg-base">
          <div
            className="h-full bg-brass transition-[width] duration-500"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-inkMuted">
          <span>
            🔥 Streak: <span className="text-brass">{streak.current} day{streak.current === 1 ? "" : "s"}</span>{" "}
            {streak.longest > streak.current && <span>(best {streak.longest})</span>}
          </span>
          <span>
            Weighted score: <span className="text-brass">{weightedScore}</span> pts
          </span>
          {totalSpeedBonus > 0 && (
            <span>
              ⏱️ Speed bonus earned: <span className="text-brass">{totalSpeedBonus}</span> pts
            </span>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5 border border-concreteMuted/30 bg-base px-4 py-3">
        {QUIZ_TIERS.map((t) => (
          <span
            key={t.key}
            className={`border px-2 py-1 text-[11px] ${
              t.key === tierKey
                ? "border-brass bg-brass/15 font-medium text-brass"
                : "border-concreteMuted/30 text-inkMuted opacity-70"
            }`}
            title={`${t.min}+ correct`}
          >
            {t.emoji} {t.label}
          </span>
        ))}
      </div>

      <QuizBadges unlocked={unlockedBadges} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-concreteMuted/30 bg-base px-4 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={speedModeSelected}
            onChange={onToggleSpeedMode}
            className="h-4 w-4 accent-brass"
          />
          ⏱️ Speed Mode — bonus points for fast correct answers, next batch
        </label>
        {weakSpotCount > 0 && (
          <button
            type="button"
            onClick={onStartReview}
            className="focus-ring border border-brass/50 bg-brass/10 px-3 py-1.5 text-xs font-medium text-brass transition-colors hover:bg-brass/20"
          >
            🔁 Review {weakSpotCount} weak spot{weakSpotCount === 1 ? "" : "s"}
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {QUIZ_BATCHES.map((b) => {
          const best = bestByBatch[b.id];
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onStart(b)}
              className="focus-ring flex flex-col items-start border border-concreteMuted/40 bg-surface px-5 py-4 text-left transition-colors hover:bg-slab"
            >
              <div className="mb-2 flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="border border-steel/40 bg-steel/10 px-1.5 py-0.5 text-[10px] font-medium text-steelBright">
                    LVL {b.level}
                  </span>
                  <h3 className="text-base text-ink">{b.title.replace(/^Level \d+ · /, "")}</h3>
                </div>
                {b.premium && (
                  <span className="shrink-0 border border-brass/50 bg-brass/10 px-2 py-0.5 text-[10px] font-medium text-brass">
                    🗿 PREMIUM
                  </span>
                )}
              </div>
              <p className="text-sm text-inkMuted">{b.tagline}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-inkMuted">
                <span>{b.questions.length} questions</span>
                <span>worth {weightForBatch(b.id)}pt each</span>
                {best && (
                  <span className="text-steelBright">
                    Best: {best.bestCorrect}/{b.questions.length}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-inkMuted">
        Score only counts correct answers — guessing wrong never subtracts, it just skips that point. Finish any
        batch to get a shareable tier card with a link back to {SITE_URL.replace(/^https?:\/\//, "")}.
      </p>

      <div className="mt-6 border border-concreteMuted/30 bg-base px-4 py-3">
        <label className="block font-mono text-[11px] uppercase tracking-wide text-inkMuted">
          Leaderboard name (optional)
        </label>
        <input
          value={nameInput}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={24}
          placeholder="Anonymous"
          className="focus-ring mt-1.5 w-full max-w-xs border border-concreteMuted/40 bg-surface px-3 py-1.5 text-sm text-ink placeholder:text-inkMuted/60"
        />
        <p className="mt-1.5 text-xs text-inkMuted">
          Shown next to your score on the global leaderboard below. Leave blank to stay anonymous.
        </p>
      </div>

      <QuizLeaderboard refreshKey={lbRefresh} />
    </section>
  );
}
