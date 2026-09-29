import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Card } from "@/src/shared/components/Card";
import { colors } from "@/src/shared/theme/colors";
import type { PharmacySummary } from "../types";
import { formatDistance } from "../services/searchTransforms";
import { InNetworkBadge } from "./InNetworkBadge";

interface PharmacyCardProps {
  pharmacy: PharmacySummary;
  isAllianceMember?: boolean;
}

export function PharmacyCard({ pharmacy, isAllianceMember }: PharmacyCardProps) {
  const { t } = useTranslation();
  // Wireframe: the app opens `tel:`; placeholder numbers are not dialable.
  const handleCall = () => {};

  const fullAddress = `${pharmacy.address}, ${pharmacy.city}, ${pharmacy.state}`;

  return (
    <Card className="mb-3">
      <div className="flex-row items-start justify-between mb-2">
        <div className="flex-1 mr-2">
          <span className="text-base font-bold text-brand-primary">{pharmacy.name}</span>
          {pharmacy.distanceMiles != null && (
            <div className="flex-row items-center mt-0.5">
              <Icon name="location-outline" size={14} color={colors.neutral[500]} />
              <span className="text-xs text-gray-500 ml-0.5">{formatDistance(pharmacy.distanceMiles)}</span>
            </div>
          )}
        </div>
        <InNetworkBadge isInNetwork={pharmacy.isInNetwork} isAllianceMember={isAllianceMember} />
      </div>

      <div className="flex-row items-center mt-1">
        <Icon name="location-outline" size={14} color={colors.neutral[500]} />
        <span className="text-xs text-gray-500 ml-1 flex-1">{fullAddress}</span>
      </div>

      {pharmacy.hours && (
        <div className="flex-row items-center mt-1">
          <Icon name="time-outline" size={14} color={colors.neutral[500]} />
          <span className="text-xs text-gray-500 ml-1">{pharmacy.hours}</span>
        </div>
      )}

      {pharmacy.is24Hours && (
        <div className="self-start mt-1 bg-blue-50 px-2 py-0.5 rounded-full">
          <span className="text-xs text-blue-700 font-medium">{t("search.facilityDetail.open24Hours")}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleCall}
        className="flex-row items-center mt-3 pt-3 border-t border-gray-100 active:opacity-80"
        aria-label={t("search.callPharmacy", { name: pharmacy.name })}
        aria-description={t("common.hints.callsPhone")}
      >
        <Icon name="call-outline" size={16} color={colors.brand.accent} />
        <span className="text-sm text-brand-accent ml-1.5 font-medium">{pharmacy.phone}</span>
      </button>
    </Card>
  );
}
