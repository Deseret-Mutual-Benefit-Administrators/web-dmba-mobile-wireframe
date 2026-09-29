/**
 * Stand-in for `chat/services/citations.ts`: one chip per destination topic
 * (ADR-183), each linking to the Coverage card it cites (ADR-174 §3).
 */
import type { Citation } from "../types";

export interface CitationChip {
  sectionId: string;
  title: string;
  href: string;
}

function subTabForCategory(category: string): string {
  return ["medical", "dental", "pharmacy"].includes(category) ? category : "medical";
}

export function toCitationChips(citations: Citation[]): CitationChip[] {
  const seen = new Set<string>();
  const chips: CitationChip[] = [];
  for (const c of citations) {
    if (seen.has(c.topicKey)) continue;
    seen.add(c.topicKey);
    chips.push({
      sectionId: c.sectionId,
      title: c.title,
      href: `/benefits?tab=coverage&sub=${subTabForCategory(c.category)}&topic=${encodeURIComponent(c.topicKey)}`,
    });
  }
  return chips;
}
