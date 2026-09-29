/** Review before submit — a KeyValueRow-per-field summary; submit lives in the footer. */
import { useTranslation } from "@/src/shared/i18n";
import { Card } from "@/src/shared/components/Card";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { SectionTitle } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import { formatCurrency } from "@/src/shared/services/currency";
import { parseAmountInput } from "@/src/shared/services/amountInput";
import { formatTransactionDate } from "../services/receiptSize";
import type { ClaimSubmissionFormValues, ClaimSubmissionPatientOption } from "../types";

interface ReviewStepProps {
  values: ClaimSubmissionFormValues;
  patient: ClaimSubmissionPatientOption | null;
  billAttachmentCount: number;
  proofAttachmentCount: number;
  formError?: string | null;
}

export function ReviewStep({ values, patient, billAttachmentCount, proofAttachmentCount, formError }: ReviewStepProps) {
  const { t } = useTranslation();
  const { cents } = parseAmountInput(values.amount);

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-4">{t("claimSubmission.review.title")}</span>

      <Card className="mb-4">
        <SectionTitle className="mb-2">{t("claimSubmission.review.summary")}</SectionTitle>
        <KeyValueRow label={t("claimSubmission.fields.patient")} value={patient?.label ?? ""} divider />
        <KeyValueRow label={t("claimSubmission.fields.provider")} value={values.providerName} divider />
        <KeyValueRow
          label={t("claimSubmission.fields.serviceDate")}
          value={values.serviceDate ? formatTransactionDate(values.serviceDate) : ""}
          divider
        />
        <KeyValueRow
          label={t("claimSubmission.fields.amount")}
          value={cents === null ? values.amount : formatCurrency(cents / 100)}
          divider
        />
        <KeyValueRow label={t("claimSubmission.fields.description")} value={values.serviceDescription} divider />
        <KeyValueRow
          label={t("claimSubmission.fields.alreadyPaid")}
          value={t(values.alreadyPaid === "yes" ? "claimSubmission.alreadyPaid.yes" : "claimSubmission.alreadyPaid.no")}
          divider
        />
        <KeyValueRow
          label={t("claimSubmission.review.attachments")}
          value={t("claimSubmission.review.attachmentCount", { bill: billAttachmentCount, proof: proofAttachmentCount })}
        />
      </Card>

      <span className="text-xs text-gray-500 mb-4">{t("claimSubmission.review.note")}</span>

      {formError && (
        <span className="text-sm mb-3" style={{ color: colors.error }} role="alert">
          {formError}
        </span>
      )}
    </div>
  );
}
