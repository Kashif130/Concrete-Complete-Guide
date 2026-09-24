// Shared heading-id generator. DocRenderer uses it to stamp ids on headings and the
// docs search (lib/docSearch.ts) uses it to deep-link to them, so the two must stay identical.
// Note: non-Latin headings (zh, hi…) slugify to "" — callers treat that as "no anchor".
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
