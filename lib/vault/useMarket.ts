"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fallbackMarket, type Market } from "./data";

const REFRESH_MS = 60_000;

export function useMarket() {
  const [market, setMarket] = useState<Market | null>(null);
  const [syncedAt, setSyncedAt] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const alive = useRef(true);

  const load = useCallback(async (force = false) => {
    setRefreshing(true);
    try {
      // `t` busts the CDN cache when the user presses Refresh
      const res = await fetch(force ? `/api/market?t=${Date.now()}` : "/api/market", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Market;
      if (alive.current) setMarket(data);
    } catch {
      // Keep the last good snapshot; only fall back to simulated data on the very first load.
      if (alive.current) setMarket((prev) => prev ?? fallbackMarket("simulated"));
    } finally {
      if (alive.current) {
        setSyncedAt(new Date());
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    load();
    const id = setInterval(() => load(), REFRESH_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [load]);

  return { market, syncedAt, refreshing, refresh: () => load(true) };
}
