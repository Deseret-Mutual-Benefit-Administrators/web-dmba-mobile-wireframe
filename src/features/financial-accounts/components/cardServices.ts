/**
 * Local stand-ins for the app's financial-accounts services
 * (`accountTransforms`, `hsaContributions`, `planYearStatus`, `today`), which
 * the UI extract does not include. Behaviour follows what the cards and the
 * en.json keys imply: formatting, the plan-year state and its badge/banner keys.
 */

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

/** Date-only ISO → "Mar 31, 2026" at local midnight; "" for missing or bad input. */
export function formatTransactionDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "";
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Local `yyyy-MM-dd`. */
export function localToday(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

interface LabelRef {
  key: string;
  params?: Record<string, string | number>;
}

export function hsaContributionDisplay(
  data: { annualLimit: number | null; taxYear: number | null; coverageTier: "selfOnly" | "family" | null; catchUpContribution: number | null },
  format: (n: number) => string
): { contributions: LabelRef; limit: LabelRef | null; coverageTier: LabelRef | null; catchUp: LabelRef | null } {
  const year = data.taxYear;
  return {
    contributions: year !== null ? { key: "financialAccounts.hsa.ytdContributionsForYear", params: { year } } : { key: "financialAccounts.hsa.ytdContributions" },
    limit: data.annualLimit !== null && year !== null ? { key: "financialAccounts.hsa.annualLimitForYear", params: { year } } : null,
    coverageTier: data.coverageTier !== null ? { key: `financialAccounts.hsa.coverageTier.${data.coverageTier}` } : null,
    catchUp:
      data.catchUpContribution !== null && year !== null
        ? { key: "financialAccounts.hsa.catchUpNote", params: { amount: format(data.catchUpContribution), year } }
        : null,
  };
}

export interface PlanYearDates {
  planStartDate: string | null;
  planEndDate: string | null;
  gracePeriodEnd: string | null;
  submitClaimsLastDate: string | null;
}

export type PlanYearStatus = "lifetime" | "upcoming" | "active" | "runOut" | "closed";

/** Last day to file: the vendor's own date, else the run-out end, else the plan-year end. */
export function claimFilingDeadline(dates: PlanYearDates): string {
  return dates.submitClaimsLastDate ?? dates.gracePeriodEnd ?? dates.planEndDate ?? "";
}

export function planYearStatus(dates: PlanYearDates, today: string): PlanYearStatus {
  const { planStartDate: start, planEndDate: end } = dates;
  if (!start || !end || end.slice(0, 4) >= "2099") return "lifetime";
  if (today < start.slice(0, 10)) return "upcoming";
  if (today <= end.slice(0, 10)) return "active";
  const deadline = claimFilingDeadline(dates).slice(0, 10);
  return deadline && today <= deadline ? "runOut" : "closed";
}

export function planYearBadgeKey(status: PlanYearStatus): string | null {
  switch (status) {
    case "upcoming":
      return "financialAccounts.planYear.badge.upcoming";
    case "runOut":
      return "financialAccounts.planYear.badge.ended";
    case "closed":
      return "financialAccounts.planYear.badge.closed";
    default:
      return null;
  }
}

export function planYearStatusMessageKey(status: PlanYearStatus): string | null {
  switch (status) {
    case "upcoming":
      return "financialAccounts.planYear.status.upcoming";
    case "runOut":
      return "financialAccounts.planYear.status.runOut";
    case "closed":
      return "financialAccounts.planYear.status.closed";
    default:
      return null;
  }
}

export function planYearStatusTone(status: PlanYearStatus): "warning" | "info" | "neutral" {
  if (status === "runOut") return "warning";
  if (status === "upcoming") return "info";
  return "neutral";
}

/**
 * "FSA Account" + plan year → "FSA Account 2026". An open-ended window (the HSA,
 * reported 2024–2099) has no plan year, so it keeps the bare name (ADR-116).
 */
export function accountDisplayName(base: string, dates: PlanYearDates): string {
  const start = dates.planStartDate;
  const end = dates.planEndDate;
  if (!start || !end || end.slice(0, 4) >= "2099") return base;
  return `${base} ${start.slice(0, 4)}`;
}
