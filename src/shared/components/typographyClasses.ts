/**
 * Pure class-string map behind `Typography.tsx` — see `buttonClasses.ts` for
 * why this lives in a React-Native-free sibling module rather than inside
 * the component file.
 *
 * Chosen by grepping for the majority-used pattern at each tier:
 * `sectionTitle` tied 13/13 between `text-base` and `text-lg`
 * font-semibold-brand-primary in a repo grep; `text-base` won as the
 * tiebreaker because it spans far more distinct feature folders (`text-lg`
 * was concentrated almost entirely in one — `spending-claims`). `label`
 * (`text-sm`, 16 hits) and `caption` (`text-xs`, 23 hits) were unambiguous
 * majorities on size. Both were originally the gray-400 majority-grep color;
 * that shade measures 2.54:1 on white (fails WCAG AA's 4.5:1 for normal
 * text), so `caption` and `eyebrow` were moved to gray-500 (4.83:1) on
 * 2026-09-02 (ADR-164) — the gray-400 text class is now denylisted app-wide,
 * see `__tests__/shared/classDenylist.test.ts`.
 *
 * `font-sans`/`font-sans-bold` are the Oxygen family classes (Phase A
 * tokens). `font-semibold`/`font-bold` stay alongside as the pre-Oxygen
 * fallback weight, per the Phase A note that RN doesn't synthesize bold from
 * a custom family name — the family class is what actually embolds it.
 */
export const typographyClasses = {
  sectionTitle: "text-base font-semibold font-sans-bold text-brand-primary",
  label: "text-sm font-sans text-gray-500",
  caption: "text-xs font-sans text-gray-500",
  eyebrow: "text-xs font-semibold font-sans-bold uppercase tracking-wide text-gray-500",
} as const;
