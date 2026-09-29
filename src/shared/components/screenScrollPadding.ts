/**
 * Pure padding calculation behind `ScreenScrollView.tsx`'s
 * `contentContainerStyle` — see `buttonClasses.ts` for why this lives in a
 * React-Native-free sibling module.
 */
export function screenScrollPadding(insetsBottom: number, padded: boolean, bottomExtra: number) {
  return {
    paddingHorizontal: padded ? 16 : 0,
    paddingBottom: insetsBottom + 24 + bottomExtra,
  };
}
