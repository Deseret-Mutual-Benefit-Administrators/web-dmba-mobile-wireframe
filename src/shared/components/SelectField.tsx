/**
 * Single-select field: a trigger that expands an option list inline, directly
 * beneath itself (the app moved off a modal sheet because it rendered
 * off-screen inside modal screens). Keep it inside a scroll view.
 */
import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { FormFieldShell } from "@/src/shared/components/FormFieldShell";
import { Icon } from "@/src/shared/icons";
import { composeSelectAccessibilityLabel } from "@/src/shared/services/formFieldLabel";
import { colors, withAlpha } from "@/src/shared/theme/colors";

export interface SelectOption {
  value: string;
  /** Visible option text, rendered as supplied. */
  label: string;
  /** Optional second line — a relationship, a role, a qualifier. */
  secondary?: string;
}

interface SelectFieldProps {
  label: string;
  /** Currently selected option value, or "" for nothing selected. */
  value: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  required?: boolean;
  error?: string | null;
  helpText?: string | null;
  /** Shown when nothing is selected. Defaults to `forms.select`. */
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
}

export function SelectField({
  label,
  value,
  options,
  onSelect,
  required = false,
  error = null,
  helpText = null,
  placeholder,
  disabled = false,
  testID,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const resolvedPlaceholder = placeholder ?? t("forms.select");
  const selected = options.find((option) => option.value === value);
  const isDisabled = disabled || options.length === 0;

  return (
    <FormFieldShell label={label} required={required} error={error} helpText={helpText}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={isDisabled}
        className="active:opacity-70"
        data-testid={testID}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: isDisabled ? colors.neutral[50] : colors.brand.surface,
          border: `1px solid ${error ? colors.error : colors.border}`,
          borderRadius: 12,
          padding: "14px 12px",
        }}
        aria-label={composeSelectAccessibilityLabel({
          label,
          required,
          requiredText: t("forms.required"),
          selectedLabel: selected?.label ?? "",
          placeholder: resolvedPlaceholder,
        })}
        aria-expanded={open}
      >
        <div style={{ flex: 1 }}>
          <span className="truncate" style={{ fontSize: 16, color: selected ? colors.brand.primary : colors.neutral[500] }}>
            {selected?.label ?? resolvedPlaceholder}
          </span>
          {selected?.secondary ? (
            <span className="truncate" style={{ fontSize: 12, color: colors.neutral[500], marginTop: 2 }}>
              {selected.secondary}
            </span>
          ) : null}
        </div>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.brand.secondary} />
      </button>

      {open && (
        <div
          style={{ marginTop: 4, border: `1px solid ${colors.border}`, borderRadius: 12, backgroundColor: colors.brand.surface, overflow: "hidden" }}
          role="radiogroup"
        >
          {options.map((option, index) => {
            const checked = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  setOpen(false);
                  onSelect(option.value);
                }}
                className="active:opacity-70"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderTop: index > 0 ? `1px solid ${colors.neutral[100]}` : undefined,
                  backgroundColor: checked ? withAlpha(colors.financial.gradientStart, 0.08) : undefined,
                }}
                role="radio"
                aria-checked={checked}
                aria-label={option.secondary ? `${option.label}, ${option.secondary}` : option.label}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 15, color: checked ? colors.brand.accent : colors.brand.primary, fontWeight: checked ? 600 : 400 }}>
                    {option.label}
                  </span>
                  {option.secondary ? (
                    <span style={{ fontSize: 12, color: colors.neutral[500], marginTop: 1 }}>{option.secondary}</span>
                  ) : null}
                </div>
                {checked && <Icon name="checkmark" size={18} color={colors.brand.accent} />}
              </button>
            );
          })}
        </div>
      )}
    </FormFieldShell>
  );
}
