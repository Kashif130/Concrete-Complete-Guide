"use client";

import { useEffect, useState } from "react";
import { useVT } from "@/lib/vault/dictionary";

const DISMISS_KEY = "concrete-guide:pwa-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstallPrompt() {
  const v = useVT();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration can fail in dev/HTTP or unsupported browsers — the
        // site works fine without it, it just loses offline-shell/push.
      });
    }

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // ignore
    }
    if (dismissed) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  if (!visible || !deferred) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-sm border border-blueprint bg-paper p-4 shadow-lg sm:right-4 sm:left-auto">
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{v("pwaInstallTitle")}</p>
        <p className="mt-1 text-xs leading-relaxed text-inkfaint">{v("pwaInstallBody")}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={install}
            className="focus-ring rounded-sm border border-blueprint bg-blueprint px-3 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-blueprint2"
          >
            {v("pwaInstallCta")}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="focus-ring rounded-sm border border-line px-3 py-1.5 text-xs text-inkfaint transition-colors hover:bg-paper2"
          >
            {v("pwaInstallDismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
