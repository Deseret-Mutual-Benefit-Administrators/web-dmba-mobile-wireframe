import { useTranslation } from "@/src/shared/i18n";
import { Badge } from "@/src/shared/components/Badge";
import { getNetworkTone } from "../services/searchTransforms";

interface InNetworkBadgeProps {
  isInNetwork: boolean;
  isAllianceMember?: boolean;
}

/** Network-status pill — thin wrapper over the shared `Badge`, tone from `getNetworkTone`. */
export function InNetworkBadge({ isInNetwork, isAllianceMember }: InNetworkBadgeProps) {
  const { t } = useTranslation();

  const label = isInNetwork
    ? (isAllianceMember ? t("search.dmbaNetwork") : t("search.inNetwork"))
    : (isAllianceMember ? t("search.notDmbaNetwork") : t("search.outOfNetwork"));

  return <Badge label={label} tone={getNetworkTone(isInNetwork)} />;
}
