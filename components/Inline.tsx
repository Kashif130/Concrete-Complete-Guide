import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN_RE = /(\*\*.+?\*\*|`.+?`|\[.+?\]\(.+?\)|\*[^*]+?\*)/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN_RE).filter((p) => p !== "");

  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (/^\*\*.+\*\*$/.test(part)) {
          return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
        }
        if (/^`.+`$/.test(part)) {
          return (
            <code key={i} className="rounded-sm bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-blueprint2">
              {part.slice(1, -1)}
            </code>
          );
        }
        const linkMatch = part.match(/^\[(.+)\]\((.+)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const isInternal = href.startsWith("/docs/");
          if (isInternal) {
            return (
              <Link key={i} href={href} className="text-blueprint underline decoration-blueprint/40 underline-offset-2 hover:decoration-rebar">
                {label}
              </Link>
            );
          }
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-blueprint underline decoration-blueprint/40 underline-offset-2 hover:decoration-rebar"
            >
              {label}
            </a>
          );
        }
        if (/^\*[^*]+\*$/.test(part)) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
