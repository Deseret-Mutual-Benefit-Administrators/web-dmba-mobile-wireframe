import { useNavigate } from "react-router-dom";
import { Icon } from "@/src/shared/icons";
import { Label } from "@/src/shared/components/Typography";
import type { FacilitySummary } from "../types";
import { formatDistance } from "../services/searchTransforms";
import { InNetworkBadge } from "./InNetworkBadge";
import { colors } from "@/src/shared/theme/colors";

interface FacilityCardProps {
  facility: FacilitySummary;
  isAllianceMember?: boolean;
}

export function FacilityCard({ facility, isAllianceMember }: FacilityCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/facility/${encodeURIComponent(facility.id)}`)}
      className="bg-brand-surface rounded-2xl p-4 shadow-sm mb-3 active:opacity-80 text-left"
      aria-label={`${facility.name}, ${facility.facilityType}`}
    >
      <div className="flex-row items-start justify-between mb-2">
        <div className="flex-1 mr-2">
          <span className="text-base font-bold text-brand-primary">{facility.name}</span>
          <Label className="mt-0.5">{facility.facilityType}</Label>
        </div>
        <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
      </div>

      <div className="flex-row items-center mt-2 gap-3 flex-wrap">
        {facility.distanceMiles != null && (
          <div className="flex-row items-center">
            <Icon name="location-outline" size={14} color={colors.neutral[500]} />
            <span className="text-xs text-gray-500 ml-0.5">{formatDistance(facility.distanceMiles)}</span>
          </div>
        )}
        <InNetworkBadge isInNetwork={facility.isInNetwork} isAllianceMember={isAllianceMember} />
        {facility.isOpen24Hours && (
          <div className="bg-blue-50 px-2 py-0.5 rounded-full">
            <span className="text-xs text-blue-700 font-medium">24 Hours</span>
          </div>
        )}
      </div>

      {facility.services.length > 0 && (
        <div className="flex-row flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
          {facility.services.slice(0, 3).map((svc) => (
            <div key={svc} className="bg-gray-100 rounded-full px-2 py-0.5">
              <span className="text-xs text-gray-600">{svc}</span>
            </div>
          ))}
          {facility.services.length > 3 && (
            <div className="bg-gray-100 rounded-full px-2 py-0.5">
              <span className="text-xs text-gray-600">+{facility.services.length - 3}</span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
