/**
 * Local stand-in for the app's `financial-accounts/services/accountList.ts`:
 * which spending accounts exist, one row per account per plan year, and the
 * vendor account-code alias table the activity feed narrows by.
 */
import type { FinancialSummary, PlanYearInfo } from "../types";
import { planYearStatus, type PlanYearDates, type PlanYearStatus } from "./planYearStatus";

export type SpendingAccountType = "hsa" | "fsa" | "lpfsa" | "depc";

const SPENDING_TYPES: readonly SpendingAccountType[] = ["hsa", "fsa", "lpfsa", "depc"];

/** The route slug → account, or null for anything this screen does not handle. */
export function toSpendingAccountType(value: string | undefined | null): SpendingAccountType | null {
  return value && (SPENDING_TYPES as readonly string[]).includes(value) ? (value as SpendingAccountType) : null;
}

/** Plan-year account slugs as `/accounts/planyears` reports them. */
const PLAN_YEAR_SLUG_TO_TYPE: Record<string, SpendingAccountType> = {
  hsa: "hsa",
  healthcare: "fsa",
  lpfsa: "lpfsa",
  depc: "depc",
};

/** Raw vendor account-type codes → account. Not confirmed complete. */
export const VENDOR_CODE_TO_TYPE: Record<string, SpendingAccountType> = {
  HSA: "hsa",
  FSA: "fsa",
  MED: "fsa",
  LPF: "lpfsa",
  LEX: "lpfsa",
  DCA: "depc",
  PNC: "depc",
};

export function vendorCodeToAccountType(code: string | null): SpendingAccountType | null {
  if (!code || code.trim() === "") return null;
  return VENDOR_CODE_TO_TYPE[code.trim().toUpperCase()] ?? null;
}

export interface SpendingAccountRow {
  key: string;
  type: SpendingAccountType;
  /** Plan-year index — 0 is the current (default) plan year. */
  planYear: number;
  isDefaultYear: boolean;
  /** The window, when known without a balance read (past years carry it). */
  dates: PlanYearDates | null;
}

export function buildAccountRows(
  summary: FinancialSummary | undefined,
  planYears: PlanYearInfo[]
): SpendingAccountRow[] {
  if (!summary) return [];
  const rows: SpendingAccountRow[] = [];
  const present: Record<SpendingAccountType, boolean> = {
    hsa: summary.hsa !== null,
    fsa: summary.fsa !== null,
    lpfsa: summary.lpfsa !== null,
    depc: summary.depc !== null,
  };
  for (const type of SPENDING_TYPES) {
    if (present[type]) rows.push({ key: `${type}-0`, type, planYear: 0, isDefaultYear: true, dates: null });
  }
  for (const year of planYears) {
    for (const slug of year.accountTypes) {
      const type = PLAN_YEAR_SLUG_TO_TYPE[slug];
      // The HSA has no plan year; it never appears as a past-year row.
      if (!type || type === "hsa") continue;
      rows.push({
        key: `${type}-${year.planYear}`,
        type,
        planYear: year.planYear,
        isDefaultYear: false,
        dates: {
          planStartDate: year.planStartDate,
          planEndDate: year.planEndDate,
          gracePeriodEnd: null,
          submitClaimsLastDate: null,
        },
      });
    }
  }
  return rows;
}

export function accountRowStatus(row: SpendingAccountRow, today: string): PlanYearStatus {
  if (!row.dates) return row.type === "hsa" ? "lifetime" : "active";
  return planYearStatus(row.dates, today);
}

/** The state in words, including the two states that render no badge. */
export function accountRowStatusKey(status: PlanYearStatus): string {
  switch (status) {
    case "lifetime":
      return "financialAccounts.accountsList.statusOngoing";
    case "active":
      return "financialAccounts.accountsList.statusCurrent";
    case "upcoming":
      return "financialAccounts.planYear.badge.upcoming";
    case "runOut":
      return "financialAccounts.planYear.badge.ended";
    default:
      return "financialAccounts.planYear.badge.closed";
  }
}
