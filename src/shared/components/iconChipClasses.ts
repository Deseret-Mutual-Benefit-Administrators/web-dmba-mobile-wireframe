/**
 * Pure class-string builder behind `IconChip.tsx` — see `buttonClasses.ts`
 * for why this lives in a React-Native-free sibling module.
 */

export type IconChipSize = "sm" | "md";
export type IconChipTone = "info" | "success" | "warning" | "error" | "neutral";

const SIZE_CLASSES: Record<IconChipSize, string> = {
  sm: "w-9 h-9",
  md: "w-10 h-10",
};

const TONE_CLASSES: Record<IconChipTone, string> = {
  info: "bg-info-tint",
  success: "bg-success-tint",
  warning: "bg-warning-tint",
  error: "bg-error-tint",
  neutral: "bg-gray-100",
};

/**
 * Complete literal class string for the chip container — every size × tone
 * pair is a full string, never `bg-${tone}-tint` interpolation (that breaks
 * NativeWind's static class extraction).
 */
export function iconChipClasses(size: IconChipSize, tone: IconChipTone = "info"): string {
  return `rounded-full items-center justify-center ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]}`;
}
