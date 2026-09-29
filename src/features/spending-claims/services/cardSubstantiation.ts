/**
 * Local stand-in for the app's `spending-claims/services/cardSubstantiation.ts`:
 * which card charges ask to be documented, and the three-step sequence.
 */
export type SubstantiationStep = "pick" | "capture" | "done";

export interface SubstantiationCandidate {
  id: string;
  merchantName: string | null;
  description: string;
  amount: number;
  date: string;
}

export function previousSubstantiationStep(step: SubstantiationStep): SubstantiationStep | null {
  return step === "capture" ? "pick" : null;
}

export function shouldGuardSubstantiationFlow(step: SubstantiationStep, hasReceipts: boolean): boolean {
  return step === "capture" || hasReceipts;
}
