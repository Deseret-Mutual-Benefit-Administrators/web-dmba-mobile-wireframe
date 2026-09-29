/**
 * Local stand-ins for the app's `benefits/services/benefitsTransforms.ts`,
 * which the UI extract does not include. Same names and signatures as the
 * call sites use; behaviour is a simple approximation.
 */
import type { BadgeTone } from "@/src/shared/components/Badge";
import type { BenefitCategoryGroup, BenefitTopicSummary } from "../types";

const norm = (s: string | null | undefined) => (s ?? "").toLowerCase();

export function filterBenefitsBySearch(
  categories: BenefitCategoryGroup[],
  query: string
): BenefitCategoryGroup[] {
  const q = norm(query).trim();
  if (!q) return categories;
  return categories
    .map((group) => ({
      ...group,
      benefits: group.benefits.filter(
        (b) =>
          norm(b.name).includes(q) ||
          norm(b.notes).includes(q) ||
          (b.aliases ?? []).some((a) => norm(a).includes(q))
      ),
    }))
    .filter((group) => group.benefits.length > 0);
}

export function filterBenefitsByPreauth(
  categories: BenefitCategoryGroup[],
  preauthOnly: boolean
): BenefitCategoryGroup[] {
  if (!preauthOnly) return categories;
  return categories
    .map((group) => ({ ...group, benefits: group.benefits.filter((b) => b.requiresPreauth === true) }))
    .filter((group) => group.benefits.length > 0);
}

export function filterBasicsBySearch(basics: BenefitTopicSummary[], query: string): BenefitTopicSummary[] {
  const q = norm(query).trim();
  if (!q) return basics;
  return basics.filter(
    (b) => norm(b.title).includes(q) || (b.aliases ?? []).some((a) => norm(a).includes(q))
  );
}

export function hasAnyPreauthBenefit(categories: BenefitCategoryGroup[]): boolean {
  return categories.some((group) => group.benefits.some((b) => b.requiresPreauth === true));
}

export function displayCost(cost: string | null | undefined, notStated: string): string {
  const trimmed = (cost ?? "").trim();
  return trimmed.length > 0 ? trimmed : notStated;
}

export function isBenefitNotCovered(covered: boolean | null | undefined): boolean {
  return covered === false;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function getCodeTypeBadgeTone(codeType: string): BadgeTone {
  switch (codeType.toUpperCase()) {
    case "CPT":
      return "info";
    case "HCPCS":
      return "success";
    default:
      return "neutral";
  }
}
