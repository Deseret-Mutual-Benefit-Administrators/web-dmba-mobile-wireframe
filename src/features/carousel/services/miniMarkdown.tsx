import type { CSSProperties, ReactNode } from "react";
import { colors } from "@/src/shared/theme/colors";

/**
 * A tiny Markdown renderer for the article body — headings (#, ##, ###),
 * paragraphs, **bold**, *italic*, numbered and bulleted lists. Stands in for
 * react-native-markdown-display (the wireframe adds no dependencies). Styles
 * follow the app's `markdownStyles` map. Links render as plain styled text.
 */

const body: CSSProperties = { color: colors.brand.primary, fontSize: 15, lineHeight: "24px" };
const h1: CSSProperties = { color: colors.brand.primary, fontSize: 22, fontWeight: 700, marginTop: 20, marginBottom: 8, lineHeight: "28px" };
const h2: CSSProperties = { color: colors.brand.primary, fontSize: 19, fontWeight: 700, marginTop: 18, marginBottom: 6, lineHeight: "26px" };
const h3: CSSProperties = { color: colors.brand.primary, fontSize: 16, fontWeight: 600, marginTop: 14, marginBottom: 4 };
const paragraph: CSSProperties = { marginBottom: 12, lineHeight: "24px" };
const list: CSSProperties = { marginBottom: 12, paddingLeft: 24 };
const listItem: CSSProperties = { marginBottom: 4, lineHeight: "22px" };

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} style={{ fontWeight: 700, color: colors.brand.primary }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) return <span key={i} style={{ color: colors.brand.accent, textDecoration: "underline" }}>{link[1]}</span>;
    return part;
  });
}

export function MiniMarkdown({ children }: { children: string }) {
  const blocks = children.trim().split(/\n\s*\n/);
  return (
    <div style={body}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("### ")) return <h3 key={i} style={h3}>{inline(block.slice(4))}</h3>;
        if (block.startsWith("## ")) return <h2 key={i} style={h2}>{inline(block.slice(3))}</h2>;
        if (block.startsWith("# ")) return <h1 key={i} style={h1}>{inline(block.slice(2))}</h1>;
        if (lines.every((l) => /^\d+\.\s/.test(l)))
          return (
            <ol key={i} style={{ ...list, listStyle: "decimal" }}>
              {lines.map((l, j) => <li key={j} style={{ ...listItem, display: "list-item" }}>{inline(l.replace(/^\d+\.\s/, ""))}</li>)}
            </ol>
          );
        if (lines.every((l) => /^[-*]\s/.test(l)))
          return (
            <ul key={i} style={{ ...list, listStyle: "disc" }}>
              {lines.map((l, j) => <li key={j} style={{ ...listItem, display: "list-item" }}>{inline(l.slice(2))}</li>)}
            </ul>
          );
        return <p key={i} style={paragraph}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}
