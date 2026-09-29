/**
 * Stand-in for the app's `useSubmitMedicalClaimFlow` — same fields the screen
 * reads. Validation runs on Continue; a successful submit replace-navigates to
 * a message thread, as the app does.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ClaimSubmissionFormValues } from "../types";
import { nextStep, previousStep, type ClaimSubmissionStep } from "../services/claimSubmissionSteps";
import { validateStep, type ClaimSubmissionValidationIssue } from "../services/claimSubmissionValidation";
import { placeholderPatientOptions } from "../placeholder";
import { MAX_ATTACHMENTS, useMessageAttachments } from "./useMessageAttachments";

const EMPTY: ClaimSubmissionFormValues = {
  patientMemberId: "",
  providerName: "",
  serviceDate: "",
  amount: "",
  serviceDescription: "",
  alreadyPaid: "",
};

export function useSubmitMedicalClaimFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ClaimSubmissionStep>("patient");
  const [values, setValues] = useState<ClaimSubmissionFormValues>(EMPTY);
  const [validationIssues, setValidationIssues] = useState<ClaimSubmissionValidationIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const billAttachments = useMessageAttachments();
  const proofAttachments = useMessageAttachments();

  const setValue = <K extends keyof ClaimSubmissionFormValues>(key: K, value: ClaimSubmissionFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    const issues = validateStep(step, values, billAttachments.drafts.length);
    setValidationIssues(issues);
    if (issues.length === 0) setStep(nextStep(step));
  };

  const goBack = () => {
    setValidationIssues([]);
    setStep(previousStep(step));
  };

  const submit = async () => {
    setIsSubmitting(true);
    window.setTimeout(() => navigate("/messages/sample-thread", { replace: true }), 800);
  };

  const hasInput =
    Object.values(values).some((v) => v !== "") || billAttachments.drafts.length + proofAttachments.drafts.length > 0;

  return {
    step,
    values,
    setValue,
    validationIssues,
    patientOptions: placeholderPatientOptions,
    selectedPatient: placeholderPatientOptions.find((o) => o.memberId === values.patientMemberId) ?? null,
    billAttachments,
    proofAttachments,
    maxAttachmentsCombined: MAX_ATTACHMENTS,
    formError: null as string | null,
    isSubmitting,
    canAdvance: !isSubmitting && !billAttachments.isBusy && !proofAttachments.isBusy,
    canGoBack: step !== "patient" && !isSubmitting,
    goNext,
    goBack,
    submit,
    shouldGuardDiscard: hasInput && !isSubmitting,
    discardAttachments: () => {
      billAttachments.discardAll();
      proofAttachments.discardAll();
    },
  };
}
