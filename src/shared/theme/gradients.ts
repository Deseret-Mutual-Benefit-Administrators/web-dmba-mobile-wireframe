import { colors } from "./colors";

/**
 * Named, typed gradient tuples built from theme tokens. Keeps `LinearGradient`
 * consumers off hand-typed hex pairs so the stops can't drift from
 * `colors.ts` / `tokens.js`.
 */

/**
 * The blue gradient used on every financial account card's icon circle
 * (HSA/FSA/LPFSA/DEPC, dashboard deductible/dental cards, Coverage Journey).
 */
export const financialCardGradient: readonly [string, string] = [
  colors.financial.gradientStart,
  colors.financial.gradientEnd,
];

/** Provider detail screen header (app/provider/[npi].tsx). */
export const providerHeaderGradient: readonly [string, string] = [
  colors.searchSlate.base,
  colors.searchSlate.light,
];

/** Facility detail screen header (app/facility/[id].tsx). */
export const facilityHeaderGradient: readonly [string, string] = [
  colors.searchSlate.base,
  colors.searchSlate.light,
];

/** Dashboard hero header (app/(tabs)/index.tsx). */
export const dashboardHeroGradient: readonly [string, string, string] = [
  colors.searchSlate.tint1,
  colors.searchSlate.tint2,
  colors.searchSlate.tint3,
];

/**
 * Out-of-pocket max progress bar (dashboard deductible/dental cards, Coverage
 * Journey) — a darker end stop than the standard financial card gradient.
 */
export const oopMaxGradient: readonly [string, string] = [
  colors.financial.gradientEnd,
  colors.financial.gradientDeep,
];

/** Dental orthodontia lifetime-max progress bar (CollapsibleDentalCard). */
export const orthoGradient: readonly [string, string] = [
  colors.financial.orthoGradientStart,
  colors.financial.orthoGradientEnd,
];

/**
 * Web only: a gradient tuple as a CSS `linear-gradient(...)`. `angle` defaults
 * to 180deg (top → bottom, expo-linear-gradient's default direction); stops are
 * spaced evenly, as LinearGradient does without `locations`.
 */
export function gradientCss(tuple: readonly string[], angle = 180): string {
  return `linear-gradient(${angle}deg, ${tuple.join(", ")})`;
}
