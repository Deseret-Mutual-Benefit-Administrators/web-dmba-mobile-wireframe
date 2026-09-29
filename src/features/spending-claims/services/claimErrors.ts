/**
 * Local stand-in for the app's `spending-claims/services/claimErrors.ts`: the
 * server's per-field and form-level rejections, resolved through their stable
 * code to our own translated message.
 */
import type { ClaimEntryTemplate, ClaimFormFieldId } from "../types";
import { formatTransactionDate } from "@/src/features/financial-accounts/services/accountTransforms";

export interface ClaimValidationIssue {
  code: string;
  message: string;
}

export interface ClaimServerValidation {
  fieldErrors: Partial<Record<ClaimFormFieldId, ClaimValidationIssue[]>>;
  formErrors: ClaimValidationIssue[];
}

export const NO_SERVER_ERRORS: ClaimServerValidation = { fieldErrors: {}, formErrors: [] };

export type IssueMessageSource = { kind: "messageKey"; messageKey: string } | { kind: "serverProse"; text: string };

const KNOWN_CODES = new Set([
  "categoryNotOffered",
  "amountRequired",
  "amountOverCeiling",
  "serviceDateFuture",
  "providerRequired",
  "receiptMissing",
  "deadlinePassed",
]);

export function resolveIssueMessageSource(issue: ClaimValidationIssue, language: string): IssueMessageSource {
  if (KNOWN_CODES.has(issue.code)) return { kind: "messageKey", messageKey: `spendingClaims.serverErrors.${issue.code}` };
  if (language.startsWith("en") && issue.message) return { kind: "serverProse", text: issue.message };
  return { kind: "messageKey", messageKey: "spendingClaims.serverErrors.unknown" };
}

export function buildServerErrorValues(template: ClaimEntryTemplate): Record<string, string> {
  return {
    startDate: template.serviceWindow ? formatTransactionDate(template.serviceWindow.startDate) : "",
    endDate: template.serviceWindow ? formatTransactionDate(template.serviceWindow.endDate) : "",
    date: template.submitClaimsLastDate ? formatTransactionDate(template.submitClaimsLastDate) : "",
    maxSize: `${Math.round(template.maxReceiptBytes / (1024 * 1024))} MB`,
  };
}
