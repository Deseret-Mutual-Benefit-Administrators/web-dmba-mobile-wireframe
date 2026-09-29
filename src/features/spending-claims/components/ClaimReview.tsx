/**
 * Review and certify, then submit. The certification is the vendor's text,
 * verbatim; the account is information, never a choice (ADR-108).
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { formatCurrency } from "@/src/shared/services/currency";
import { parseAmountInput } from "@/src/shared/services/amountInput";
import {
  buildServerErrorValues,
  resolveIssueMessageSource,
  type ClaimServerValidation,
  type ClaimValidationIssue,
} from "../services/claimErrors";
import { formatClaimantName, formatServiceDateRange } from "../services/spendingClaimTransforms";
import { getCategoryLabelKey } from "../services/categoryGuidance";
import { VendorCopyBlock } from "./VendorCopyBlock";
import type { ClaimEntryTemplate, ClaimFormSchema, ClaimFormValues, CapturedReceipt } from "../types";

/** The wireframe's i18n is English-only. */
const LANGUAGE = "en";

interface ClaimReviewProps {
  template: ClaimEntryTemplate;
  schema: ClaimFormSchema;
  values: ClaimFormValues;
  receipts: CapturedReceipt[];
  certified: boolean;
  onCertifiedChange: (certified: boolean) => void;
  serverErrors: ClaimServerValidation;
  disabled: boolean;
  isOffline: boolean;
}

export function ClaimReview({
  template,
  schema,
  values,
  receipts,
  certified,
  onCertifiedChange,
  serverErrors,
  disabled,
  isOffline,
}: ClaimReviewProps) {
  const { t } = useTranslation();

  const category = schema.categories.find((c) => c.code === values.serviceCategoryCode);
  const categoryLabelKey = category ? getCategoryLabelKey(category.code) : null;
  const categoryLabel = categoryLabelKey ? t(categoryLabelKey) : category?.description?.trim() || values.serviceCategoryCode;

  const resolveIssueText = (issue: ClaimValidationIssue): string => {
    const source = resolveIssueMessageSource(issue, LANGUAGE);
    return source.kind === "serverProse" ? source.text : t(source.messageKey, buildServerErrorValues(template));
  };

  const claimant = schema.claimants.find((c) => String(c.cardholderKey) === values.claimantKey);
  const { cents } = parseAmountInput(values.amount);

  const rows: { labelKey: string; value: string }[] = [
    { labelKey: "spendingClaims.fields.serviceCategory", value: categoryLabel },
    { labelKey: "spendingClaims.fields.claimant", value: claimant ? formatClaimantName(claimant) : "" },
    { labelKey: "spendingClaims.review.serviceDates", value: formatServiceDateRange(values.serviceStartDate, values.serviceEndDate) },
    { labelKey: "spendingClaims.fields.amount", value: cents === null ? values.amount : formatCurrency(cents / 100) },
    { labelKey: "spendingClaims.fields.provider", value: values.provider },
  ];

  if (values.notes.trim() !== "") {
    rows.push({ labelKey: "spendingClaims.fields.notes", value: values.notes.trim() });
  }

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-4">{t("spendingClaims.review.title")}</span>

      <div className="rounded-xl border mb-4" style={{ borderColor: colors.border, backgroundColor: colors.brand.surface }}>
        {rows.map((row, index) => (
          <div
            key={row.labelKey}
            className="px-4 py-3"
            style={{ borderTopWidth: index === 0 ? 0 : 1, borderTopColor: colors.neutral[100] }}
          >
            <span className="text-xs text-gray-500">{t(row.labelKey)}</span>
            <span className="text-sm text-brand-primary mt-0.5">{row.value}</span>
          </div>
        ))}

        <div className="px-4 py-3" style={{ borderTopWidth: 1, borderTopColor: colors.neutral[100] }}>
          <span className="text-xs text-gray-500">{t("spendingClaims.review.receipts")}</span>
          <span className="text-sm text-brand-primary mt-0.5">
            {receipts.length === 0
              ? t("spendingClaims.review.noReceipt")
              : t("spendingClaims.review.receiptCount", { count: receipts.length })}
          </span>
        </div>
      </div>

      <div className="flex-row items-start rounded-xl px-3 py-2.5 mb-4 bg-info-tint">
        <span aria-hidden="true" style={{ marginTop: 1, display: "flex" }}>
          <Icon name="information-circle-outline" size={16} color={colors.brand.accent} />
        </span>
        <span className="text-xs text-brand-primary ml-2 flex-1">{t("spendingClaims.review.accountNote")}</span>
      </div>

      <VendorCopyBlock content={template.certificationText} titleKey="spendingClaims.review.certificationTitle" />

      <button
        type="button"
        onClick={() => onCertifiedChange(!certified)}
        disabled={disabled}
        className="active:opacity-70"
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          borderWidth: 1,
          borderColor: certified ? colors.brand.accent : colors.border,
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
          backgroundColor: colors.brand.surface,
        }}
        role="checkbox"
        aria-label={t("spendingClaims.review.certifyLabel")}
        aria-checked={certified}
        aria-disabled={disabled}
      >
        <span aria-hidden="true" style={{ display: "flex" }}>
          <Icon name={certified ? "checkbox" : "square-outline"} size={22} color={certified ? colors.brand.accent : colors.brand.secondary} />
        </span>
        <span className="text-sm text-brand-primary ml-2.5 flex-1">{t("spendingClaims.review.certifyLabel")}</span>
      </button>

      {serverErrors.formErrors.length > 0 && (
        <div
          className="rounded-xl px-3 py-2.5 mb-4 bg-error-tint"
          role="alert"
          aria-label={serverErrors.formErrors.map(resolveIssueText).join(". ")}
        >
          {serverErrors.formErrors.map((issue, index) => (
            <span key={index} className="text-xs" style={{ color: colors.tone.error.icon }}>
              {resolveIssueText(issue)}
            </span>
          ))}
        </div>
      )}

      {isOffline && (
        <div className="flex-row items-start rounded-xl px-3 py-2.5 mb-4 bg-warning-tint" role="alert" aria-label={t("spendingClaims.review.offlineBlock")}>
          <span aria-hidden="true" style={{ marginTop: 1, display: "flex" }}>
            <Icon name="cloud-offline-outline" size={16} color={colors.tone.warning.icon} />
          </span>
          <span className="text-xs ml-2 flex-1" style={{ color: colors.tone.warning.icon }}>
            {t("spendingClaims.review.offlineBlock")}
          </span>
        </div>
      )}
    </div>
  );
}
