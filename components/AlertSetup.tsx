"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/siteConfig";
import { useVT } from "@/lib/vault/dictionary";

type VaultOption = {
  vaultAddress: string;
  name: string | null;
  chain?: string;
  sharePrice: number | null;
};

export default function AlertSetup({ vaults }: { vaults: VaultOption[] }) {
  const t = useVT();
  const priced = vaults.filter((v) => v.sharePrice !== null);
  const [selected, setSelected] = useState(priced[0]?.vaultAddress ?? "");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookFormat, setWebhookFormat] = useState<"raw" | "discord">("raw");
  const [notifStatus, setNotifStatus] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );
  const [browserAlertOn, setBrowserAlertOn] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef = useRef(false);

  const vault = priced.find((v) => v.vaultAddress === selected);

  useEffect(() => {
    if (!threshold && vault?.sharePrice != null) {
      setThreshold(vault.sharePrice.toFixed(6));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function buildCheckUrl(withWebhook: boolean) {
    if (!vault) return "";
    const params = new URLSearchParams({
      chain: vault.chain ?? "ethereum",
      vault: vault.vaultAddress,
      direction,
      threshold: threshold || "0",
    });
    if (withWebhook && webhookUrl) params.set("webhook", webhookUrl);
    if (withWebhook && webhookUrl && webhookFormat === "discord") params.set("format", "discord");
    return `${SITE_URL}/api/alert-check?${params.toString()}`;
  }

  async function checkOnce(): Promise<{ crossed: boolean; sharePrice: number } | null> {
    const url = buildCheckUrl(!!webhookUrl);
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      setLastCheck(new Date().toLocaleTimeString());
      if (typeof json.sharePrice === "number") {
        return { crossed: !!json.crossed, sharePrice: json.sharePrice };
      }
      return null;
    } catch {
      return null;
    }
  }

  async function enableBrowserAlert() {
    if (!("Notification" in window)) return;
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm !== "granted") return;

    setBrowserAlertOn(true);
    firedRef.current = false;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const result = await checkOnce();
      if (result?.crossed && !firedRef.current) {
        firedRef.current = true;
        new Notification(t("trAlNotifTitle"), {
          body: t(direction === "above" ? "trAlBodyAbove" : "trAlBodyBelow", {
            name: vault?.name ?? t("trAlVault"),
            thr: threshold,
            now: result.sharePrice.toFixed(6),
          }),
        });
      }
    }, 60_000);
  }

  function disableBrowserAlert() {
    setBrowserAlertOn(false);
    if (pollRef.current) clearInterval(pollRef.current);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt(t("trCopyManual"), text);
    }
  }

  if (priced.length === 0) return null;

  return (
    <section className="border border-concreteMuted/40 bg-surface">
      <header className="border-b border-concreteMuted/40 px-6 py-4">
        <h2 className="text-lg text-ink">{t("trAlTitle")}</h2>
        <p className="text-xs text-inkMuted">
          {t("trAlSub")}
        </p>
      </header>

      <div className="space-y-4 px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm text-inkMuted">{t("trAlVault")}</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2 text-sm text-ink"
            >
              {priced.map((v) => (
                <option key={v.vaultAddress} value={v.vaultAddress}>
                  {v.name ?? v.vaultAddress.slice(0, 10)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-inkMuted">{t("trAlDirection")}</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as "above" | "below")}
              className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2 text-sm text-ink"
            >
              <option value="above">{t("trAlAbove")}</option>
              <option value="below">{t("trAlBelow")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-inkMuted">
              {t("trAlThreshold")}
            </label>
            <input
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2 font-mono text-sm text-ink"
              placeholder="1.0250"
            />
          </div>
        </div>

        <div className="border-t border-concreteMuted/30 pt-4">
          <div className="mb-2 text-sm text-inkMuted">{t("trAlBrowser")}</div>
          <div className="flex flex-wrap items-center gap-2">
            {!browserAlertOn ? (
              <button
                type="button"
                onClick={enableBrowserAlert}
                disabled={notifStatus === "unsupported" || !threshold}
                className="focus-ring border border-steel bg-steel/10 px-3 py-1.5 text-xs font-medium text-steelBright transition-colors hover:bg-steel/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("trAlEnable")}
              </button>
            ) : (
              <button
                type="button"
                onClick={disableBrowserAlert}
                className="focus-ring border border-rust/50 bg-rust/10 px-3 py-1.5 text-xs font-medium text-rust transition-colors hover:bg-rust/20"
              >
                {t("trAlStop")}
              </button>
            )}
            {notifStatus === "denied" && (
              <span className="text-xs text-rust">
                {t("trAlBlocked")}
              </span>
            )}
            {notifStatus === "unsupported" && (
              <span className="text-xs text-inkMuted">
                {t("trAlUnsupported")}
              </span>
            )}
            {browserAlertOn && (
              <span className="text-xs text-inkMuted">
                {t("trAlChecking")}{lastCheck ? t("trAlLast", { time: lastCheck }) : ""}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-concreteMuted/30 pt-4">
          <div className="mb-2 text-sm text-inkMuted">
            {t("trAlWebhook")}
          </div>
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/…"
            className="focus-ring mb-2 w-full border border-concreteMuted/40 bg-base px-3 py-2 font-mono text-xs text-ink"
          />
          <div className="mb-2 flex items-center gap-2 text-xs text-inkMuted">
            <label htmlFor="webhook-format">{t("trAlFormat")}</label>
            <select
              id="webhook-format"
              value={webhookFormat}
              onChange={(e) => setWebhookFormat(e.target.value as "raw" | "discord")}
              className="focus-ring border border-concreteMuted/40 bg-base px-2 py-1 text-xs text-ink"
            >
              <option value="raw">{t("trAlFormatRaw")}</option>
              <option value="discord">{t("trAlFormatDiscord")}</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(buildCheckUrl(true))}
              disabled={!threshold}
              className="focus-ring border border-concreteMuted/40 bg-base px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("trAlCopyCron")}
            </button>
            <button
              type="button"
              onClick={() => checkOnce()}
              disabled={!threshold}
              className="focus-ring border border-concreteMuted/40 bg-base px-3 py-1.5 text-xs text-inkMuted transition-colors hover:bg-slab disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("trAlTestNow")}
            </button>
          </div>
          <p className="mt-2 text-xs text-inkMuted">
            {t("trAlCronNote")}
          </p>
        </div>

        <div className="border-t border-concreteMuted/30 pt-4">
          <div className="mb-1 text-sm text-inkMuted">{t("trAlTelegram")}</div>
          <p className="text-xs text-inkMuted">
            {t("trAlTelegramNote")}{" "}
            <a href="/developers#telegram" className="text-steelBright underline">
              {t("trAlTelegramLink")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
