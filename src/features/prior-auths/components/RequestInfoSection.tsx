/** "Request Information" section on the Prior Auth detail screen. */
import { useTranslation } from "@/src/shared/i18n";
import { Card } from "@/src/shared/components/Card";
import { InfoRow } from "@/src/shared/components/InfoRow";
import { SectionTitle } from "@/src/shared/components/Typography";
import type { PriorAuthDetail } from "../types";

interface RequestInfoSectionProps {
  auth: PriorAuthDetail;
}

export function RequestInfoSection({ auth }: RequestInfoSectionProps) {
  const { t } = useTranslation();

  const diagnosisDisplay = auth.diagnosisCode ? `${auth.diagnosis} (ICD-10: ${auth.diagnosisCode})` : auth.diagnosis;

  return (
    <Card variant="translucent" className="mb-4">
      <SectionTitle className="mb-1">{t("priorAuth.requestInfo")}</SectionTitle>

      <InfoRow icon="medical-outline" label={t("priorAuth.requestedService")} value={auth.service} />
      <InfoRow icon="business-outline" label={t("priorAuth.provider")} value={auth.provider} />
      <InfoRow icon="person-outline" label={t("priorAuth.requestingPhysician")} value={auth.requestingPhysician} />
      <InfoRow icon="document-text-outline" label={t("priorAuth.diagnosis")} value={diagnosisDisplay} />
    </Card>
  );
}
