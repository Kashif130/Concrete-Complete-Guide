"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { KNOWN_VAULTS } from "@/lib/knownVaults";
import { isAddress } from "viem";
import { useVT } from "@/lib/vault/dictionary";

export type FormValues = {
  wallets: string[];
  mode: "manual" | "scan";
  chain: string; // used in manual mode
  chains: string[]; // used in scan mode
  vaults: string; // used in manual mode
};

const STORAGE_KEY = "concrete-tracker:last-form";

// Real vault addresses — Ethereum's is the ctDefiUSDT vault, read directly
// off app.concrete.xyz/earn's own "Live" listing; Arbitrum's is sourced
// from Concrete's own official SDK docs (see lib/knownVaults.ts for the
// full explanation of each). No live vault is currently listed on Base, so
// that field is left blank on purpose rather than guessed — paste your own.
const EXAMPLE_VAULTS: Record<string, string> = {
  ethereum: "0x0e609b710da5e0aa476224b6c0e5445ccc21251e",
  arbitrum: "0xE2d8267D285a7ae1eDf48498fF044241d04e9608",
  base: "",
};

const CHAINS = [
  { key: "ethereum", label: "Ethereum" },
  { key: "arbitrum", label: "Arbitrum" },
  { key: "base", label: "Base" },
];

function parseWallets(raw: string): string[] {
  return raw
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);
}

