import { useTranslation } from "@/src/shared/i18n";
import { Card } from "@/src/shared/components/Card";
import { SectionTitle } from "@/src/shared/components/Typography";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import type { ServiceLine } from "../types";
import { formatClaimAmount } from "../services/claimsTransforms";

interface BenefitsAppliedCardProps {
  serviceLines: ServiceLine[];
}

/**
 * Benefits Applied card — aggregates deductible, copay, and coinsurance
 * totals across all service lines. Only shown for Processed claims.
 */
export function BenefitsAppliedCard({ serviceLines }: BenefitsAppliedCardProps) {
  const { t } = useTranslation();

  const totals = serviceLines.reduce(
    (acc, line) => ({
      deductible: acc.deductible + line.deductible,
      copay: acc.copay + line.copay,
      coinsurance: acc.coinsurance + line.coinsurance,
    }),
    { deductible: 0, copay: 0, coinsurance: 0 }
  );

  return (
    <Card variant="translucent" className="mb-4">
      <SectionTitle className="mb-3">{t("claimDetail.benefitsApplied")}</SectionTitle>

      <KeyValueRow label={t("claimDetail.deductible")} value={formatClaimAmount(totals.deductible)} divider />
      <KeyValueRow label={t("claimDetail.copay")} value={formatClaimAmount(totals.copay)} divider />
      <KeyValueRow label={t("claimDetail.coinsurance")} value={formatClaimAmount(totals.coinsurance)} />
    </Card>
  );
}
