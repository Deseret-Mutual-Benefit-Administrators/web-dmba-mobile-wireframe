/**
 * Placeholder stand-in for the app's `hooks/useAccountExtras.ts`: the collapsed
 * "Payments & receipts" / "HSA payments" section's data, as recent selections.
 */
import * as data from "../placeholder";
import { useMoneyState } from "../api/accountsQueries";
import type { SpendingAccountType } from "../services/accountList";
import {
  expenseToEntry,
  hsaPaymentToEntry,
  pendingToEntry,
  recentSelection,
  settledToEntry,
  type RecentSelection,
} from "../services/expenseEntries";

export interface AccountExtras {
  isHsa: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  items: RecentSelection;
  payback: RecentSelection;
  hsaPending: RecentSelection;
  hsaFailed: RecentSelection;
}

export function useAccountExtras(type: SpendingAccountType): AccountExtras {
  const state = useMoneyState();
  const empty = state === "empty";
  return {
    isHsa: type === "hsa",
    isLoading: state === "extrasLoading",
    isError: state === "extrasError",
    onRetry: () => {},
    items: recentSelection(empty ? [] : data.expenses.map(expenseToEntry)),
    payback: recentSelection(
      empty ? [] : [...data.pendingReimbursements.map(pendingToEntry), ...data.settledReimbursements.map(settledToEntry)]
    ),
    hsaPending: recentSelection(empty ? [] : data.hsaPendingPayments.map((p, i) => hsaPaymentToEntry(p, i, false))),
    hsaFailed: recentSelection(empty ? [] : data.hsaFailedPayments.map((p, i) => hsaPaymentToEntry(p, i, true))),
  };
}
