/**
 * Provider, service date, amount billed, what the service was, and whether
 * it's already been paid. Shared field primitives, fixed labels.
 */
import { useRef } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { CurrencyField } from "@/src/shared/components/CurrencyField";
import { DateField } from "@/src/shared/components/DateField";
import { FormFieldShell } from "@/src/shared/components/FormFieldShell";
import { SelectField, type SelectOption } from "@/src/shared/components/SelectField";
import { colors } from "@/src/shared/theme/colors";
import { composeFieldAccessibilityLabel } from "@/src/shared/services/formFieldLabel";
import {
  firstErrorForField,
  toIsoDate,
  PROVIDER_NAME_MAX_LENGTH,
  SERVICE_DESCRIPTION_MAX_LENGTH,
  type ClaimSubmissionFieldId,
  type ClaimSubmissionValidationIssue,
} from "../services/claimSubmissionValidation";
import { formatTransactionDate } from "../services/receiptSize";
import type { ClaimSubmissionFormValues } from "../types";

interface ClaimDetailsStepProps {
  values: ClaimSubmissionFormValues;
  onChange: <K extends keyof ClaimSubmissionFormValues>(key: K, value: ClaimSubmissionFormValues[K]) => void;
  issues: readonly ClaimSubmissionValidationIssue[];
  disabled: boolean;
  onDescriptionFocus?: () => void;
}

export function ClaimDetailsStep({ values, onChange, issues, disabled, onDescriptionFocus }: ClaimDetailsStepProps) {
  const { t } = useTranslation();
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const errorFor = (field: ClaimSubmissionFieldId): string | null => {
    const issue = firstErrorForField(issues, field);
    return issue ? t(issue.messageKey) : null;
  };

  const alreadyPaidOptions: SelectOption[] = [
    { value: "yes", label: t("claimSubmission.alreadyPaid.yes") },
    { value: "no", label: t("claimSubmission.alreadyPaid.no") },
  ];

  // Service dates can't be in the future.
  const today = toIsoDate(new Date());

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-4">{t("claimSubmission.details.title")}</span>

      <FormFieldShell label={t("claimSubmission.fields.provider")} required error={errorFor("provider")}>
        <input
          value={values.providerName}
          onChange={(e) => onChange("providerName", e.target.value)}
          disabled={disabled}
          maxLength={PROVIDER_NAME_MAX_LENGTH}
          enterKeyHint="next"
          onKeyDown={(e) => {
            if (e.key === "Enter") descriptionInputRef.current?.focus();
          }}
          className="rounded-xl px-3 py-3 bg-brand-surface border text-base text-brand-primary outline-none"
          style={{ borderColor: errorFor("provider") ? colors.error : colors.border }}
          aria-label={composeFieldAccessibilityLabel({
            label: t("claimSubmission.fields.provider"),
            required: true,
            requiredText: t("forms.required"),
          })}
        />
      </FormFieldShell>

      <DateField
        label={t("claimSubmission.fields.serviceDate")}
        value={values.serviceDate}
        onChange={(date) => onChange("serviceDate", date)}
        required
        error={errorFor("serviceDate")}
        maximumDate={today}
        displayValue={values.serviceDate ? formatTransactionDate(values.serviceDate) : null}
        disabled={disabled}
      />

      <CurrencyField
        label={t("claimSubmission.fields.amount")}
        value={values.amount}
        onChangeText={(text) => onChange("amount", text)}
        required
        error={errorFor("amount")}
        editable={!disabled}
      />

      <FormFieldShell
        label={t("claimSubmission.fields.description")}
        required
        error={errorFor("description")}
        helpText={t("claimSubmission.fields.descriptionHelp")}
      >
        <textarea
          ref={descriptionInputRef}
          onFocus={onDescriptionFocus}
          value={values.serviceDescription}
          onChange={(e) => onChange("serviceDescription", e.target.value)}
          disabled={disabled}
          rows={3}
          maxLength={SERVICE_DESCRIPTION_MAX_LENGTH}
          className="rounded-xl px-3 py-3 bg-brand-surface border text-base text-brand-primary outline-none resize-none"
          style={{
            borderColor: errorFor("description") ? colors.error : colors.border,
            minHeight: 80,
            maxHeight: 160,
          }}
          aria-label={composeFieldAccessibilityLabel({
            label: t("claimSubmission.fields.description"),
            required: true,
            requiredText: t("forms.required"),
          })}
        />
      </FormFieldShell>

      <SelectField
        label={t("claimSubmission.fields.alreadyPaid")}
        value={values.alreadyPaid}
        options={alreadyPaidOptions}
        onSelect={(value) => onChange("alreadyPaid", value as "yes" | "no")}
        required
        error={errorFor("alreadyPaid")}
        disabled={disabled}
      />
    </div>
  );
}
