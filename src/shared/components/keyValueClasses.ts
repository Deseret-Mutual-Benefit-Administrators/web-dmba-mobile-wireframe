/**
 * Pure class-string builder behind `KeyValueRow.tsx` — see `buttonClasses.ts`
 * for why this lives in a React-Native-free sibling module.
 */

export type KeyValueTone = "default" | "success" | "error";

export interface KeyValueClasses {
  row: string;
  value: string;
}

export function keyValueClasses(
  opts: {
    emphasize?: boolean;
    tone?: KeyValueTone;
    divider?: boolean;
    /** Total/summary rows ("You Owe") keep their larger value text. Implies emphasize. */
    prominent?: boolean;
  } = {}
): KeyValueClasses {
  const { emphasize = false, tone = "default", divider = false, prominent = false } = opts;

  const row = [
    "flex-row justify-between items-center py-2",
    divider ? "border-b border-gray-100" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const toneClass: Record<KeyValueTone, string> = {
    default: "text-brand-primary",
    success: "text-success",
    error: "text-error",
  };

  const value = [
    prominent ? "text-base" : "text-sm",
    toneClass[tone],
    emphasize || prominent ? "font-semibold font-sans-bold" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return { row, value };
}
