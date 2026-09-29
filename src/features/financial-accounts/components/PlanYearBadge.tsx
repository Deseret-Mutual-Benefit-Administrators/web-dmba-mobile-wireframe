import { useTranslation } from "@/src/shared/i18n";
import { Badge } from "@/src/shared/components/Badge";
import { planYearBadgeKey, planYearStatusTone, type PlanYearStatus } from "./cardServices";

interface PlanYearBadgeProps {
  status: PlanYearStatus;
}

/**
 * The one-word state chip beside an account's name — "Ended", "Closed",
 * "Not started". Renders nothing for `active` and `lifetime`. Never red.
 */
export function PlanYearBadge({ status }: PlanYearBadgeProps) {
  const { t } = useTranslation();

  const labelKey = planYearBadgeKey(status);
  if (labelKey === null) return null;

  return <Badge label={t(labelKey)} tone={planYearStatusTone(status)} />;
}
