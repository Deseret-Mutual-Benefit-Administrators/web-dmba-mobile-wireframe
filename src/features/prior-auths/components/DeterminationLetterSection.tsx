/**
 * Inline determination letter section. Renders structured letter fields below
 * StatusPanel on Approved/Denied auths; null otherwise.
 */
import { useTranslation } from "@/src/shared/i18n";
import { Card } from "@/src/shared/components/Card";
import { InfoRow } from "@/src/shared/components/InfoRow";
import { LoadingSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { SectionTitle, Caption } from "@/src/shared/components/Typography";
import { formatDate } from "../services/priorAuthFormat";
import { placeholderDeterminationLetter } from "../placeholder";
import type { PriorAuthStatusBucket } from "../types";

interface DeterminationLetterSectionProps {
  authorizationId: string;
  statusBucket: PriorAuthStatusBucket;
}

export function DeterminationLetterSection({ authorizationId, statusBucket }: DeterminationLetterSectionProps) {
  const { t } = useTranslation();

  const isFinalStatus = statusBucket === "Approved" || statusBucket === "Denied";

  const letter = isFinalStatus ? placeholderDeterminationLetter(authorizationId) : null;
  const isLoading = false;
  const isError = false;

  if (!isFinalStatus) {
    return null;
  }

  if (isLoading) {
    return (
      <Card variant="translucent" className="mb-4">
        <LoadingSkeleton width={140} height={16} className="mb-3" />
        <LoadingSkeleton width="100%" height={14} className="mb-2" />
        <LoadingSkeleton width="100%" height={14} className="mb-2" />
        <LoadingSkeleton width="80%" height={14} className="mb-2" />
      </Card>
    );
  }

  if (isError || !letter) {
    return null;
  }

  const formattedGeneratedDate = formatDate(letter.generatedDate);
  const formattedServiceByDate = letter.effectiveDates?.validThrough ? formatDate(letter.effectiveDates.validThrough) : null;

  return (
    <Card variant="translucent" className="mb-4" accessibilityRole="region" accessibilityLabel={t("priorAuth.letter.sectionLabel")}>
      <SectionTitle className="mb-1">{t("priorAuth.letter.sectionTitle")}</SectionTitle>

      <InfoRow icon="checkmark-circle-outline" label={t("priorAuth.letter.fieldDecision")} value={letter.decision} />
      {letter.authorizationNumber && (
        <InfoRow icon="barcode-outline" label={t("priorAuth.letter.fieldAuthorizationNumber")} value={letter.authorizationNumber} />
      )}
      <InfoRow icon="person-outline" label={t("priorAuth.letter.fieldOrderedBy")} value={letter.providerName} />
      <InfoRow icon="medical-outline" label={t("priorAuth.letter.fieldProcedure")} value={letter.procedureDescription} />
      {formattedServiceByDate && (
        <InfoRow icon="calendar-outline" label={t("priorAuth.letter.fieldServiceMustBeDoneBy")} value={formattedServiceByDate} />
      )}
      <InfoRow icon="document-text-outline" label={t("priorAuth.letter.fieldGeneratedDate")} value={formattedGeneratedDate} />

      {/* Summary prose block */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Caption className="mb-1">{t("priorAuth.letter.summaryHeading")}</Caption>
        <span className="text-sm text-gray-700 leading-5">{letter.summaryText}</span>
      </div>

      {/* Criteria not met — denials only */}
      {letter.criteriaNotMetText && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Caption className="mb-1">{t("priorAuth.letter.criteriaNotMetHeading")}</Caption>
          <span className="text-sm text-gray-700 leading-5">{letter.criteriaNotMetText}</span>
        </div>
      )}

      {/* Next steps — when present */}
      {letter.nextSteps && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Caption className="mb-1">{t("priorAuth.letter.nextStepsHeading")}</Caption>
          <span className="text-sm text-gray-700 leading-5">{letter.nextSteps}</span>
        </div>
      )}
    </Card>
  );
}
