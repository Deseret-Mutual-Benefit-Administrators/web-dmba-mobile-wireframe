/**
 * Placeholder stand-in for the app's `spending-claims/api/spendingClaimsQueries.ts`.
 * `?state=loading|error|unsupported` reaches the viewer's other states; file key
 * 1002 is a PDF (acknowledged, not rendered), any other key the drawn receipt.
 */
import { useMoneyState, type QueryLike } from "@/src/features/financial-accounts/api/accountsQueries";
import { receiptContent } from "../placeholder";
import type { ClaimReceiptContent } from "../types";

export function useReceipt(fileKey: number): QueryLike<ClaimReceiptContent> {
  const state = useMoneyState();
  const base = { isFetching: false, isSuccess: true, isRefetching: false, error: null, refetch: () => {} };
  if (state === "loading") return { ...base, data: undefined, isLoading: true, isError: false, isSuccess: false };
  if (state === "error") return { ...base, data: undefined, isLoading: false, isError: true, isSuccess: false };
  const data = state === "unsupported" ? { contentType: "application/octet-stream", base64: "", contentLength: 20_480 } : receiptContent(fileKey);
  return { ...base, data, isLoading: false, isError: false };
}
