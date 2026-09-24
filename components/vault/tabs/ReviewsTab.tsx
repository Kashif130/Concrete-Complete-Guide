"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getReviewClientId, getSavedReviewName, saveReviewName } from "@/lib/reviewsClient";
import { useVT } from "@/lib/vault/dictionary";
import { Panel, SectionTitle } from "../ui";
import { RiskScoreBadge } from "../RiskScoreBadge";
import type { TabProps } from "../types";

type ReviewRow = { name: string; vote: "up" | "down"; comment: string; updatedAt: number };
type Summary = {
  status: "ok" | "not_configured" | "error";
  message?: string;
  upvotes?: number;
  downvotes?: number;
  reviews?: ReviewRow[];
  yourReview?: ReviewRow | null;
};

export function ReviewsTab({ vault, vaults }: TabProps) {
  const v = useVT();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const clientId = typeof window !== "undefined" ? getReviewClientId() : "anon";

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ vaultId: vault.id, clientId, limit: "30" });
      const res = await fetch(`/api/vault-reviews?${params.toString()}`, { cache: "no-store" });
      const json: Summary = await res.json();
      setSummary(json);
      if (json.yourReview) {
        setVote(json.yourReview.vote);
        setComment(json.yourReview.comment);
      } else {
        setVote(null);
        setComment("");
      }
    } catch {
      setSummary({ status: "error", message: v("rvErrLoad") });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setName(getSavedReviewName());
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!vote) return;
    setSubmitting(true);
    setSubmitMsg(null);
    saveReviewName(name);
    try {
      const res = await fetch("/api/vault-reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vaultId: vault.id, clientId, vote, comment, name }),
      });
      const json = await res.json();
      if (json.status === "ok") {
        setSubmitMsg(v("rvSubmitted"));
        await load();
      } else {
        setSubmitMsg(json.message || v("rvErrSubmit"));
      }
    } catch {
      setSubmitMsg(v("rvErrSubmit"));
    } finally {
      setSubmitting(false);
    }
  }

  const notConfigured = summary?.status === "not_configured";
  const total = (summary?.upvotes ?? 0) + (summary?.downvotes ?? 0);
  const upPct = total > 0 ? Math.round(((summary?.upvotes ?? 0) / total) * 100) : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{v("rvTitle")}</h3>
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-inkfaint">{v("rvNote")}</p>
      </div>

      {notConfigured && (
        <Panel>
          <p className="text-xs text-inkfaint">{v("rvNotConfigured")}</p>
        </Panel>
      )}

      {!notConfigured && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {vaults.map((x) => (
              <div
                key={x.id}
                className="flex items-center justify-between rounded-sm border p-3"
                style={{ borderColor: x.id === vault.id ? x.color : "#C9C2B2", borderTopWidth: 2, borderTopColor: x.color }}
              >
                <div className="flex items-center gap-2">
                  <RiskScoreBadge vault={x} size="sm" showTooltip={false} />
                  <span className="font-display text-sm font-semibold text-ink">{x.short}</span>
                </div>
                {x.id === vault.id ? (
                  <span className="font-mono text-xs text-inkfaint">
                    {upPct !== null ? `👍 ${upPct}% (${total})` : v("rvNoVotes")}
                  </span>
                ) : (
                  <span className="text-[10px] text-inkfaint/70">{v("rvSwitchVault")}</span>
                )}
              </div>
            ))}
          </div>

          <Panel>
            <SectionTitle>{v("rvYourReview")}</SectionTitle>
            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVote("up")}
                  className={`focus-ring flex-1 rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
                    vote === "up" ? "border-[#2E7D5B] bg-[#2E7D5B]/10 text-[#2E7D5B]" : "border-line text-inkfaint hover:bg-paper2"
                  }`}
                >
                  👍 {v("rvUpvote")}
                </button>
                <button
                  type="button"
                  onClick={() => setVote("down")}
                  className={`focus-ring flex-1 rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
                    vote === "down" ? "border-rust bg-rust/10 text-rust" : "border-line text-inkfaint hover:bg-paper2"
                  }`}
                >
                  👎 {v("rvDownvote")}
                </button>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={v("rvNamePh")}
                maxLength={24}
                className="focus-ring w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={v("rvCommentPh")}
                maxLength={280}
                rows={3}
                className="focus-ring w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={!vote || submitting}
                  className="focus-ring rounded-sm border border-blueprint bg-blueprint px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-blueprint2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? v("rvSubmitting") : v("rvSubmit")}
                </button>
                {submitMsg && <span className="text-xs text-inkfaint">{submitMsg}</span>}
              </div>
            </form>
          </Panel>

          <Panel>
            <SectionTitle>{v("rvAllReviews", { n: String(summary?.reviews?.length ?? 0) })}</SectionTitle>
            {loading ? (
              <p className="mt-2 text-xs text-inkfaint">{v("loading")}</p>
            ) : summary?.reviews && summary.reviews.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {summary.reviews.map((r, i) => (
                  <li key={i} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">
                        {r.vote === "up" ? "👍" : "👎"} {r.name}
                      </span>
                      <span className="text-inkfaint">{new Date(r.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <p className="mt-1 text-sm text-ink/90">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-inkfaint">{v("rvNoReviews")}</p>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
