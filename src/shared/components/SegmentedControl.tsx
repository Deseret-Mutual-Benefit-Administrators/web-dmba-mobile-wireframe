import type { CSSProperties } from "react";
import { colors } from "@/src/shared/theme/colors";
import { cardShadowStyle } from "./Card";
import { segmentedControlClasses } from "./segmentedControlClasses";

export { segmentedControlClasses } from "./segmentedControlClasses";
export type { SegmentedControlClasses } from "./segmentedControlClasses";

export interface SegmentedControlSegment<K extends string> {
  key: K;
  label: string;
}

interface SegmentedControlProps<K extends string> {
  segments: ReadonlyArray<SegmentedControlSegment<K>>;
  value: K;
  onChange: (key: K) => void;
  /** Names the group for assistive tech, e.g. "Messages and AI Advisor". */
  accessibilityLabel: string;
  testID?: string;
}

/**
 * Inline style for one segment: 44pt minimum height, radius 8; the active pill is
 * surface + the app-standard card shadow.
 */
function segmentStyle(isActive: boolean): CSSProperties {
  const base: CSSProperties = {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 44,
  };
  return isActive ? { ...base, backgroundColor: colors.brand.surface, ...cardShadowStyle } : base;
}

/**
 * iOS-style track with a raised active pill. Use it to switch between peer
 * content sources on one screen; underline strips are for a screen's own
 * sections, pill filters narrow one list.
 */
export function SegmentedControl<K extends string>({ segments, value, onChange, accessibilityLabel, testID }: SegmentedControlProps<K>) {
  const classes = segmentedControlClasses();

  return (
    <div className={classes.track} role="tablist" aria-label={accessibilityLabel} data-testid={testID}>
      {segments.map((segment) => {
        const isActive = segment.key === value;
        return (
          <button
            type="button"
            key={segment.key}
            onClick={() => {
              if (!isActive) onChange(segment.key);
            }}
            className="active:opacity-80"
            style={segmentStyle(isActive)}
            role="tab"
            aria-selected={isActive}
            aria-label={segment.label}
          >
            <span className={isActive ? classes.labelActive : classes.label}>{segment.label}</span>
          </button>
        );
      })}
    </div>
  );
}
