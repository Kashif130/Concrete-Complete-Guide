// Chip topics → the guide page that answers them. No facts live here: the answer text comes from the
// page itself (through Claude, or through the client's docs search when the AI is unavailable).

import type { DocTopicId } from "@/lib/helpProtocol";
import { TOPIC_PAGES } from "@/lib/helpBot";

export const TOPIC_DOCS: Record<DocTopicId, { slug: string; query: string; question: string }> = {
  what: {
    slug: TOPIC_PAGES.what,
    query: "one paragraph answer vault share token yield",
    question: "What is Concrete and how does it work? Keep it to a few sentences.",
  },
  deposit: {
    slug: TOPIC_PAGES.deposit,
    query: "deposit flow connect wallet approve checklist",
    question: "How do I deposit into a Concrete vault? Give the steps and what to check first.",
  },
  withdraw: {
    slug: TOPIC_PAGES.withdraw,
    query: "withdrawal depends vault atomic queued epoch pre-deposit cooldown",
    question: "How do withdrawals work? Summarize the withdrawal models and what to know before depositing.",
  },
  fees: {
    slug: TOPIC_PAGES.fees,
    query: "fee menu deposit withdrawal management performance cooldown paid in shares",
    question: "What fees can a Concrete vault charge, and how are they paid?",
  },
  risks: {
    slug: TOPIC_PAGES.risks,
    query: "risks smart-contract loss mechanics share price position sizing",
    question: "What are the main risks of using Concrete vaults?",
  },
  points: {
    slug: TOPIC_PAGES.points,
    query: "points program phase 1 bags CT token official",
    question: "What is the Concrete points program and the $CT token? Say what is confirmed and what is not announced.",
  },
};

export const DOC_TOPIC_IDS = Object.keys(TOPIC_DOCS) as DocTopicId[];
export function isDocTopic(v: unknown): v is DocTopicId {
  return typeof v === "string" && (DOC_TOPIC_IDS as string[]).includes(v);
}
