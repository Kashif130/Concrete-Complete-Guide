"use client";

import { useCallback, useState } from "react";

// Tabs unmount when you switch away, which would wipe typed-in figures (e.g. rebalancer holdings).
// This keeps them in memory for the life of the page — deliberately not in localStorage, since
// they're financial inputs. A reload starts fresh.
const memo = new Map<string, unknown>();

export function useTabState<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => (memo.has(key) ? (memo.get(key) as T) : initial));
  const set = useCallback(
    (next: T | ((prev: T) => T)) =>
      setVal((prev) => {
        const n = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        memo.set(key, n);
        return n;
      }),
    [key],
  );
  return [val, set] as const;
}
