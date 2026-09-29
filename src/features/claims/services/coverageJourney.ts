/**
 * Web stand-in for the app's `coverageJourney.ts` (not in the UI extract) —
 * the types `CoverageJourneyCard` reads. The derivation logic stays in the app.
 */
import type { Accumulator } from "../placeholder";

export type CoverageJourneyPhase = "beforeDeductible" | "costSharing" | "fullyCovered" | "unknown";
export type JourneyPhaseKey = "deductible" | "coinsurance" | "oopMax";
export type JourneyPhaseState = "complete" | "current" | "upcoming" | "waived" | "unlimited" | "unknown";

export interface JourneyPhaseView {
  key: JourneyPhaseKey;
  state: JourneyPhaseState;
  accumulator: Accumulator | null;
}

export interface CoverageJourney {
  phase: CoverageJourneyPhase;
  oopMaxIsUnlimited: boolean;
  deductibleIsWaived: boolean;
}
