/**
 * Stand-ins for the app's `services/carouselTransforms.ts` (not in the extract).
 */

const PILL_CLASSES: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-800" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
  slate: { bg: "bg-slate-100", text: "text-slate-700" },
};

/** Category `colorToken` → pill background/text classes; unknown tokens fall back to slate. */
export function categoryPillClasses(colorToken: string): { bg: string; text: string } {
  return PILL_CLASSES[colorToken] ?? PILL_CLASSES.slate;
}

/** At least one minute, whole minutes. */
export function safeReadMinutes(minutes: number): number {
  return Number.isFinite(minutes) && minutes >= 1 ? Math.round(minutes) : 1;
}

export function nextCarouselIndex(current: number, count: number): number {
  return count > 0 ? (current + 1) % count : 0;
}
