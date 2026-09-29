/**
 * Currency text input. Money is integer cents at every boundary: the value is
 * the typed text, `onChangeCents` reports parsed cents (or null).
 */
import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { FormFieldShell } from "@/src/shared/components/FormFieldShell";
import { formatAmountInput, parseAmountInput } from "@/src/shared/services/amountInput";
import { composeFieldAccessibilityLabel } from "@/src/shared/services/formFieldLabel";
import { colors } from "@/src/shared/theme/colors";

interface CurrencyFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onChangeCents?: (cents: number | null) => void;
  required?: boolean;
  error?: string | null;
  helpText?: string | null;
  editable?: boolean;
  testID?: string;
}

export function CurrencyField({
  label,
  value,
  onChangeText,
  onChangeCents,
  required = false,
  error = null,
  helpText = null,
  editable = true,
  testID,
}: CurrencyFieldProps) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const { cents } = parseAmountInput(value);

  const handleChangeText = (text: string) => {
    onChangeText(text);
    onChangeCents?.(parseAmountInput(text).cents);
  };

  // Normalize shorthand on blur ("1." → "1.00"); untouched when it doesn't parse.
  const handleBlur = () => {
    setFocused(false);
    if (cents !== null) {
      const normalized = formatAmountInput(cents);
      if (normalized !== value) onChangeText(normalized);
    }
  };

  return (
    <FormFieldShell label={label} required={required} error={error} helpText={helpText}>
      <div
        className="flex-row items-center rounded-xl px-3 py-3 bg-brand-surface border"
        style={{ borderColor: error ? colors.error : focused ? colors.brand.accent : colors.border }}
      >
        <span className="text-base text-gray-500 mr-1" aria-hidden="true">
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => handleChangeText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          readOnly={!editable}
          placeholder="0.00"
          className="flex-1 text-base text-brand-primary placeholder:text-gray-500"
          data-testid={testID}
          aria-label={composeFieldAccessibilityLabel({ label, required, requiredText: t("forms.required") })}
        />
      </div>
    </FormFieldShell>
  );
}