export default function WalletForm({
  onSubmit,
  loading,
  variant = "positions",
  submitLabel,
  autoRun = false,
}: {
  onSubmit: (values: FormValues) => void;
  loading: boolean;
  /** "points" hides the vault/chain fields (balance + airdrop pages). */
  variant?: "positions" | "points";
  submitLabel?: string;
  /** Auto-submit once if a wallet was saved from a previous visit. */
  autoRun?: boolean;
}) {
  const v = useVT();
  const showVaultFields = variant === "positions";
  const [walletInput, setWalletInput] = useState("");
  const [csvError, setCsvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"manual" | "scan">("manual");
  const [chain, setChain] = useState("ethereum");
  const [chains, setChains] = useState<string[]>(["ethereum", "arbitrum"]);
  const [vaults, setVaults] = useState(EXAMPLE_VAULTS.ethereum);

  // Restore the last-used form on load so you don't have to retype a
  // wallet address every visit. Stored locally in this browser only.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<FormValues> & {
        walletInput?: string;
      };
      if (saved.walletInput) setWalletInput(saved.walletInput);
      if (saved.mode) setMode(saved.mode);
      if (saved.chain) setChain(saved.chain);
      if (saved.chains) setChains(saved.chains);
      if (saved.vaults) setVaults(saved.vaults);
      if (autoRun && saved.walletInput && parseWallets(saved.walletInput).length > 0) {
        onSubmit({
          wallets: parseWallets(saved.walletInput),
          mode: saved.mode ?? "manual",
          chain: saved.chain ?? "ethereum",
          chains: saved.chains ?? ["ethereum", "arbitrum"],
          vaults: saved.vaults ?? EXAMPLE_VAULTS.ethereum,
        });
      }
    } catch {
      // ignore malformed/unavailable storage
    }
  }, []);

  function handleChainChange(nextChain: string) {
    setChain(nextChain);
    setVaults(EXAMPLE_VAULTS[nextChain] ?? "");
  }

  function toggleScanChain(key: string) {
    setChains((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-uploading the same file later
    if (!file) return;
    setCsvError(null);
    try {
      const text = await file.text();
      // Address-agnostic parsing: pull every 0x-prefixed 40-hex-char token
      // out of the file, regardless of whether it's one-per-line, a CSV
      // column, or has a header row/labels mixed in.
      const matches = text.match(/0x[a-fA-F0-9]{40}/g) ?? [];
      const validAddrs = matches.filter((a) => isAddress(a));
      if (validAddrs.length === 0) {
        setCsvError(v("trCsvNone"));
        return;
      }
      const existing = parseWallets(walletInput);
      const merged = Array.from(
        new Set([...existing, ...validAddrs.map((a) => a.toLowerCase())])
      );
      setWalletInput(merged.join(", "));
    } catch {
      setCsvError(v("trCsvFail"));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values: FormValues = {
      wallets: parseWallets(walletInput),
      mode,
      chain,
      chains,
      vaults,
    };
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ walletInput, mode, chain, chains, vaults })
      );
    } catch {
      // ignore
    }
    onSubmit(values);
  }

  const isCompare = parseWallets(walletInput).length > 1;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 border border-concreteMuted/40 bg-surface p-6 sm:grid-cols-[2fr_1fr]"
    >
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm text-inkMuted">
          {isCompare ? v("trWalletLabelMulti") : v("trWalletLabel")}
        </label>
        <input
          required
          value={walletInput}
          onChange={(e) => setWalletInput(e.target.value)}
          placeholder={v("trWalletPlaceholder")}
          className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2.5 font-mono text-sm text-ink placeholder:text-inkMuted/60"
        />
        <div className="mt-1.5 flex items-center gap-2 text-xs text-inkMuted">
          <span>{v("trOr")}</span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="focus-ring border border-concreteMuted/40 px-2 py-1 text-inkMuted transition-colors hover:bg-slab"
          >
            {v("trUploadCsv")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={handleCsvUpload}
            className="hidden"
          />
          {csvError && <span className="text-rust">{csvError}</span>}
        </div>
      </div>

      {showVaultFields && (
      <div className="sm:col-span-2 flex gap-4 text-sm">
        <label className="flex items-center gap-1.5 text-inkMuted">
          <input
            type="radio"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          {v("trModeManual")}
        </label>
        <label className="flex items-center gap-1.5 text-inkMuted">
          <input
            type="radio"
            checked={mode === "scan"}
            onChange={() => setMode("scan")}
          />
          {v("trModeScan")}
        </label>
      </div>

      )}

      {showVaultFields && (mode === "manual" ? (
        <>
          <div>
            <label className="mb-1.5 block text-sm text-inkMuted">{v("trChain")}</label>
            <select
              value={chain}
              onChange={(e) => handleChainChange(e.target.value)}
              className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2.5 text-sm text-ink"
            >
              {CHAINS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-start-1">
            <label className="mb-1.5 block text-sm text-inkMuted">
              {v("trVaultAddrs")}
            </label>
            <input
              required
              value={vaults}
              onChange={(e) => setVaults(e.target.value)}
              placeholder={
                chain === "base"
                  ? v("trVaultPhBase")
                  : "0xabc…, 0xdef…"
              }
              className="focus-ring w-full border border-concreteMuted/40 bg-base px-3 py-2.5 font-mono text-sm text-ink placeholder:text-inkMuted/60"
            />
            <p className="mt-1.5 text-xs text-inkMuted">
              {EXAMPLE_VAULTS[chain] ? v("trVaultExample") : v("trVaultNoExample")}
            </p>
          </div>
        </>
      ) : (
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm text-inkMuted">
            {v("trChainsToScan")}
          </label>
          <div className="flex flex-wrap gap-4 text-sm">
            {CHAINS.map((c) => (
              <label
                key={c.key}
                className="flex items-center gap-1.5 text-inkMuted"
              >
                <input
                  type="checkbox"
                  checked={chains.includes(c.key)}
                  onChange={() => toggleScanChain(c.key)}
                  disabled={KNOWN_VAULTS[c.key as keyof typeof KNOWN_VAULTS]?.length === 0}
                />
                {c.label}
                {KNOWN_VAULTS[c.key as keyof typeof KNOWN_VAULTS]?.length === 0 &&
                  v("trNoneKnown")}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-inkMuted">
            {v("trScanNote")}
          </p>
        </div>
      ))}

      <div className="flex items-end sm:col-start-2">
        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full border border-steel bg-steel/10 px-4 py-2.5 text-sm font-medium text-steelBright transition-colors hover:bg-steel/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? v("trReading")
            : submitLabel ?? (showVaultFields ? v("trPositionsSubmit") : v("trCheck"))}
        </button>
      </div>
    </form>
  );
}
