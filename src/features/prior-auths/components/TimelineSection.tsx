/** Timeline section on the Prior Auth detail screen — up to 4 date rows. */
import { useTranslation } from "@/src/shared/i18n";
import { Card } from "@/src/shared/components/Card";
import { InfoRow } from "@/src/shared/components/InfoRow";
import { SectionTitle } from "@/src/shared/components/Typography";
import type { PriorAuthDetail } from "../types";
import { formatDate } from "../services/priorAuthFormat";

interface TimelineSectionProps {
  auth: PriorAuthDetail;
}

export function TimelineSection({ auth }: TimelineSectionProps) {
  const { t } = useTranslation();

  return (
    <Card variant="translucent" className="mb-4">
      <SectionTitle className="mb-1">{t("priorAuth.timeline")}</SectionTitle>

      <InfoRow icon="calendar-outline" label={t("priorAuth.requestSubmitted")} value={formatDate(auth.requestDate)} />

      {auth.decisionDate && (
        <InfoRow icon="checkmark-circle-outline" label={t("priorAuth.decisionDate")} value={formatDate(auth.decisionDate)} />
      )}

      {auth.dateNeeded && (
        <InfoRow icon="today-outline" label={t("priorAuth.serviceDateNeeded")} value={formatDate(auth.dateNeeded)} />
      )}

      {auth.validThrough && (
        <InfoRow icon="hourglass-outline" label={t("priorAuth.validThrough")} value={formatDate(auth.validThrough)} />
      )}
    </Card>
  );
}
