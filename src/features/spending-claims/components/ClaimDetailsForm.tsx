/**
 * Dates, amount, provider and comments — rendered from the template-derived
 * schema (ADR-107). A vendor label wins over ours; when any is in play, one
 * "administrator's wording" note appears above the fields.
 */
import { useRef } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { CurrencyField } from "@/src/shared/components/CurrencyField";
import { DateField } from "@/src/shared/components/DateField";
import { FormFieldShell } from "@/src/shared/components/FormFieldShell";
import { colors } from "@/src/shared/theme/colors";
import { composeFieldAccessibilityLabel } from "@/src/shared/services/formFieldLabel";
import { formatTransactionDate } from "@/src/features/financial-accounts/services/accountTransforms";
import { findClaimFormField } from "../services/claimFormSchema";
import { firstErrorForField, NOTES_MAX_LENGTH, PROVIDER_MAX_LENGTH } from "../services/claimFormValidation";
import { buildServerErrorValues, resolveIssueMessageSource, type ClaimServerValidation } from "../services/claimErrors";
import type {
  ClaimEntryTemplate,
  ClaimFormFieldId,
  ClaimFormSchema,
  ClaimFormValidationResult,
  ClaimFormValues,
} from "../types";

/** Stand-in for `src/shared/services/dateInput.toDateOnly`. */
function toDateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

/** The wireframe's i18n is English-only. */
const LANGUAGE = "en";

interface ClaimDetailsFormProps {
  schema: ClaimFormSchema;
  template: ClaimEntryTemplate;
  values: ClaimFormValues;
  onChange: <K extends keyof ClaimFormValues>(key: K, value: ClaimFormValues[K]) => void;
  validation: ClaimFormValidationResult | null;
  serverErrors: ClaimServerValidation;
  disabled: boolean;
}

export function ClaimDetailsForm({ schema, template, values, onChange, validation, serverErrors, disabled }: ClaimDetailsFormProps) {
  const { t } = useTranslation();
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  const serverErrorValues = buildServerErrorValues(template);

  const labelFor = (id: ClaimFormFieldId): string => {
    const field = findClaimFormField(schema, id);
    if (!field) return "";
    return field.label ?? (field.labelKey ? t(field.labelKey) : "");
  };

  const isRequired = (id: ClaimFormFieldId): boolean => findClaimFormField(schema, id)?.flags.required ?? false;

  const errorFor = (id: ClaimFormFieldId): string | null => {
    const serverIssue = serverErrors.fieldErrors[id]?.[0];
    if (serverIssue) {
      const source = resolveIssueMessageSource(serverIssue, LANGUAGE);
      return source.kind === "serverProse" ? source.text : t(source.messageKey, serverErrorValues);
    }
    const rule = validation ? firstErrorForField(validation, id) : undefined;
    return rule ? t(rule.messageKey, { label: labelFor(id), ...rule.messageValues }) : null;
  };

  const startField = findClaimFormField(schema, "serviceStartDate");
  const endField = findClaimFormField(schema, "serviceEndDate");
  const amountField = findClaimFormField(schema, "amount");
  const providerField = findClaimFormField(schema, "provider");
  const notesField = findClaimFormField(schema, "notes");

  const windowStart = toDateOnly(template.serviceWindow?.startDate) || null;
  const windowEnd = toDateOnly(template.serviceWindow?.endDate) || null;

  const hasVendorLabel = [startField, endField, amountField, providerField, notesField].some((field) => field?.label != null);

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-4">{t("spendingClaims.details.title")}</span>

      {hasVendorLabel && (
        <div className="flex-row items-start rounded-lg px-3 py-2 mb-4 bg-info-tint">
          <span aria-hidden="true" style={{ marginTop: 1, display: "flex" }}>
            <Icon name="information-circle-outline" size={16} color={colors.brand.accent} />
          </span>
          <span className="text-xs text-brand-primary ml-2 flex-1">{t("spendingClaims.vendorCopyNote")}</span>
        </div>
      )}

      {startField && (
        <DateField
          label={labelFor("serviceStartDate")}
          value={values.serviceStartDate}
          onChange={(date) => onChange("serviceStartDate", date)}
          required={isRequired("serviceStartDate")}
          error={errorFor("serviceStartDate")}
          minimumDate={windowStart}
          maximumDate={windowEnd}
          displayValue={values.serviceStartDate ? formatTransactionDate(values.serviceStartDate) : null}
          disabled={disabled}
        />
      )}

      {endField && (
        <DateField
          label={labelFor("serviceEndDate")}
          value={values.serviceEndDate}
          onChange={(date) => onChange("serviceEndDate", date)}
          required={isRequired("serviceEndDate")}
          error={errorFor("serviceEndDate")}
          helpText={t("spendingClaims.details.endDateHelp")}
          minimumDate={values.serviceStartDate || windowStart}
          maximumDate={windowEnd}
          displayValue={values.serviceEndDate ? formatTransactionDate(values.serviceEndDate) : null}
          disabled={disabled}
        />
      )}

      {amountField && (
        <CurrencyField
          label={labelFor("amount")}
          value={values.amount}
          onChangeText={(text) => onChange("amount", text)}
          required={isRequired("amount")}
          error={errorFor("amount")}
          editable={!disabled}
        />
      )}

      {providerField && (
        <FormFieldShell
          label={labelFor("provider")}
          required={isRequired("provider")}
          error={errorFor("provider")}
          helpText={t("spendingClaims.details.providerHelp")}
        >
          <input
            value={values.provider}
            onChange={(e) => onChange("provider", e.target.value)}
            disabled={disabled}
            maxLength={PROVIDER_MAX_LENGTH}
            enterKeyHint="next"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                notesInputRef.current?.focus();
              }
            }}
            className="rounded-xl px-3 py-3 bg-brand-surface border text-base text-brand-primary"
            style={{ borderColor: errorFor("provider") ? colors.error : colors.border }}
            aria-label={composeFieldAccessibilityLabel({
              label: labelFor("provider"),
              required: isRequired("provider"),
              requiredText: t("forms.required"),
            })}
          />
        </FormFieldShell>
      )}

      {notesField && (
        <FormFieldShell label={labelFor("notes")} required={isRequired("notes")} error={errorFor("notes")}>
          <textarea
            ref={notesInputRef}
            value={values.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            disabled={disabled}
            rows={3}
            maxLength={NOTES_MAX_LENGTH}
            className="rounded-xl px-3 py-3 bg-brand-surface border text-base text-brand-primary"
            style={{
              borderColor: errorFor("notes") ? colors.error : colors.border,
              minHeight: 80,
              maxHeight: 160,
              resize: "none",
            }}
            aria-label={composeFieldAccessibilityLabel({
              label: labelFor("notes"),
              required: isRequired("notes"),
              requiredText: t("forms.required"),
            })}
          />
        </FormFieldShell>
      )}
    </div>
  );
}
