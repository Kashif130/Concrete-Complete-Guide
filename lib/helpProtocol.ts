// Types shared by the help bot's client (components/HelpChatBot.tsx) and server (app/api/help/*).

import type { Locale } from "./i18n";

export type TopicId = "what" | "deposit" | "withdraw" | "fees" | "risks" | "points" | "tools";
/** Topics answered from the guide by the server. ("tools" is a static site-features answer.) */
export type DocTopicId = Exclude<TopicId, "tools">;

export const HELP_LIMITS = {
  question: 300, // chars
  turn: 600, // chars per history turn sent to the model
  history: 6, // turns
} as const;

export type HelpTurn = { role: "user" | "assistant"; text: string };

export type HelpRequest = {
  q?: string;
  topic?: DocTopicId;
  lang: Locale;
  history?: HelpTurn[];
};

/** A guide page (and section) an answer was based on. */
export type HelpSource = {
  slug: string;
  title: string;
  heading: string;
  /** Heading id per language; the client picks the one matching the site's language. */
  anchors: Partial<Record<Locale, string>>;
};

/**
 * llm       – answered by Claude from retrieved guide sections
 * none      – nothing relevant in the guide (client shows "not found")
 * blocked   – the message looked like a seed phrase / private key and was NOT processed
 * fallback  – AI unavailable (no key, budget, rate limit, upstream error): client runs its local search
 */
export type HelpMode = "llm" | "none" | "blocked" | "fallback";

/** Newline-delimited JSON events streamed by POST /api/help. */
export type StreamEvent =
  | { t: "meta"; qid: string; mode: HelpMode; sources: HelpSource[]; verifiedAt: string; stale: boolean }
  | { t: "delta"; d: string }
  | { t: "end"; advice: boolean; unanswered: boolean; reason?: "seed" | "nohits" | "unavailable" }
  | { t: "error"; code: "upstream" | "internal" };

export type FeedbackRequest = {
  kind: "vote" | "unanswered";
  vote?: "up" | "down";
  lang: Locale;
  /** "local" = answered by the in-browser fallback search. */
  mode: HelpMode | "local";
  q?: string;
  slugs?: string[];
  topic?: string;
};
