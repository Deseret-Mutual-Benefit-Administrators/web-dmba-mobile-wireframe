/**
 * Pure class-string builder behind `SegmentedControl.tsx` — see
 * `buttonClasses.ts` for why this lives in a React-Native-free sibling
 * module.
 *
 * Only the track (a `View`) and the labels (`Text`) carry NativeWind classes.
 * The segment buttons themselves are `TouchableOpacity` + an inline style
 * object built in `SegmentedControl.tsx` — `Pressable` + `className` on a
 * segment control is gotcha 9's reproduced shape (developer guide; third
 * reproduction 2026-09-04 on this very component under the New Architecture
 * dev client: "Couldn't find a navigation context").
 */

export interface SegmentedControlClasses {
  track: string;
  label: string;
  labelActive: string;
}

/**
 * Class strings for the iOS-style segmented control's track and labels. All
 * values are complete static literals (no `${}` interpolation) so NativeWind's
 * static class extraction can see every class the component can ever render.
 * Kept as a function (called with no args) to match the other primitives'
 * `xClasses()` convention.
 */
export function segmentedControlClasses(): SegmentedControlClasses {
  return {
    track: "flex-row bg-gray-100 rounded-xl p-1 mx-4 mt-3",
    label: "text-sm font-medium text-gray-600",
    labelActive: "text-sm font-semibold text-brand-primary",
  };
}
