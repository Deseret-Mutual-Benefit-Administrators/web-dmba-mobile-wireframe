/**
 * Pure class-string builder behind `ToggleRow.tsx` — see `buttonClasses.ts` for
 * why this lives in a React-Native-free sibling module.
 */

export interface ToggleRowClasses {
  row: string;
  textWrap: string;
  label: string;
  description: string;
}

/**
 * `divider` draws the top hairline used between stacked rows in a card (every
 * row except the first). Kept as a single literal string per branch (never
 * `${cond}` interpolation) so NativeWind's static class extraction sees both.
 */
export function toggleRowClasses(opts: { divider?: boolean } = {}): ToggleRowClasses {
  const { divider = false } = opts;

  const row = [
    "flex-row items-center px-4 py-3",
    divider ? "border-t border-gray-100" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    row,
    textWrap: "flex-1 pr-3",
    label: "text-sm font-medium text-brand-primary",
    description: "text-xs text-gray-500 mt-0.5",
  };
}
