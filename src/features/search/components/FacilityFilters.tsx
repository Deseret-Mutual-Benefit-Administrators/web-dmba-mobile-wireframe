import { useTranslation } from "@/src/shared/i18n";
import { Eyebrow } from "@/src/shared/components/Typography";
import { FACILITY_TYPES } from "../services/searchTransforms";

interface FacilityFiltersProps {
  facilityType: string;
  onFacilityTypeChange: (value: string) => void;
}

export function FacilityFilters({ facilityType, onFacilityTypeChange }: FacilityFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <Eyebrow className="mb-1.5">{t("search.facilities.typeLabel")}</Eyebrow>
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex-row gap-2">
          <button
            type="button"
            onClick={() => onFacilityTypeChange("")}
            className={`px-3 py-1.5 rounded-full border ${
              facilityType === "" ? "bg-brand-accent border-brand-accent" : "bg-brand-surface border-gray-200"
            }`}
            aria-label={t("search.filterByFacilityType", { type: t("common.all") })}
            aria-pressed={facilityType === ""}
          >
            <span className={`text-xs whitespace-nowrap ${facilityType === "" ? "text-white font-semibold" : "text-gray-600"}`}>
              {t("common.all")}
            </span>
          </button>
          {FACILITY_TYPES.map((ft) => (
            <button
              type="button"
              key={ft.value}
              onClick={() => onFacilityTypeChange(facilityType === ft.value ? "" : ft.value)}
              className={`px-3 py-1.5 rounded-full border ${
                facilityType === ft.value ? "bg-brand-accent border-brand-accent" : "bg-brand-surface border-gray-200"
              }`}
              aria-label={t("search.filterByFacilityType", { type: ft.label })}
              aria-pressed={facilityType === ft.value}
            >
              <span className={`text-xs whitespace-nowrap ${facilityType === ft.value ? "text-white font-semibold" : "text-gray-600"}`}>
                {ft.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
