import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { fabClasses } from "./fabClasses";

export { fabClasses } from "./fabClasses";
export type { FabClasses } from "./fabClasses";

/** The `bottom-6` in `fabClasses`, in points — the base a `bottomInset` is added to. */
const FAB_BOTTOM_OFFSET = 24;

interface FloatingActionButtonProps {
  /** An Ionicons name, resolved through `src/shared/icons.tsx`. */
  icon: string;
  iconSize?: number;
  onPress: () => void;
  /** Required — icon-only control. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  /** Small status dot, top-right. Decorative. */
  showBadge?: boolean;
  /** Extra distance from the bottom edge, added to the standard 24pt offset. */
  bottomInset?: number;
  disabled?: boolean;
  testID?: string;
}

/** 56pt accent circle, bottom-right of its positioned parent, icon only. */
export function FloatingActionButton({
  icon,
  iconSize = 26,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  showBadge = false,
  bottomInset = 0,
  disabled = false,
  testID,
}: FloatingActionButtonProps) {
  const classes = fabClasses({ disabled });

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={`${classes.container} active:opacity-80`}
      style={{ zIndex: 20, ...(bottomInset > 0 ? { bottom: FAB_BOTTOM_OFFSET + bottomInset } : {}) }}
      aria-label={accessibilityLabel}
      title={accessibilityHint}
      data-testid={testID}
    >
      <Icon name={icon} size={iconSize} color={colors.brand.surface} />
      {showBadge && <div className={classes.badge} aria-hidden="true" />}
    </button>
  );
}
