/** First step: who was this claim for? Self plus the HIPAA-visible household. */
import { useTranslation } from "@/src/shared/i18n";
import { SelectField, type SelectOption } from "@/src/shared/components/SelectField";
import type { ClaimSubmissionPatientOption } from "../types";

interface PatientStepProps {
  value: string;
  options: ClaimSubmissionPatientOption[];
  onSelect: (memberId: string) => void;
  error: string | null;
  disabled: boolean;
}

export function PatientStep({ value, options, onSelect, error, disabled }: PatientStepProps) {
  const { t } = useTranslation();

  const selectOptions: SelectOption[] = options.map((option) => ({
    value: option.memberId,
    label: option.label,
    secondary: option.secondary,
  }));

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-1">{t("claimSubmission.patient.question")}</span>
      <span className="text-sm text-gray-600 mb-4">{t("claimSubmission.patient.subtitle")}</span>

      <SelectField
        label={t("claimSubmission.fields.patient")}
        value={value}
        options={selectOptions}
        onSelect={onSelect}
        required
        error={error}
        disabled={disabled}
        placeholder={t("claimSubmission.patient.placeholder")}
      />
    </div>
  );
}
