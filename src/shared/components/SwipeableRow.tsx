import { useCallback, useState, type ReactNode } from "react";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { swipeableRowClasses, type SwipeRowTone } from "./swipeableRowClasses";

export { swipeableRowClasses } from "./swipeableRowClasses";
export type { SwipeRowTone, SwipeRowToneClasses } from "./swipeableRowClasses";

export interface SwipeRowAction {
  key: string;
  /** Button text + aria-label. */
  label: string;
  /** aria-description. */
  hint: string;
  icon: string;
  tone: SwipeRowTone;
  onPress: () => void;
  /** When present, a confirm dialog gates `onPress`. */
  confirm?: {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
  };
}

/**
 * The accessibility bundle handed to `children`. Kept for prop parity with the
 * app; on the web the actions are real buttons, so these are informational.
 */
export interface SwipeRowAccessibility {
  accessibilityActions: { name: string; label: string }[];
  onAccessibilityAction: (event: { nativeEvent: { actionName: string } }) => void;
}

interface SwipeableRowProps {
  /** Revealed by swiping right in the app. At most one. */
  leading?: SwipeRowAction;
  /** Revealed by swiping left in the app. At most one. */
  trailing?: SwipeRowAction;
  /** Spacing between rows (e.g. `"mb-2"`). Sits outside the clipped area. */
  className?: string;
  children: (accessibility: SwipeRowAccessibility) => ReactNode;
}

/** Revealed action width in the app, in points. */
const ACTION_WIDTH = 88;
/** rounded-xl (12px) — matches the row cards this wraps. */
const ROW_RADIUS = 12;

/**
 * Web version of the swipe-to-reveal row. There is no swipe gesture: a small
 * "⋯" toggle in the row's bottom-right corner reveals the leading action on the
 * left and the trailing action on the right, at the app's 88pt width, inside the
 * same rounded clip. Clicking the toggle again, or an action, closes it.
 */
export function SwipeableRow({ leading, trailing, className, children }: SwipeableRowProps) {
  const [open, setOpen] = useState(false);

  const runAction = useCallback((action: SwipeRowAction) => {
    setOpen(false);
    if (action.confirm) {
      if (window.confirm(`${action.confirm.title}\n\n${action.confirm.message}`)) action.onPress();
    } else {
      action.onPress();
    }
  }, []);

  const accessibilityActions = [
    ...(leading ? [{ name: leading.key, label: leading.label }] : []),
    ...(trailing ? [{ name: trailing.key, label: trailing.label }] : []),
  ];

  const onAccessibilityAction = (event: { nativeEvent: { actionName: string } }) => {
    const name = event.nativeEvent.actionName;
    if (leading && name === leading.key) runAction(leading);
    else if (trailing && name === trailing.key) runAction(trailing);
  };

  const renderAction = (action: SwipeRowAction) => {
    const classes = swipeableRowClasses[action.tone];
    return (
      <button
        type="button"
        onClick={() => runAction(action)}
        className={classes.button}
        style={{ width: ACTION_WIDTH }}
        aria-label={action.label}
        title={action.hint}
      >
        <Icon name={action.icon} size={22} color={colors.brand.surface} />
        <span className={`${classes.label} truncate`}>{action.label}</span>
      </button>
    );
  };

  const hasActions = leading !== undefined || trailing !== undefined;

  return (
    <div className={className}>
      <div className="flex-row" style={{ borderRadius: ROW_RADIUS, overflow: "hidden" }}>
        {open && leading ? renderAction(leading) : null}
        <div className="flex-1">{children({ accessibilityActions, onAccessibilityAction })}</div>
        {open && trailing ? renderAction(trailing) : null}
        {hasActions && (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="absolute bottom-1 right-1 w-6 h-6 rounded-full items-center justify-center bg-gray-100/80 active:opacity-80"
            style={{ zIndex: 1, ...(open && trailing ? { right: ACTION_WIDTH + 4 } : {}) }}
            aria-label={open ? "Hide row actions" : "Show row actions"}
            aria-expanded={open}
          >
            <Icon name="ellipsis-horizontal" size={14} color={colors.neutral[600]} />
          </button>
        )}
      </div>
    </div>
  );
}
