/**
 * Pure class-string builder behind `FloatingActionButton.tsx`, kept in its
 * own React-Native-free module — same convention as `buttonClasses.ts`
 * (Jest here runs with `testEnvironment: "node"` and doesn't transform
 * `react-native`, so a test importing the component directly fails on
 * `react-native`'s Flow syntax before reaching this logic).
 */

export interface FabClasses {
  container: string;
  badge: string;
}

/**
 * Container/badge class strings for the floating action button. Kept as a
 * complete literal string (never `${...}` interpolation) so NativeWind's
 * static class extraction can see every class the component can ever
 * render.
 */
export function fabClasses(opts: { disabled?: boolean } = {}): FabClasses {
  const { disabled = false } = opts;

  const container = [
    "absolute bottom-6 right-6 w-14 h-14 rounded-full bg-brand-accent items-center justify-center shadow-lg",
    disabled ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const badge = "absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-error border-2 border-brand-surface";

  return { container, badge };
}
