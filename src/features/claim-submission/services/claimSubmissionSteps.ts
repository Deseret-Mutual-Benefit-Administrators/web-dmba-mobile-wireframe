/** Web stand-in for the app's `claimSubmissionSteps.ts` — the step sequence. */
export type ClaimSubmissionStep = "patient" | "details" | "attachments" | "review";

export const CLAIM_SUBMISSION_STEPS: readonly ClaimSubmissionStep[] = ["patient", "details", "attachments", "review"];

export function stepProgress(step: ClaimSubmissionStep): { current: number; total: number } {
  return { current: CLAIM_SUBMISSION_STEPS.indexOf(step) + 1, total: CLAIM_SUBMISSION_STEPS.length };
}

export function nextStep(step: ClaimSubmissionStep): ClaimSubmissionStep {
  const i = CLAIM_SUBMISSION_STEPS.indexOf(step);
  return CLAIM_SUBMISSION_STEPS[Math.min(i + 1, CLAIM_SUBMISSION_STEPS.length - 1)];
}

export function previousStep(step: ClaimSubmissionStep): ClaimSubmissionStep {
  const i = CLAIM_SUBMISSION_STEPS.indexOf(step);
  return CLAIM_SUBMISSION_STEPS[Math.max(i - 1, 0)];
}
