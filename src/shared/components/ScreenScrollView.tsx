import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { screenScrollPadding } from "./screenScrollPadding";

export { screenScrollPadding } from "./screenScrollPadding";

/** The app pads by `useSafeAreaInsets().bottom`; the phone frame's home-indicator zone is 34. */
const INSETS_BOTTOM = 34;

interface ScreenScrollViewProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  bottomExtra?: number;
  /** Merged on top of the computed padding (e.g. to add `gap`). */
  contentContainerStyle?: CSSProperties;
  contentContainerClassName?: string;
  style?: CSSProperties;
}

/**
 * Canonical screen-level scroll container: `bg-brand-background`, 16px side
 * padding when `padded`, 24px bottom padding plus `bottomExtra`. Forwards `ref`
 * to the scrolling element so a caller can scroll to the end.
 */
export const ScreenScrollView = forwardRef<HTMLDivElement, ScreenScrollViewProps>(function ScreenScrollView(
  { children, className, padded = true, bottomExtra = 0, contentContainerStyle, contentContainerClassName, style },
  ref
) {
  const padding = screenScrollPadding(INSETS_BOTTOM, padded, bottomExtra);
  return (
    <div
      ref={ref}
      className={["flex-1 bg-brand-background overflow-y-auto scrollbar-none", className ?? ""].filter(Boolean).join(" ")}
      style={{ minHeight: 0, ...style }}
    >
      <div
        className={contentContainerClassName}
        style={{ paddingLeft: padding.paddingHorizontal, paddingRight: padding.paddingHorizontal, paddingBottom: padding.paddingBottom, ...contentContainerStyle }}
      >
        {children}
      </div>
    </div>
  );
});
