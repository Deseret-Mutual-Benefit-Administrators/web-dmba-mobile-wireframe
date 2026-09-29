/** Local stand-in for the app's `spending-claims/services/spendingClaimTransforms.ts`. */
import { formatTransactionDate } from "@/src/features/financial-accounts/services/accountTransforms";
import type { ClaimClaimant } from "../types";

export function formatClaimantName(claimant: ClaimClaimant): string {
  return [claimant.firstName, claimant.lastName].filter(Boolean).join(" ");
}

export function formatServiceDateRange(start: string, end: string): string {
  if (!start) return "";
  if (!end || end === start) return formatTransactionDate(start);
  return `${formatTransactionDate(start)} – ${formatTransactionDate(end)}`;
}

/** Vendor HTML → paragraphs of plain text (block tags split, other tags dropped). */
export function splitVendorParagraphs(content: string | null): string[] {
  if (!content) return [];
  return content
    .replace(/<\s*(br|\/p|\/li|\/div)\s*\/?>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}
