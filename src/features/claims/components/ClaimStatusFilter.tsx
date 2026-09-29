import { useTranslation } from "@/src/shared/i18n";
import type { ClaimStatus } from "../types";
import { getStatusBadgeColor } from "../services/claimsTransforms";

const ALL_STATUSES: ClaimStatus[] = ["Pending", "Processing", "Processed", "Denied", "Adjusted"];

interface ClaimStatusFilterProps {
  selected: ClaimStatus[];
  onToggle: (status: ClaimStatus) => void;
}

/**
 * Multi-select chip row for filtering claims by status.
 * Tapping a chip toggles it on/off. Multiple statuses can be active.
 */
export function ClaimStatusFilter({ selected, onToggle }: ClaimStatusFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 overflow-x-auto scrollbar-none">
      <div className="flex-row" style={{ paddingLeft: 16, paddingRight: 16, gap: 8 }}>
        {ALL_STATUSES.map((status) => {
          const isActive = selected.includes(status);
          const badgeColor = getStatusBadgeColor(status);

          return (
            <button
              type="button"
              key={status}
              onClick={() => onToggle(status)}
              className={`px-4 py-2 rounded-full border ${
                isActive ? `${badgeColor} border-transparent` : "bg-brand-surface border-gray-200"
              }`}
              aria-label={t(`claims.${status.toLowerCase()}`)}
              aria-pressed={isActive}
            >
              <span className={`text-sm font-medium ${isActive ? "" : "text-gray-500"}`}>
                {t(`claims.${status.toLowerCase()}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
