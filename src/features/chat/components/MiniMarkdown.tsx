/**
 * Web stand-in for `react-native-markdown-display` in the advisor bubble:
 * paragraphs, `- ` bullet lists and `**bold**`, with the bubble's Markdown
 * styles (14px brand-primary body, 20px line height, 8px paragraph gap).
 * Links are rendered as plain text — the server strips model URLs anyway.
 */
import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold text-brand-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function MiniMarkdown({ children }: { children: string }) {
  const blocks = children.trim().split(/\n{2,}/);
  return (
    <div style={{ overflowWrap: "anywhere" }}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^\s*-\s+/.test(l));
        const last = i === blocks.length - 1;
        if (isList) {
          return (
            <ul key={i} className="text-sm text-brand-primary" style={{ lineHeight: "20px", marginBottom: last ? 0 : 8, paddingLeft: 4 }}>
              {lines.map((l, j) => (
                <li key={j} className="flex-row" style={{ marginBottom: 2 }}>
                  <span style={{ marginRight: 6 }}>•</span>
                  <span className="flex-1">{inline(l.replace(/^\s*-\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm text-brand-primary" style={{ lineHeight: "20px", marginBottom: last ? 0 : 8 }}>
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}
