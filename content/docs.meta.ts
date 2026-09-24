// The ONE place that says "the guide's facts were last checked on …".
//
// The help bot no longer keeps its own copy of fees / withdrawal times / points status (that
// used to be duplicated in 6 languages inside lib/helpBot.ts and silently went stale). It reads
// them from the docs instead. So after you re-check the guide against concrete.xyz /
// app.concrete.xyz, bump this date — the bot shows it under its answers, and adds an
// "may be out of date" note once it is older than DOCS_STALE_AFTER_DAYS.
export const DOCS_LAST_VERIFIED = "2026-09-20"; // YYYY-MM-DD
export const DOCS_STALE_AFTER_DAYS = 60;

export function docsAreStale(now: number = Date.now()): boolean {
  const t = Date.parse(`${DOCS_LAST_VERIFIED}T00:00:00Z`);
  if (Number.isNaN(t)) return false;
  return (now - t) / 86_400_000 > DOCS_STALE_AFTER_DAYS;
}
