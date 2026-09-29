/**
 * Local stand-in for the app's `spending-claims/services/claimFormValidation.ts`:
 * the details step's client-side rules, keyed to `spendingClaims.validation.*`.
 */
import { parseAmountInput } from "@/src/shared/services/amountInput";
import type {
  ClaimFormFieldId,
  ClaimFormRule,
  ClaimFormValidationResult,
  ClaimFormValues,
  ClaimValidationRules,
} from "../types";

export const PROVIDER_MAX_LENGTH = 100;
export const NOTES_MAX_LENGTH = 500;

export function validateClaimDetails(values: ClaimFormValues, rules: ClaimValidationRules): ClaimFormValidationResult {
  const { cents } = parseAmountInput(values.amount);
  const list: ClaimFormRule[] = [
    { key: "startRequired", field: "serviceStartDate", messageKey: "spendingClaims.validation.required", passed: values.serviceStartDate !== "" },
    {
      key: "startFuture",
      field: "serviceStartDate",
      messageKey: "spendingClaims.validation.dateInFuture",
      passed: values.serviceStartDate === "" || values.serviceStartDate <= rules.today,
    },
    {
      key: "endBeforeStart",
      field: "serviceEndDate",
      messageKey: "spendingClaims.validation.endBeforeStart",
      passed: values.serviceEndDate === "" || values.serviceStartDate === "" || values.serviceEndDate >= values.serviceStartDate,
    },
    { key: "amountRequired", field: "amount", messageKey: "spendingClaims.validation.required", passed: values.amount.trim() !== "" },
    {
      key: "amountNumeric",
      field: "amount",
      messageKey: "spendingClaims.validation.amountNumeric",
      passed: values.amount.trim() === "" || cents !== null,
    },
    {
      key: "amountPositive",
      field: "amount",
      messageKey: "spendingClaims.validation.amountPositive",
      passed: cents === null || cents > 0,
    },
    {
      key: "amountMax",
      field: "amount",
      messageKey: "spendingClaims.validation.amountMax",
      passed: cents === null || rules.maxAmountCents === null || cents <= rules.maxAmountCents,
    },
    { key: "providerRequired", field: "provider", messageKey: "spendingClaims.validation.required", passed: values.provider.trim() !== "" },
  ];
  return { isValid: list.every((rule) => rule.passed), rules: list };
}

export function firstErrorForField(result: ClaimFormValidationResult, id: ClaimFormFieldId): ClaimFormRule | undefined {
  return result.rules.find((rule) => rule.field === id && !rule.passed);
}
