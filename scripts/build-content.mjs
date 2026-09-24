import fs from "node:fs";
import path from "node:path";

const DOCS_ROOT = path.resolve(process.argv[2] || "../extracted/concrete-xyz-complete-guide/docs");
const OUT_FILE = path.resolve(process.argv[3] || "./content/docs.generated.ts");

const SECTION_META = {
  "01-beginner": { key: "beginner", order: 1 },
  "02-intermediate": { key: "intermediate", order: 2 },
  "03-advanced": { key: "advanced", order: 3 },
  "04-ecosystem": { key: "ecosystem", order: 4 },
  "05-reference": { key: "reference", order: 5 },
};

function slugifyLink(rawHref, currentSectionDir) {
  // Resolve relative .md links like ../02-intermediate/03-x.md#anchor to /docs/<section>/<doc>
  if (/^https?:\/\//.test(rawHref)) return { href: rawHref, external: true };
  const [pathPart, anchor] = rawHref.split("#");
  if (!pathPart) return { href: `#${anchor || ""}`, external: false };
  let resolved = path.normalize(path.join(currentSectionDir, pathPart));
  resolved = resolved.replace(/\\/g, "/");
  resolved = resolved.replace(/^\.\//, "");
  resolved = resolved.replace(/\.md$/, "");
  return { href: `/docs/${resolved}`, external: false };
}

function parseInlineLater(text) {
  return text; // inline formatting handled client-side by <Inline/>
}

function parseMarkdown(raw, currentSectionDir) {
  const lines = raw.split("\n");
  const blocks = [];
  let i = 0;

  function resolveLinksInText(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => {
      const r = slugifyLink(href.trim(), currentSectionDir);
      return `[${label}](${r.href})`;
    });
  }

  while (i < lines.length) {
    let line = lines[i];

    if (line.trim() === "") { i++; continue; }

    // fenced code block
    if (/^```/.test(line.trim())) {
      const lang = line.trim().replace(/^```/, "").trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    // heading
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: resolveLinksInText(headingMatch[2].trim()),
      });
      i++;
      continue;
    }

    // blockquote
    if (/^>/.test(line.trim())) {
      const quoteLines = [];
      while (i < lines.length && /^>/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: resolveLinksInText(quoteLines.join(" ")) });
      continue;
    }

    // table
    if (/^\|/.test(line.trim()) && lines[i + 1] && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/.test(lines[i + 1].trim())) {
      const headerCells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => resolveLinksInText(c.trim()));
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => resolveLinksInText(c.trim()));
        rows.push(cells);
        i++;
      }
      blocks.push({ type: "table", headers: headerCells, rows });
      continue;
    }

    // unordered list
    if (/^[-*]\s+/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(resolveLinksInText(lines[i].trim().replace(/^[-*]\s+/, "")));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(resolveLinksInText(lines[i].trim().replace(/^\d+\.\s+/, "")));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // horizontal rule
    if (/^-{3,}$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // paragraph (collect until blank line or next block start)
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^```/.test(lines[i].trim()) &&
      !/^>/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^\|/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      blocks.push({ type: "p", text: resolveLinksInText(paraLines.join(" ")) });
    } else {
      i++;
    }
  }

  return blocks;
}

const docs = [];
for (const sectionDir of fs.readdirSync(DOCS_ROOT).sort()) {
  const fullSectionDir = path.join(DOCS_ROOT, sectionDir);
  if (!fs.statSync(fullSectionDir).isDirectory()) continue;
  const meta = SECTION_META[sectionDir];
  if (!meta) continue;
  for (const file of fs.readdirSync(fullSectionDir).sort()) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(fullSectionDir, file), "utf8");
    const blocks = parseMarkdown(raw, sectionDir);
    const firstHeading = blocks.find((b) => b.type === "heading" && b.level === 1);
    const title = firstHeading ? firstHeading.text.replace(/^\d+\s*[·.-]\s*/, "") : file;
    const bodyBlocks = blocks.filter((b) => b !== firstHeading);
    const docSlug = file.replace(/\.md$/, "");
    docs.push({
      slug: `${sectionDir}/${docSlug}`,
      section: meta.key,
      _sectionOrder: meta.order,
      order: parseInt(docSlug.match(/^(\d+)/)?.[1] || "0", 10),
      title,
      blocks: bodyBlocks,
    });
  }
}

docs.sort((a, b) => a._sectionOrder - b._sectionOrder || a.order - b.order);
for (const d of docs) delete d._sectionOrder;

const out = `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
export type DocBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

export type DocEntry = {
  slug: string;
  section: string;
  order: number;
  title: string;
  blocks: DocBlock[];
};

export const docs: DocEntry[] = ${JSON.stringify(docs, null, 2)};
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, out, "utf8");
console.log(`Wrote ${docs.length} docs to ${OUT_FILE}`);
