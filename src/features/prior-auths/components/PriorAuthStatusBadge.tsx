/**
 * Reusable status pill for Prior Authorizations — thin wrapper over the
 * canonical `Badge` primitive.
 */
import { useTranslation } from "@/src/shared/i18n";
import type { PriorAuthStatusBucket } from "../types";
import { getStatusDisplay, getStatusBadgeTone, badgeToneIconColor } from "../services/priorAuthFormat";
import { Badge } from "@/src/shared/components/Badge";
import { StatusIcon } from "./StatusIcon";

interface PriorAuthStatusBadgeProps {
  bucket: PriorAuthStatusBucket;
}

export function PriorAuthStatusBadge({ bucket }: PriorAuthStatusBadgeProps) {
  const { t } = useTranslation();
  const { icon, labelKey } = getStatusDisplay(bucket);
  const tone = getStatusBadgeTone(bucket);

  return (
    <div aria-hidden="true">
      <Badge tone={tone} label={t(labelKey)} icon={<StatusIcon name={icon} size={12} color={badgeToneIconColor[tone]} />} />
    </div>
  );
}
