/**
 * Local stand-in for the app's `financial-accounts/services/accountTransforms.ts`,
 * which the UI extract does not include. Formatting comes from the cards'
 * `cardServices` so the dashboard and these screens format identically; the
 * rest follows what the en.json keys and the call sites imply.
 */
import { colors } from "@/src/shared/theme/colors";
import type {
  BalanceDueItem,
  BenefitCardStatus,
  CardActionKind,
  DependentRelationship,
  DependentStatus,
  PlanYearInfo,
  ProductEligibilityCategory,
} from "../types";

export { formatCurrency, formatPercent, formatTransactionDate } from "../components/cardServices";

import { formatTransactionDate } from "../components/cardServices";

/** A past plan year's chip label — its date range, or the start year alone. */
export function formatPlanYearLabel(year: PlanYearInfo): string {
  if (year.planStartDate && year.planEndDate) {
    return `${formatTransactionDate(year.planStartDate)} – ${formatTransactionDate(year.planEndDate)}`;
  }
  return year.planStartDate ? year.planStartDate.slice(0, 4) : String(year.planYear);
}

export function shouldShowBalanceDueBanner(total: number, items: BalanceDueItem[]): boolean {
  return total > 0 && items.length > 0;
}

export function getBalanceDueAccountLabelKey(accountType: string): string {
  switch (accountType) {
    case "hsa":
      return "financialAccounts.shortName.hsa";
    case "healthcare":
      return "financialAccounts.shortName.fsa";
    case "lpfsa":
      return "financialAccounts.shortName.lpfsa";
    case "depc":
      return "financialAccounts.shortName.depc";
    default:
      return "financialAccounts.balanceDue.otherAccount";
  }
}

const CARD_STATUS_KEY: Record<BenefitCardStatus, string> = {
  New: "financialAccounts.cards.status.new",
  Active: "financialAccounts.cards.status.active",
  TempInactive: "financialAccounts.cards.status.tempInactive",
  PermInactive: "financialAccounts.cards.status.permInactive",
  LostStolen: "financialAccounts.cards.status.lostStolen",
  Unknown: "financialAccounts.cards.status.unknown",
};

export function getCardStatusLabelKey(status: BenefitCardStatus): string {
  return CARD_STATUS_KEY[status] ?? CARD_STATUS_KEY.Unknown;
}

export function getCardStatusColors(status: BenefitCardStatus): { bg: string; text: string } {
  switch (status) {
    case "Active":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "New":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "TempInactive":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    case "PermInactive":
    case "LostStolen":
      return { bg: "bg-red-100", text: "text-red-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
}

/** Nothing left to act on once a card is permanently inactive or reported lost. */
export function getAvailableCardActions(status: BenefitCardStatus): CardActionKind[] {
  if (status === "PermInactive" || status === "LostStolen") return [];
  return ["reportLostStolen", "deactivate"];
}

export type CardActionErrorKind = "serviceUnavailable" | "other";

export function deriveCardActionErrorKind(_error: unknown): CardActionErrorKind {
  return "other";
}

export function getDependentRelationshipLabelKey(relationship: DependentRelationship): string {
  return `financialAccounts.dependents.relationship.${relationship}`;
}

export function getDependentStatusLabelKey(status: DependentStatus): string {
  return `financialAccounts.dependents.status.${status}`;
}

export function getProductEligibilityLabelKey(category: ProductEligibilityCategory): string {
  return `financialAccounts.scanner.verdict.${category}`;
}

export function getProductEligibilityIcon(category: ProductEligibilityCategory): string {
  switch (category) {
    case "eligible":
      return "checkmark-circle";
    case "dualEligible":
      return "alert-circle";
    case "notEligible":
      return "close-circle";
    default:
      return "help-circle";
  }
}

export function getProductEligibilityColors(category: ProductEligibilityCategory): {
  bg: string;
  text: string;
  icon: string;
} {
  switch (category) {
    case "eligible":
      return { bg: "bg-green-50", text: "text-green-800", icon: colors.tone.success.icon };
    case "dualEligible":
      return { bg: "bg-amber-50", text: "text-amber-800", icon: colors.tone.warning.icon };
    case "notEligible":
      return { bg: "bg-red-50", text: "text-red-800", icon: colors.tone.error.icon };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", icon: colors.neutral[600] };
  }
}
