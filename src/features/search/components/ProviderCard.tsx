import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Label } from "@/src/shared/components/Typography";
import type { ProviderSummary } from "../types";
import { formatDistance } from "../services/searchTransforms";
import { InNetworkBadge } from "./InNetworkBadge";
import { colors } from "@/src/shared/theme/colors";

interface ProviderCardProps {
  provider: ProviderSummary;
  isAllianceMember?: boolean;
}

export function ProviderCard({ provider, isAllianceMember }: ProviderCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fullName = `${provider.firstName} ${provider.lastName}${provider.credentials ? `, ${provider.credentials}` : ""}`;

  return (
    <button
      type="button"
      onClick={() => navigate(`/provider/${encodeURIComponent(provider.npi)}`)}
      className="bg-brand-surface rounded-2xl p-4 shadow-sm mb-3 active:opacity-80 text-left"
      aria-label={`${fullName}, ${provider.specialty}`}
    >
      <div className="flex-row items-start justify-between mb-2">
        <div className="flex-1 mr-2">
          <span className="text-base font-bold text-brand-primary">{fullName}</span>
          <Label className="mt-0.5">{provider.specialty}</Label>
        </div>
        <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
      </div>

      <div className="flex-row items-center mt-2 gap-3 flex-wrap">
        {provider.distanceMiles != null && (
          <div className="flex-row items-center">
            <Icon name="location-outline" size={14} color={colors.neutral[500]} />
            <span className="text-xs text-gray-500 ml-0.5">{formatDistance(provider.distanceMiles)}</span>
          </div>
        )}
        <InNetworkBadge isInNetwork={provider.isInNetwork} isAllianceMember={isAllianceMember} />
        {provider.acceptingNewPatients && (
          <div className="flex-row items-center">
            <Icon name="checkmark-circle" size={14} color={colors.inNetwork} />
            <span className="text-xs text-emerald-700 ml-0.5">{t("search.acceptingPatients")}</span>
          </div>
        )}
      </div>
    </button>
  );
}
