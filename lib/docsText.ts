// Turns a doc's DocBlock[] (same shape DocRenderer.tsx renders on the
// website) into plain text with Telegram's small HTML subset
// (https://core.telegram.org/bots/api#html-style), for the /docs command in
// the Telegram bot. Locale-aware: falls back to the English blocks for any
// doc that doesn't have a translation yet, same as the website does.
import type { DocBlock, DocEntry } from "@/content/docs.generated";
import { translations } from "@/content/translations";
import type { Locale } from "./i18n";

/** Telegram's message length cap is 4096 UTF-16 units; stay comfortably under it. */
const CHUNK_LIMIT = 3500;

export function blocksForLocale(entry: DocEntry, locale: Locale): DocBlock[] {
  const t = translations[entry.slug];
  return (t?.[locale] as DocBlock[] | undefined) ?? entry.blocks;
}

// Escape raw HTML first, then re-introduce Telegram's allowed tags from the
// doc's own lightweight markdown (**bold**, `code`, [text](url)) — in that
// order, so escaping never mangles the tags this function itself inserts.
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

function blockToText(block: DocBlock): string {
  switch (block.type) {
    case "heading":
      return `\n<b>${inline(block.text)}</b>`;
    case "p":
      return inline(block.text);
    case "ul":
      return block.items.map((i) => `• ${inline(i)}`).join("\n");
    case "ol":
      return block.items.map((i, idx) => `${idx + 1}. ${inline(i)}`).join("\n");
    case "quote":
      return `<i>${inline(block.text)}</i>`;
    case "code":
      return `<pre>${escapeHtml(block.code)}</pre>`;
    case "table": {
      const header = block.headers.map((h) => inline(h)).join(" | ");
      const rows = block.rows.map((r) => r.map((c) => inline(c)).join(" | "));
      return [`<b>${header}</b>`, ...rows].join("\n");
    }
    case "hr":
      return "────────";
    default:
      return "";
  }
}

/** Renders a doc into one or more Telegram-HTML message chunks, each under the length limit. */
export function renderDocToChunks(entry: DocEntry, locale: Locale): string[] {
  const blocks = blocksForLocale(entry, locale);
  const title = `<b>${escapeHtml(entry.title)}</b>`;
  const parts = [title, ...blocks.map(blockToText)].filter(Boolean);

  const chunks: string[] = [];
  let current = "";
  for (const part of parts) {
    const candidate = current ? `${current}\n\n${part}` : part;
    if (candidate.length > CHUNK_LIMIT && current) {
      chunks.push(current);
      current = part;
    } else {
      current = candidate;
    }
    // A single block (e.g. a long code sample) can itself exceed the limit —
    // hard-split it rather than send an oversized message Telegram will reject.
    while (current.length > CHUNK_LIMIT) {
      chunks.push(current.slice(0, CHUNK_LIMIT));
      current = current.slice(CHUNK_LIMIT);
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
