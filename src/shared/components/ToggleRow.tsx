import { colors } from "@/src/shared/theme/colors";
import { toggleRowClasses } from "./toggleRowClasses";

export { toggleRowClasses } from "./toggleRowClasses";

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: () => void;
  /** Falls back to `label`. */
  accessibilityLabel?: string;
  /** Draws the top hairline between stacked rows. Omit on the first row. */
  divider?: boolean;
  disabled?: boolean;
  testID?: string;
}

/**
 * Label (+ optional description) beside a switch. Web: a CSS switch at iOS
 * geometry (51×31 track, 27px thumb), track accent when on, border colour off.
 */
export function ToggleRow({ label, description, value, onValueChange, accessibilityLabel, divider = false, disabled = false, testID }: ToggleRowProps) {
  const classes = toggleRowClasses({ divider });

  return (
    <div className={classes.row} data-testid={testID}>
      <div className={classes.textWrap}>
        <span className={classes.label}>{label}</span>
        {description ? <span className={classes.description}>{description}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={accessibilityLabel ?? label}
        disabled={disabled}
        onClick={onValueChange}
        style={{
          width: 51,
          height: 31,
          borderRadius: 999,
          backgroundColor: value ? colors.brand.accent : colors.border,
          transition: "background-color 150ms",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? 22 : 2,
            width: 27,
            height: 27,
            borderRadius: 999,
            backgroundColor: colors.brand.surface,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "left 150ms",
          }}
        />
      </button>
    </div>
  );
}
