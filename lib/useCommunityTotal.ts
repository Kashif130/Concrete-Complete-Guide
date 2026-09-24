"use client";

import { useCallback, useEffect, useState } from "react";

export type CommunityTotal = {
  status: "ok" | "not_configured" | "error";
  totalPoints?: number;
  usersRead?: number;
  totalUsers?: number | null;
  calculatedAt?: string | null;
  complete?: boolean;
  message?: string;
};

// One shared request per page load, even if several estimators mount.
let inflight: Promise<CommunityTotal> | null = null;

function fetchTotal(force: boolean): Promise<CommunityTotal> {
  if (!inflight || force) {
    inflight = fetch("/api/points/total")
      .then((r) => r.json() as Promise<CommunityTotal>)
      .catch(
        (e): CommunityTotal => ({
          status: "error",
          message: e instanceof Error ? e.message : "Couldn't load community total.",
        })
      );
  }
  return inflight;
}

export function useCommunityTotal() {
  const [data, setData] = useState<CommunityTotal | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((force = false) => {
    setLoading(true);
    fetchTotal(force).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return { data, loading, reload: () => load(true) };
}
