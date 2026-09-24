"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  addEntry,
  computePnl,
  deleteEntry,
  getEntries,
  ledgerKey,
  type LedgerEntry,
  type LedgerEntryType,
} from "@/lib/ledger";
import { useVT } from "@/lib/vault/dictionary";

function fmt(n: number, symbol: string) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${symbol}`.trim();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function PositionLedger({
  wallet,
  vaultAddress,
  currentValue,
  symbol,
}: {
  wallet: string;
  vaultAddress: string;
  currentValue: number;
  symbol: string;
}) {
  const v = useVT();
  const key = ledgerKey(wallet, vaultAddress);
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [type, setType] = useState<LedgerEntryType>("deposit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setEntries(getEntries(key));
  }, [open, key]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    const ts = date ? new Date(date).getTime() : Date.now();
    setEntries(addEntry(key, { type, amount: n, ts, note: note.trim() || undefined }));
    setAmount("");
    setNote("");
  }

  function handleDelete(id: string) {
    setEntries(deleteEntry(key, id));
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring mt-2 border border-concreteMuted/40 px-2 py-1 text-[11px] text-inkMuted transition-colors hover:bg-slab"
      >
        {v("ledgerOpen")}
      </button>
    );
  }

  const pnl = computePnl(entries, currentValue);

  return (
    <div className="sm:col-span-3 mt-2 border-t border-concreteMuted/30 pt-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-inkMuted">{v("ledgerTitle")}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="focus-ring text-[11px] text-inkMuted underline"
        >
          {v("ledgerClose")}
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="mt-2 text-xs text-inkMuted">{v("ledgerEmpty")}</p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[11px] text-inkMuted">{v("ledgerDeposited")}</p>
              <p className="font-mono text-sm text-ink">{fmt(pnl.totalDeposited, symbol)}</p>
            </div>
            <div>
              <p className="text-[11px] text-inkMuted">{v("ledgerWithdrawn")}</p>
              <p className="font-mono text-sm text-ink">{fmt(pnl.totalWithdrawn, symbol)}</p>
            </div>
            <div>
              <p className="text-[11px] text-inkMuted">{v("ledgerUnrealized")}</p>
              <p className={`font-mono text-sm ${pnl.unrealizedPnl >= 0 ? "text-brass" : "text-rust"}`}>
                {pnl.unrealizedPnl >= 0 ? "+" : ""}
                {fmt(pnl.unrealizedPnl, symbol)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-inkMuted">{v("ledgerTotalPnl")}</p>
              <p className={`font-mono text-sm ${pnl.totalPnl >= 0 ? "text-brass" : "text-rust"}`}>
                {pnl.totalPnl >= 0 ? "+" : ""}
                {fmt(pnl.totalPnl, symbol)}
                {pnl.totalPnlPct !== null && (
                  <span className="ml-1 text-[11px] text-inkMuted">
                    ({pnl.totalPnlPct >= 0 ? "+" : ""}
                    {pnl.totalPnlPct.toFixed(1)}%)
                  </span>
                )}
              </p>
            </div>
          </div>

          <ul className="mt-3 space-y-1">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2 font-mono text-[11px] text-inkMuted">
                <span>
                  {new Date(e.ts).toLocaleDateString()} · {e.type === "deposit" ? v("ledgerDeposit") : v("ledgerWithdrawal")}{" "}
                  {fmt(e.amount, symbol)}
                  {e.note ? ` — ${e.note}` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(e.id)}
                  aria-label={v("ledgerDelete")}
                  className="focus-ring text-rust hover:underline"
                >
                  {v("ledgerDelete")}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <form onSubmit={handleAdd} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as LedgerEntryType)}
          className="focus-ring border border-concreteMuted/40 bg-base px-2 py-1.5 text-xs text-ink"
        >
          <option value="deposit">{v("ledgerDeposit")}</option>
          <option value="withdrawal">{v("ledgerWithdrawal")}</option>
        </select>
        <input
          type="number"
          min="0"
          step="any"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={v("ledgerAmountPh")}
          className="focus-ring border border-concreteMuted/40 bg-base px-2 py-1.5 font-mono text-xs text-ink"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayStr()}
          className="focus-ring border border-concreteMuted/40 bg-base px-2 py-1.5 text-xs text-ink"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={v("ledgerNotePh")}
          className="focus-ring border border-concreteMuted/40 bg-base px-2 py-1.5 text-xs text-ink sm:col-span-1"
        />
        <button
          type="submit"
          className="focus-ring border border-steel bg-steel/10 px-2 py-1.5 text-xs font-medium text-steelBright transition-colors hover:bg-steel/20"
        >
          {v("ledgerAdd")}
        </button>
      </form>
      <p className="mt-2 text-[10px] leading-relaxed text-inkMuted/80">{v("ledgerNote")}</p>
    </div>
  );
}
