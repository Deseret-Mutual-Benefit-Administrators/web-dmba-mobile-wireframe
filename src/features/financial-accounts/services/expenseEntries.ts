/**
 * Local stand-in for the app's `financial-accounts/services/expenseEntries.ts`:
 * expenses, reimbursements and HSA payments (ADR-120) shaped into the same
 * `AccountEntry` rows the activity feed renders, capped to a recent selection.
 */
import type { AccountExpense, HsaPayment, PendingReimbursement, SettledReimbursement } from "../types";
import type { AccountEntry } from "./accountEntries";

export interface RecentSelection {
  shown: AccountEntry[];
  all: AccountEntry[];
  hasMore: boolean;
}

const RECENT_LIMIT = 3;

export function recentSelection(all: AccountEntry[]): RecentSelection {
  return { shown: all.slice(0, RECENT_LIMIT), all, hasMore: all.length > RECENT_LIMIT };
}

function base(key: string, title: string, date: string | null, amount: number | null): AccountEntry {
  return {
    key,
    sourceId: key,
    source: "activity",
    title,
    subtitle: null,
    date: date ?? "",
    amount: Math.abs(amount ?? 0),
    isDeposit: false,
    status: null,
    typeChip: null,
    receiptAction: null,
    hasDetail: false,
    adjudication: null,
    settlementDate: null,
    claimant: null,
    accountType: null,
    accountTypeCode: null,
  };
}

export function expenseToEntry(expense: AccountExpense, index: number): AccountEntry {
  const entry = base(`exp-${index}`, expense.provider ?? expense.description ?? "", expense.serviceStartDate, expense.yourResponsibility ?? expense.billedAmount);
  return {
    ...entry,
    subtitle: expense.provider ? expense.description : null,
    status: expense.hasReceipt
      ? null
      : { labelKey: "financialAccounts.extras.needsReceipt", rawLabel: "", tone: "pending", icon: "camera-outline" },
    claimant: expense.dependentName,
  };
}

export function settledToEntry(item: SettledReimbursement, index: number): AccountEntry {
  return {
    ...base(`settled-${index}`, item.method ?? "", item.date, item.amount),
    status: { labelKey: "financialAccounts.extras.paidBack", rawLabel: "", tone: "approved", icon: "checkmark-circle" },
  };
}

export function pendingToEntry(item: PendingReimbursement, index: number): AccountEntry {
  return {
    ...base(`pending-${index}`, item.merchant ?? "", item.serviceStartDate, item.amount),
    status: { labelKey: "financialAccounts.extras.onItsWay", rawLabel: "", tone: "pending", icon: "time" },
  };
}

export function hsaPaymentToEntry(item: HsaPayment, index: number, failed: boolean): AccountEntry {
  return {
    ...base(`hsa-pay-${failed ? "f" : "p"}-${index}`, item.payee ?? "", item.date, item.amount),
    subtitle: null,
    status: failed
      ? { labelKey: "financialAccounts.extras.paymentFailed", rawLabel: "", tone: "denied", icon: "close-circle" }
      : { labelKey: "financialAccounts.extras.onItsWay", rawLabel: "", tone: "pending", icon: "time" },
  };
}
