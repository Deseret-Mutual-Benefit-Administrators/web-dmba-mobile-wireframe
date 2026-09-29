import { useTranslation } from "@/src/shared/i18n";
import { Badge } from "@/src/shared/components/Badge";
import { Caption } from "@/src/shared/components/Typography";
import { getTierTone } from "../services/medicationTransforms";

interface TierBadgeProps {
  /** The formulary tier, or `null` when the drug reference doesn't carry one. */
  tier: string | null;
}

/** Formulary tier pill — thin wrapper over the shared `Badge`, tone from `getTierTone`. */
export function TierBadge({ tier }: TierBadgeProps) {
  const { t } = useTranslation();
  const label = (tier ?? "").trim();

  if (label.length === 0) {
    return <Caption>{t("common.unavailableValue")}</Caption>;
  }

  return <Badge label={label} tone={getTierTone(label)} />;
}
