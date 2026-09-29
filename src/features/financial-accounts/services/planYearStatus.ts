/**
 * Local stand-in for the app's `financial-accounts/services/planYearStatus.ts`.
 * The status rules are the cards' `cardServices` ones, re-exported so the
 * dashboard and these screens cannot disagree about a plan year.
 */
export {
  accountDisplayName,
  claimFilingDeadline,
  planYearBadgeKey,
  planYearStatus,
  planYearStatusMessageKey,
  planYearStatusTone,
  type PlanYearDates,
  type PlanYearStatus,
} from "../components/cardServices";

interface Window {
  planStartDate: string | null;
  planEndDate: string | null;
}

/**
 * True for an account with no real plan year — absent dates, or the vendor's
 * open-ended 2099 window the HSA is reported over (ADR-116). Decided by span,
 * never by account type.
 */
export function isOpenEndedWindow(dates: Window): boolean {
  if (!dates.planStartDate || !dates.planEndDate) return true;
  return dates.planEndDate.slice(0, 4) >= "2099";
}

/** The year a plan-year window belongs to — "2026" — or "" for an open-ended one. */
export function planYearLabel(dates: Window): string {
  if (isOpenEndedWindow(dates)) return "";
  return dates.planStartDate!.slice(0, 4);
}
