import { useTranslation } from "@/src/shared/i18n";
import { Card } from "@/src/shared/components/Card";
import { SectionTitle } from "@/src/shared/components/Typography";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { formatClaimAmount } from "../services/claimsTransforms";

interface CostBreakdownCardProps {
  billedAmount: number;
  allowedAmount: number;
  planPaid: number;
  memberResponsibility: number;
}

/**
 * Cost breakdown card — shows Total Charges, Plan Paid, and You Owe.
 * Plan Paid is green (success color), You Owe is bold for emphasis.
 */
export function CostBreakdownCard({ billedAmount, allowedAmount, planPaid, memberResponsibility }: CostBreakdownCardProps) {
  const { t } = useTranslation();

  return (
    <Card variant="translucent" className="mb-4">
      <SectionTitle className="mb-3">{t("claimDetail.costBreakdown")}</SectionTitle>

      <KeyValueRow label={t("claimDetail.totalCharges")} value={formatClaimAmount(billedAmount)} divider />
      <KeyValueRow label={t("claimDetail.allowedAmount")} value={formatClaimAmount(allowedAmount)} divider />
      <KeyValueRow label={t("claimDetail.planPaid")} value={formatClaimAmount(planPaid)} tone="success" emphasize divider />
      <KeyValueRow label={t("claimDetail.youOwe")} value={formatClaimAmount(memberResponsibility)} prominent />
    </Card>
  );
}
