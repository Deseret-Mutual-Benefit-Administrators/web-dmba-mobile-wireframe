/**
 * Date field. Values are ISO `yyyy-MM-dd` strings throughout, never Date objects.
 * The app shows a styled trigger that opens the platform picker; the web keeps the
 * same trigger box (border, radius 12, calendar icon) with a native
 * `<input type="date">` laid over it, so clicking opens the browser's picker.
 */
import { useTranslation } from "@/src/shared/i18n";
import { FormFieldShell } from "@/src/shared/components/FormFieldShell";
import { Icon } from "@/src/shared/icons";
import { composeSelectAccessibilityLabel } from "@/src/shared/services/formFieldLabel";
import { colors } from "@/src/shared/theme/colors";

interface DateFieldProps {
  label: string;
  /** ISO `yyyy-MM-dd`, or "" when nothing is chosen yet. */
  value: string;
  onChange: (isoDate: string) => void;
  required?: boolean;
  error?: string | null;
  helpText?: string | null;
  minimumDate?: string | null;
  maximumDate?: string | null;
  /** Resolved display text for the chosen date. */
  displayValue?: string | null;
  /** Shown when nothing is chosen. Defaults to `forms.selectDate`. */
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
}

export function DateField({
  label,
  value,
  onChange,
  required = false,
  error = null,
  helpText = null,
  minimumDate = null,
  maximumDate = null,
  displayValue = null,
  placeholder,
  disabled = false,
  testID,
}: DateFieldProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("forms.selectDate");
  const shownText = value === "" ? resolvedPlaceholder : displayValue || value;

  return (
    <FormFieldShell label={label} required={required} error={error} helpText={helpText}>
      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: disabled ? colors.neutral[50] : colors.brand.surface,
          border: `1px solid ${error ? colors.error : colors.border}`,
          borderRadius: 12,
          padding: "14px 12px",
        }}
      >
        <span className="truncate" style={{ flex: 1, fontSize: 16, color: value === "" ? colors.neutral[500] : colors.brand.primary }}>
          {shownText}
        </span>
        <Icon name="calendar-outline" size={18} color={colors.brand.secondary} />
        <input
          type="date"
          value={value}
          min={minimumDate ?? undefined}
          max={maximumDate ?? undefined}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
          className="absolute inset-0 opacity-0 cursor-pointer"
          data-testid={testID}
          aria-label={composeSelectAccessibilityLabel({
            label,
            required,
            requiredText: t("forms.required"),
            selectedLabel: value === "" ? "" : displayValue || value,
            placeholder: resolvedPlaceholder,
          })}
        />
      </div>
    </FormFieldShell>
  );
}
