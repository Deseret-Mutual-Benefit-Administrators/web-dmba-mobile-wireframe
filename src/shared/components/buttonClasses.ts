/**
 * Pure class-string builder behind `Button.tsx`, kept in its own
 * React-Native-free module. Jest here runs with `testEnvironment: "node"`
 * and doesn't transform `react-native` itself (see `package.json`'s
 * `transformIgnorePatterns`) — a test importing `Button.tsx` directly fails
 * on `react-native`'s Flow syntax before it ever reaches this logic. Every
 * primitive in this folder that needs a unit-tested builder splits it out
 * like this; the component file re-exports the same names for callers.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

export interface ButtonClasses {
  container: string;
  label: string;
}

/**
 * Container/label class strings for every variant × size combination, plus
 * the disabled/fullWidth modifiers. Kept as complete literal strings (never
 * `${variant}` interpolation) so NativeWind's static class extraction can
 * see every class the component can ever render.
 */
export function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  opts: { disabled?: boolean; fullWidth?: boolean } = {}
): ButtonClasses {
  const { disabled = false, fullWidth = false } = opts;

  const base = "rounded-xl active:opacity-80 flex-row items-center justify-center";
  // md already clears the 44pt WCAG 2.1 SC 2.5.5 minimum via padding alone in
  // most cases, but min-h-[44px] makes that a floor rather than an accident
  // (short labels, custom fonts). sm is genuinely sub-44pt by design — see
  // hitSlopFor(36) on the Pressable in Button.tsx instead of padding it out
  // visually, which would blur the size distinction from md.
  const sizeContainer = size === "sm" ? "px-4 py-2" : "px-6 py-3 min-h-[44px]";
  const sizeLabel = size === "sm" ? "text-sm" : "text-base";

  const variantContainer: Record<ButtonVariant, string> = {
    primary: "bg-brand-accent",
    secondary: "border border-brand-accent bg-transparent",
    ghost: "",
  };
  // font-sans-bold is the Oxygen bold family (Phase A tokens); font-semibold
  // stays alongside as the pre-Oxygen fallback weight, matching typographyClasses.
  const variantLabel: Record<ButtonVariant, string> = {
    primary: "text-white font-semibold font-sans-bold",
    secondary: "text-brand-accent font-semibold font-sans-bold",
    ghost: "text-brand-accent font-semibold font-sans-bold",
  };

  const container = [
    base,
    sizeContainer,
    variantContainer[variant],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const label = [variantLabel[variant], sizeLabel].filter(Boolean).join(" ");

  return { container, label };
}
