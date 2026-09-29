/**
 * Web stand-in for the app's `claimSubmissionValidation.ts` — per-step checks
 * that surface the same `claimSubmission.errors.*` keys.
 */
import { parseAmountInput } from "@/src/shared/services/amountInput";
import type { ClaimSubmissionFormValues } from "../types";
import type { ClaimSubmissionStep } from "./claimSubmissionSteps";

export const PROVIDER_NAME_MAX_LENGTH = 200;
export const SERVICE_DESCRIPTION_MAX_LENGTH = 500;

export type ClaimSubmissionFieldId =
  | "patient"
  | "provider"
  | "serviceDate"
  | "amount"
  | "description"
  | "alreadyPaid"
  | "billAttachment";

export interface ClaimSubmissionValidationIssue {
  field: ClaimSubmissionFieldId;
  messageKey: string;
}

export function firstErrorForField(
  issues: readonly ClaimSubmissionValidationIssue[],
  field: ClaimSubmissionFieldId
): ClaimSubmissionValidationIssue | undefined {
  return issues.find((issue) => issue.field === field);
}

export function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function validateStep(
  step: ClaimSubmissionStep,
  values: ClaimSubmissionFormValues,
  billAttachmentCount: number
): ClaimSubmissionValidationIssue[] {
  const issues: ClaimSubmissionValidationIssue[] = [];
  const e = (field: ClaimSubmissionFieldId, key: string) => issues.push({ field, messageKey: `claimSubmission.errors.${key}` });

  if (step === "patient" && values.patientMemberId === "") e("patient", "patientRequired");

  if (step === "details") {
    if (values.providerName.trim() === "") e("provider", "providerRequired");
    if (values.serviceDate === "") e("serviceDate", "serviceDateRequired");
    else if (values.serviceDate > toIsoDate(new Date())) e("serviceDate", "serviceDateFuture");
    if (values.amount.trim() === "") e("amount", "amountRequired");
    else {
      const { cents } = parseAmountInput(values.amount);
      if (cents === null) e("amount", "amountInvalid");
      else if (cents <= 0) e("amount", "amountNotPositive");
    }
    if (values.serviceDescription.trim() === "") e("description", "descriptionRequired");
    if (values.alreadyPaid === "") e("alreadyPaid", "alreadyPaidRequired");
  }

  if (step === "attachments" && billAttachmentCount === 0) e("billAttachment", "billAttachmentRequired");

  return issues;
}
