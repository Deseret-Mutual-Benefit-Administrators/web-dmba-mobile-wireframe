/**
 * Local stand-in for the app's `spending-claims/services/claimFlowSteps.ts`:
 * the claim flow's step order. The fork comes first, category before every input.
 */
export type ClaimPath = "cardCharge" | "reimbursement";

export type ClaimFlowStep =
  | "fork"
  | "whatYouNeed"
  | "category"
  | "claimant"
  | "details"
  | "receipt"
  | "review"
  | "submitted";

const ORDER: ClaimFlowStep[] = ["fork", "whatYouNeed", "category", "claimant", "details", "receipt", "review", "submitted"];

/** The numbered steps — the fork is the question before the form, `submitted` the end. */
const NUMBERED: ClaimFlowStep[] = ["whatYouNeed", "category", "claimant", "details", "receipt", "review"];

export function nextStep(step: ClaimFlowStep): ClaimFlowStep | null {
  const index = ORDER.indexOf(step);
  return index >= 0 && index < ORDER.length - 1 ? ORDER[index + 1] : null;
}

/** Nowhere to go back to from the fork, or once submitted. */
export function previousStep(step: ClaimFlowStep): ClaimFlowStep | null {
  if (step === "fork" || step === "submitted") return null;
  const index = ORDER.indexOf(step);
  return index > 0 ? ORDER[index - 1] : null;
}

export function stepProgress(step: ClaimFlowStep): { current: number; total: number } {
  return { current: NUMBERED.indexOf(step) + 1, total: NUMBERED.length };
}

/** True when the member has at least one active card anywhere — not account-scoped. */
export function canSubstantiateCardCharge(cards: { cardEligible: boolean }[]): boolean {
  return cards.some((card) => card.cardEligible);
}

export function shouldGuardClaimFlow(step: ClaimFlowStep, hasReceipts: boolean): boolean {
  return (step !== "fork" && step !== "submitted") || hasReceipts;
}
