import { useTranslation } from "@/src/shared/i18n";
import type { ClaimType } from "../types";

const CLAIM_TYPES: ClaimType[] = ["Medical", "Dental", "Pharmacy"];

interface ClaimTypeFilterProps {
  selected: ClaimType | undefined;
  onSelect: (type: ClaimType | undefined) => void;
}

/**
 * Horizontal chip tabs for filtering claims by type.
 * Tapping the active chip deselects it (shows all types).
 */
export function ClaimTypeFilter({ selected, onSelect }: ClaimTypeFilterProps) {
  const { t } = useTranslation();

  const allActive = selected === undefined;

  return (
    <div className="mb-3 overflow-x-auto scrollbar-none">
      <div className="flex-row" style={{ paddingLeft: 16, paddingRight: 16, gap: 8 }}>
        {/* All chip */}
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={`px-4 py-2 rounded-full ${allActive ? "bg-brand-accent" : "bg-brand-surface border border-gray-200"}`}
          aria-label={t("claims.type.all")}
          aria-pressed={allActive}
        >
          <span className={`text-sm font-medium ${allActive ? "text-white" : "text-gray-700"}`}>
            {t("claims.type.all")}
          </span>
        </button>

        {CLAIM_TYPES.map((type) => {
          const isActive = selected === type;
          return (
            <button
              type="button"
              key={type}
              onClick={() => onSelect(type)}
              className={`px-4 py-2 rounded-full ${isActive ? "bg-brand-accent" : "bg-brand-surface border border-gray-200"}`}
              aria-label={t(`claims.type.${type.toLowerCase()}`)}
              aria-pressed={isActive}
            >
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                {t(`claims.type.${type.toLowerCase()}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
