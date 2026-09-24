"use client";

import { useEffect, useState } from "react";
import { GAS_FALLBACK_GWEI } from "./tools";

export interface GasState {
  gwei: number;
  source: "live" | "simulated" | "loading";
}

const REFRESH_MS = 30_000;

/** Polls /api/gas every 30 s. Keeps the last good reading if a poll fails. */
export function useGas(): GasState {
  const [state, setState] = useState<GasState>({ gwei: GAS_FALLBACK_GWEI, source: "loading" });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/gas", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = (await res.json()) as { gwei: number; source: "live" | "simulated" };
        if (alive && Number.isFinite(d.gwei)) setState({ gwei: d.gwei, source: d.source });
      } catch {
        if (alive) setState((prev) => (prev.source === "loading" ? { gwei: GAS_FALLBACK_GWEI, source: "simulated" } : prev));
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return state;
}
