"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/siteConfig";
import { useVT } from "@/lib/vault/dictionary";

// No API exists for "has $CT launched yet", so — same idea as AlertSetup's
// vault price alerts — this polls a stateless endpoint (/api/ct-check) that
// hashes the key text of concretefoundation.xyz and tells us if it differs
// from the last hash we saw. The baseline hash is kept in localStorage (not
// a financial input, just a change-detection fingerprint, so unlike the
// rebalancer's typed figures it's fine to persist).
const STORAGE_KEY = "concrete_ct_watch_hash";

export default function CtLaunchWatcher() {
  const t = useVT();
  const [notifStatus, setNotifStatus] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );
  const [watching, setWatching] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<"unknown" | "same" | "changed">("unknown");
  const [webhookUrl, setWebhookUrl] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function getKnownHash(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setKnownHash(hash: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, hash);
    } catch {
      // ignore — worst case it re-checks against nothing next visit
    }
  }

  function buildCheckUrl(withWebhook: boolean, knownHash: string | null) {
    const params = new URLSearchParams();
    if (knownHash) params.set("knownHash", knownHash);
    if (withWebhook && webhookUrl) params.set("webhook", webhookUrl);
    const qs = params.toString();
    return `${SITE_URL}/api/ct-check${qs ? `?${qs}` : ""}`;
  }

  async function checkOnce(withWebhook: boolean): Promise<{ changed: boolean; hash: string } | null> {
    const known = getKnownHash();
    try {
      const res = await fetch(buildCheckUrl(withWebhook, known), { cache: "no-store" });
      const json = await res.json();
      setLastCheck(new Date().toLocaleTimeString());
      if (typeof json.hash !== "string") return null;

      if (!known) {
        // First-ever check on this browser: nothing to compare against yet,
        // so save this as the baseline rather than reporting "changed".
        setKnownHash(json.hash);
        setLastResult("same");
        return { changed: false, hash: json.hash };
      }
      setLastResult(json.changed ? "changed" : "same");
      if (json.changed) setKnownHash(json.hash);
      return { changed: !!json.changed, hash: json.hash };
    } catch {
      return null;
    }
  }

  async function enableWatch() {
    if (!("Notification" in window)) return;
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm !== "granted") return;

    setWatching(true);
    firedRef.current = false;
    // Seed the baseline immediately so we don't wait 60s for it.
    await checkOnce(false);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const result = await checkOnce(false);
      if (result?.changed && !firedRef.current) {
        firedRef.current = true;
        new Notification(t("trCwNotifTitle"), { body: t("trCwNotifBody") });
      }
    }, 60_000);
  }

  function disableWatch() {
    setWatching(false);
    if (pollRef.current) clearInterval(pollRef.current);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt(t("trCopyManual"), text);
    }
  }

  return (
    <section className="border border-concreteMuted/40 bg-surface">
      <header className="border-b border-concreteMuted/40 px-6 py-4">
        <h2 className="text-lg text-ink">{t("trCwTitle")}</h2>
        <p className="text-xs text-inkMuted">{t("trCwSub")}</p>
      </header>

      <div className="space-y-4 px-6 py-5">
        <div>
          <div className="mb-2 text-sm text-inkMuted">{t("trCwBrowser")}</div>
          <div className="flex flex-wrap items-center gap-2">
            {!watching ? (
              <button
                type="button"
                onClick={enableWatch}
                disabled={notifStatus === "unsupported"}
                className="focus-ring border border-steel bg-steel/10 px-3 py-1.5 text-xs font-medium text-steelBright transition-colors hover:bg-steel/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("trCwEnable")}
              </button>
            ) : (
              <button
                type="button"
                onClick={disableWatch}
                className="focus-ring border border-rust/50 bg-rust/10 px-3 py-1.5 text-xs font-medium text-rust transition-colors hover:bg-rust/20"
              >
                {t("trCwStop")}
              </button>
            )}
            {notifStatus === "denied" && (
              <span className="text-xs text-rust">{t("trAlBlocked")}</span>
            )}
            {notifStatus === "unsupported" && (
              <span className="text-xs text-inkMuted">{t("trAlUnsupported")}</span>
            )}
            {watching && (
              <span className="text-xs text-inkMuted">
                {t("trCwChecking")}
                {lastCheck ? t("trCwLast", { time: lastCheck }) : ""}
              </span>
            )}
          </div>
          {watching && lastResult !== "unknown" && (
            <p className="mt-1 text-xs text-inkMuted">
              {lastResult === "changed" ? t("trCwChanged") : t("trCwBaseline")}
            </p>
          )}
        </div>

        <div className="border-t border-concreteMuted/30 pt-4">
          <div className="mb-2 text-sm text-inkMuted">{t("trCwWebhook")}</div>
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/…"
            className="focus-ring mb-2 w-full border border-concreteMuted/40 bg-base px-3 py-2 font-mono text-xs text-ink"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(buildCheckUrl(true, getKnownHash()))}
              className="focus-ring border border-concreteMuted/40 bg-base px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab"
            >
              {t("trCwCopyCron")}
            </button>
            <button
              type="button"
              onClick={() => checkOnce(true)}
              className="focus-ring border border-concreteMuted/40 bg-base px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab"
            >
              {t("trCwTestNow")}
            </button>
          </div>
          <p className="mt-2 text-xs text-inkMuted">{t("trCwCronNote")}</p>
        </div>
      </div>
    </section>
  );
}
