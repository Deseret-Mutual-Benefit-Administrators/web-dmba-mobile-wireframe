/**
 * Pure tone → class map behind `SwipeableRow.tsx`'s revealed action button —
 * see `buttonClasses.ts` for why this lives in a React-Native-free sibling
 * module (Jest here runs with `testEnvironment: "node"` and can't transform
 * `react-native`'s Flow syntax, so tests import this builder directly and
 * never the component).
 *
 * Two tones only, both solid fills (never a tint) so the revealed action reads
 * as "this will happen," not as a status chip:
 *   neutral     → `bg-brand-accent`  (Archive/Unarchive and the read-state
 *                                     toggle — the app's one blue, the same
 *                                     fill `Button` primary uses)
 *   destructive → `bg-error`         (the app's one red; no swipe action uses
 *                                     it since ADR-208 removed member delete,
 *                                     and it stays for the next one that is
 *                                     genuinely destructive)
 *
 * The button fills the swipeable's full height (`h-full`); its width is a
 * fixed point value set by the component, not a class — `ReanimatedSwipeable`
 * measures the action's own laid-out width to decide how far the row opens, so
 * it must have an intrinsic width and must never be `flex-1`.
 */

export type SwipeRowTone = "destructive" | "neutral";

export interface SwipeRowToneClasses {
  /** The full-height action button revealed behind the row. */
  button: string;
  label: string;
}

export const swipeableRowClasses: Record<SwipeRowTone, SwipeRowToneClasses> = {
  destructive: {
    button: "h-full items-center justify-center px-2 bg-error",
    label: "text-white text-xs font-semibold font-sans-bold mt-1",
  },
  neutral: {
    button: "h-full items-center justify-center px-2 bg-brand-accent",
    label: "text-white text-xs font-semibold font-sans-bold mt-1",
  },
};
