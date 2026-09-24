// Discord counterpart to lib/docsText.ts. Discord message content already
// understands **bold**, `code`, and [text](url) natively, so — unlike the
// Telegram HTML version — this barely needs to transform anything; its main
// job is turning blocks into lines and respecting Discord's 2000-char
// message length cap.
import type { DocBlock, DocEntry } from "@/content/docs.generated";
import type { Locale } from "./i18n";
import { blocksForLocale } from "./docsText";

const CHUNK_LIMIT = 1900; // stay under Discord's 2000-char message cap

function blockToText(block: DocBlock): string {
  switch (block.type) {
    case "heading":
      return `\n**${block.text}**`;
    case "p":
      return block.text;
    case "ul":
      return block.items.map((i) => `• ${i}`).join("\n");
    case "ol":
      return block.items.map((i, idx) => `${idx + 1}. ${i}`).join("\n");
    case "quote":
      return `*${block.text}*`;
    case "code":
      return "```" + (block.lang || "") + "\n" + block.code + "\n```";
    case "table": {
      const header = block.headers.join(" | ");
      const rows = block.rows.map((r) => r.join(" | "));
      return [`**${header}**`, ...rows].join("\n");
    }
    case "hr":
      return "────────";
    default:
      return "";
  }
}

export function renderDocToDiscordChunks(entry: DocEntry, locale: Locale): string[] {
  const blocks = blocksForLocale(entry, locale);
  const parts = [`**${entry.title}**`, ...blocks.map(blockToText)].filter(Boolean);

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
    while (current.length > CHUNK_LIMIT) {
      chunks.push(current.slice(0, CHUNK_LIMIT));
      current = current.slice(CHUNK_LIMIT);
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
