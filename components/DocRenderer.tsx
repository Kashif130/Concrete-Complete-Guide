import type { DocBlock } from "@/content/docs.generated";
import { Inline } from "./Inline";
import { slugify } from "@/lib/slugify";

const headingSizes: Record<number, string> = {
  1: "text-3xl md:text-4xl",
  2: "text-2xl md:text-3xl mt-12",
  3: "text-xl md:text-2xl mt-8",
  4: "text-lg mt-6",
};

export function DocRenderer({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="doc-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const Tag = (`h${Math.min(block.level, 4)}` as unknown) as "h1" | "h2" | "h3" | "h4";
            return (
              <Tag
                key={i}
                id={slugify(block.text.replace(/\*\*|\*|`/g, ""))}
                className={`font-display font-medium text-ink ${headingSizes[block.level] ?? "text-lg"} scroll-mt-24`}
              >
                <Inline text={block.text} />
              </Tag>
            );
          }
          case "p":
            return (
              <p key={i} className="mt-4 leading-relaxed text-ink/90">
                <Inline text={block.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-5 marker:text-rebar">
                {block.items.map((item, j) => (
                  <li key={j} className="leading-relaxed text-ink/90">
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-4 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-rebar">
                {block.items.map((item, j) => (
                  <li key={j} className="leading-relaxed text-ink/90">
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i} className="mt-5 border-l-4 border-rebar bg-rebar/5 px-4 py-3 text-sm text-inkfaint">
                <Inline text={block.text} />
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} className="mt-4 overflow-x-auto rounded-sm bg-blueprint2 p-4 text-sm text-paper">
                <code className="font-mono">{block.code}</code>
              </pre>
            );
          case "table":
            return (
              <div key={i} className="mt-5 overflow-x-auto rounded-sm border border-line">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blueprint text-paper">
                      {block.headers.map((h, j) => (
                        <th key={j} className="border-b border-line px-3 py-2 text-left font-display font-medium">
                          <Inline text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-paper" : "bg-paper2"}>
                        {row.map((cell, k) => (
                          <td key={k} className="border-b border-line/60 px-3 py-2 align-top text-ink/90">
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "hr":
            return <hr key={i} className="my-8 border-line" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
