"use client";

// Personal deposit/withdrawal ledger, entered by hand and kept in
// localStorage only — same rationale as lib/snapshots.ts: this app has no
// way to see your actual on-chain deposit/withdrawal history (that would
// need indexing every vault's Transfer/Deposit events per wallet, which
// isn't wired up), so instead of faking a history, it lets you log the
// real amounts you remember and computes PnL against the live position
// value already on screen. Local to this browser/device only.

export type LedgerEntryType = "deposit" | "withdrawal";

export type LedgerEntry = {
  id: string;
  ts: number; // when the deposit/withdrawal happened (user-entered date)
  type: LedgerEntryType;
  amount: number;
  note?: string;
};

const STORAGE_KEY = "concrete-tracker:ledger";

function readAll(): Record<string, LedgerEntry[]> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, LedgerEntry[]>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full/unavailable — the ledger is a nice-to-have, fail silently.
  }
}

/** One ledger per wallet+vault pair so positions never mix histories. */
export function ledgerKey(wallet: string, vaultAddress: string): string {
  return `${wallet.toLowerCase()}:${vaultAddress.toLowerCase()}`;
}

export function getEntries(key: string): LedgerEntry[] {
  const entries = readAll()[key] ?? [];
  return [...entries].sort((a, b) => a.ts - b.ts);
}

export function addEntry(
  key: string,
  entry: Omit<LedgerEntry, "id">
): LedgerEntry[] {
  const all = readAll();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const list = all[key] ?? [];
  list.push({ ...entry, id });
  all[key] = list;
  writeAll(all);
  return getEntries(key);
}

export function deleteEntry(key: string, id: string): LedgerEntry[] {
  const all = readAll();
  all[key] = (all[key] ?? []).filter((e) => e.id !== id);
  writeAll(all);
  return getEntries(key);
}

export type PnlSummary = {
  totalDeposited: number;
  totalWithdrawn: number;
  netContributed: number;
  currentValue: number;
  /** Gain/loss still sitting in the position (current value vs. net principal still in). */
  unrealizedPnl: number;
  /** Gain/loss already taken out (withdrawals beyond what they cost to fund). */
  realizedPnl: number;
  /** unrealizedPnl + realizedPnl — lifetime profit/loss across the whole ledger. */
  totalPnl: number;
  /** totalPnl as a % of totalDeposited, or null if nothing was ever deposited. */
  totalPnlPct: number | null;
};

export function computePnl(entries: LedgerEntry[], currentValue: number): PnlSummary {
  let totalDeposited = 0;
  let totalWithdrawn = 0;
  for (const e of entries) {
    if (e.type === "deposit") totalDeposited += e.amount;
    else totalWithdrawn += e.amount;
  }
  const netContributed = totalDeposited - totalWithdrawn;
  const totalPnl = currentValue + totalWithdrawn - totalDeposited;
  const unrealizedPnl = currentValue - Math.max(netContributed, 0);
  const realizedPnl = totalPnl - unrealizedPnl;
  return {
    totalDeposited,
    totalWithdrawn,
    netContributed,
    currentValue,
    unrealizedPnl,
    realizedPnl,
    totalPnl,
    totalPnlPct: totalDeposited > 0 ? (totalPnl / totalDeposited) * 100 : null,
  };
}
