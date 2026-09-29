/**
 * Web stand-in for the app's `claimsTransforms.ts` (not in the UI extract).
 * Only the helpers the ported components call.
 */
import type { BadgeTone } from "@/src/shared/components/Badge";
import type { ClaimStatus } from "../types";
import type { MonthlyCostBar } from "../placeholder";

export function formatClaimAmount(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const STATUS_TONE: Record<ClaimStatus, BadgeTone> = {
  Pending: "warning",
  Processing: "info",
  Processed: "success",
  Denied: "error",
  Adjusted: "neutral",
};

export function getStatusBadgeTone(status: ClaimStatus): BadgeTone {
  return STATUS_TONE[status];
}

/** Class pair for an active status chip (ClaimStatusFilter). */
export function getStatusBadgeColor(status: ClaimStatus): string {
  const map: Record<ClaimStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Processing: "bg-blue-100 text-blue-800",
    Processed: "bg-green-100 text-green-800",
    Denied: "bg-red-100 text-red-800",
    Adjusted: "bg-gray-100 text-gray-700",
  };
  return map[status];
}

export function sumYearTotals(data: MonthlyCostBar[]): { totalBilled: number; yourResponsibility: number } {
  return data.reduce(
    (acc, item) => ({
      totalBilled: acc.totalBilled + item.totalBilled,
      yourResponsibility: acc.yourResponsibility + item.yourResponsibility,
    }),
    { totalBilled: 0, yourResponsibility: 0 }
  );
}
