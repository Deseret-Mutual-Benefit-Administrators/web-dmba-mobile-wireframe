/**
 * Stand-in for the app's `services/reconcileCardOrder.ts`. The default order
 * follows the `dashboard.customization.cards` keys in en.json, which match the
 * order the app's customize screen lists them in.
 */
export const DEFAULT_CARD_ORDER: string[] = [
  "nudges",
  "carousel",
  "deductible",
  "dental",
  "hsa",
  "fsa",
  "lpfsa",
  "depc",
  "retirement",
  "mrp",
  "life",
  "claims",
  "quickActions",
];

/** Drops unknown ids and inserts any missing default card at its canonical position. */
export function reconcileOrderWithDefaults(saved: string[]): string[] {
  const known = saved.filter((id) => DEFAULT_CARD_ORDER.includes(id));
  const result = [...new Set(known)];
  DEFAULT_CARD_ORDER.forEach((id, index) => {
    if (!result.includes(id)) result.splice(Math.min(index, result.length), 0, id);
  });
  return result;
}
