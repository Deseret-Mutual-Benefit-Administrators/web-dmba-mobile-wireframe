import type { CSSProperties, ReactNode } from "react";
import { Spinner } from "./Spinner";
import { buttonClasses } from "./buttonClasses";
import type { ButtonSize, ButtonVariant } from "./buttonClasses";

export { buttonClasses } from "./buttonClasses";
export type { ButtonClasses, ButtonSize, ButtonVariant } from "./buttonClasses";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Leading icon, rendered before the label. Hidden while `loading`. */
  icon?: ReactNode;
  /** Margin/positioning only — canon padding/rounding/color come from `variant`/`size`. */
  className?: string;
  style?: CSSProperties;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

/**
 * Canonical button. Three variants (primary/secondary/ghost), two sizes (md/sm).
 * `loading` swaps the label for a Spinner and blocks presses; `disabled` dims and
 * blocks presses. `className` is appended after the canon classes and is for
 * spacing only.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = buttonClasses(variant, size, { disabled, fullWidth });
  const spinnerTone = variant === "primary" ? "onDark" : "accent";

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={isDisabled}
      className={[classes.container, className ?? ""].filter(Boolean).join(" ")}
      style={style}
      aria-label={accessibilityLabel ?? label}
      aria-description={accessibilityHint}
      aria-disabled={isDisabled}
      aria-busy={loading}
      data-testid={testID}
    >
      {loading ? (
        <Spinner size="small" tone={spinnerTone} />
      ) : (
        <>
          {icon ? <div className="mr-2">{icon}</div> : null}
          <span className={classes.label}>{label}</span>
        </>
      )}
    </button>
  );
}
