/**
 * Local stand-ins for the parts of the app's `benefitsTarget.ts` the ported
 * components call. The extract does not include the service.
 */
import { COVERAGE_SUB_TABS, type BenefitCategoryGroup, type BenefitTopicSummary, type CoverageSubTab } from "../types";

const KNOWN_KINDS = ["whatItIs", "needToKnow", "limitations", "planComparisonNote", "planFacts"];

/** i18n key for a section kind's label; an unknown kind reads "Details". */
export function sectionKindLabelKey(kind: string): string {
  return KNOWN_KINDS.includes(kind) ? `benefits.sectionKind.${kind}` : "benefits.sectionKind.details";
}

export function parseBenefitsTargetParams(params: { sub?: string | null; topic?: string | null }): {
  sub: CoverageSubTab | undefined;
  topicKey: string | undefined;
} {
  const sub = COVERAGE_SUB_TABS.find((s) => s === params.sub);
  const topicKey = params.topic && params.topic.trim().length > 0 ? params.topic : undefined;
  return { sub, topicKey };
}

export type TopicLocation = { kind: "basic" } | { kind: "benefit"; group: string };

export function findGroupForTopic(
  categories: BenefitCategoryGroup[],
  basics: BenefitTopicSummary[],
  topicKey: string | undefined
): TopicLocation | undefined {
  if (!topicKey) return undefined;
  if (basics.some((b) => b.topicKey === topicKey)) return { kind: "basic" };
  const group = categories.find((c) => c.benefits.some((b) => b.topicKey === topicKey));
  return group ? { kind: "benefit", group: group.category } : undefined;
}
