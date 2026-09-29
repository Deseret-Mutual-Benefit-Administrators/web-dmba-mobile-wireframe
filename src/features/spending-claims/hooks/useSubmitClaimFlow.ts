/**
 * Placeholder stand-in for the app's `spending-claims/hooks/useSubmitClaimFlow.ts`:
 * the step machine, form values, validation and a pretend submission.
 *
 * `?state=loading|error` — the template read. `?state=noCard` — no active
 * benefits card, so the card path is disabled on the fork. `?state=offline` —
 * the review step's offline block (Submit stays disabled). `?state=serverError`
 * — the submission is rejected with a form-level error on the review step.
 */
import { useCallback, useMemo, useState } from "react";
import { useMoneyState } from "@/src/features/financial-accounts/api/accountsQueries";
import { localToday } from "@/src/features/financial-accounts/services/today";
import { t } from "@/src/shared/i18n";
import { schema as placeholderSchema, template as placeholderTemplate } from "../placeholder";
import { nextStep, previousStep, type ClaimFlowStep, type ClaimPath } from "../services/claimFlowSteps";
import { validateClaimDetails } from "../services/claimFormValidation";
import { NO_SERVER_ERRORS, type ClaimServerValidation } from "../services/claimErrors";
import type { CapturedReceipt, ClaimFormValues } from "../types";

const EMPTY_VALUES: ClaimFormValues = {
  serviceCategoryCode: "",
  claimantKey: "",
  serviceStartDate: "",
  serviceEndDate: "",
  amount: "",
  provider: "",
  notes: "",
  reimbursementMethod: "",
};

export function useSubmitClaimFlow() {
  const state = useMoneyState();
  const [step, setStep] = useState<ClaimFlowStep>("fork");
  const [path, setPath] = useState<ClaimPath | null>(null);
  const [values, setValues] = useState<ClaimFormValues>(EMPTY_VALUES);
  const [receipts, setReceipts] = useState<CapturedReceipt[]>([]);
  const [certified, setCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [serverErrors, setServerErrors] = useState<ClaimServerValidation>(NO_SERVER_ERRORS);

  const isOffline = state === "offline";
  const template = state === "loading" || state === "error" ? null : placeholderTemplate;
  const schema = template ? placeholderSchema : null;

  const setValue = useCallback(<K extends keyof ClaimFormValues>(key: K, value: ClaimFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const detailsValidation = useMemo(
    () =>
      validateClaimDetails(values, {
        allowSameMonthService: placeholderTemplate.rules.allowSameMonthService,
        serviceWindow: placeholderTemplate.serviceWindow,
        submitClaimsLastDate: placeholderTemplate.submitClaimsLastDate,
        maxAmountCents: placeholderTemplate.maxClaimAmount * 100,
        today: localToday(),
      }),
    [values]
  );

  const canAdvance = (() => {
    switch (step) {
      case "fork":
        return path !== null;
      case "category":
        return values.serviceCategoryCode !== "";
      case "claimant":
        return values.claimantKey !== "";
      case "receipt":
        return receipts.length > 0;
      case "review":
        return certified && !isOffline;
      default:
        return true;
    }
  })();

  const goNext = useCallback(() => {
    if (step === "details" && !detailsValidation.isValid) {
      // Show each rule beside its field instead of advancing.
      setShowValidation(true);
      return;
    }
    const next = nextStep(step);
    if (next) setStep(next);
  }, [step, detailsValidation.isValid]);

  const goBack = useCallback(() => {
    const previous = previousStep(step);
    if (previous) setStep(previous);
  }, [step]);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    if (state === "serverError") {
      setServerErrors({ fieldErrors: {}, formErrors: [{ code: "receiptMissing", message: "" }] });
      return;
    }
    setServerErrors(NO_SERVER_ERRORS);
    setStep("submitted");
  }, [state]);

  const primaryActionLabel = step === "review" ? t("spendingClaims.submit") : t("spendingClaims.continue");

  return {
    isLoading: state === "loading",
    loadError: state === "error",
    refetchTemplate: () => {},
    template,
    schema,
    step,
    path,
    choosePath: setPath,
    values,
    setValue,
    validation: step === "details" && showValidation ? detailsValidation : null,
    serverErrors,
    receipts,
    setReceipts,
    certified,
    setCertified,
    isSubmitting,
    isOffline,
    canAdvance,
    goNext,
    goBack,
    submit,
    primaryActionLabel,
  };
}
