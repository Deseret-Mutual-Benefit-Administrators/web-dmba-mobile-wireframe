import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors } from "@/src/shared/theme/colors";
import { LocationRow } from "../components/LocationRow";
import { FacilityFilters } from "../components/FacilityFilters";
import { FacilityCard } from "../components/FacilityCard";
import { FACILITY_TYPES } from "../services/searchTransforms";
import { FACILITIES } from "../placeholder";
import { useWireframeSearch } from "./useWireframeSearch";
import type { SharedLocationProps } from "../types";

export function FacilitySearchTab({ zip, handleZipChange, location, isLocating, handleUseMyLocation, locationActive }: SharedLocationProps) {
  const { t } = useTranslation();
  const isAlliance = false;
  const [facilityType, setFacilityType] = useState("");
  const { searchInput, handleSearchInput, handleClear, searchEnabled, results, isLoading, isFetching, isError } =
    useWireframeSearch(location, FACILITIES, (f, q) => f.name.toLowerCase().includes(q));
  const typeLabel = FACILITY_TYPES.find((ft) => ft.value === facilityType)?.label;
  const facilities = typeLabel ? results.filter((f) => f.facilityType === typeLabel) : results;

  const needsLocation = !location;

  const header = (
    <div className="px-4 pt-3 pb-4">
      {isAlliance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex-row items-start">
          <div style={{ marginTop: 1 }}>
            <Icon name="information-circle" size={18} color={colors.highlight.base} />
          </div>
          <span className="text-xs text-amber-800 ml-2 flex-1">{t("search.allianceBanner")}</span>
        </div>
      )}
      <SearchBar
        value={searchInput}
        onChangeText={handleSearchInput}
        placeholder={t("search.facilities.searchPlaceholder")}
        onClear={handleClear}
      />
      <div className="mt-3">
        <LocationRow
          zip={zip}
          onZipChange={handleZipChange}
          onUseMyLocation={handleUseMyLocation}
          isLocating={isLocating}
          locationActive={locationActive}
        />
      </div>
      <div className="mt-3">
        <FacilityFilters facilityType={facilityType} onFacilityTypeChange={setFacilityType} />
      </div>
    </div>
  );

  const empty = (() => {
    if (needsLocation && !searchEnabled) {
      return (
        <EmptyState
          icon={<Icon name="location-outline" size={48} color={colors.searchSlate.base} />}
          title={t("search.pharmacies.locationRequiredTitle")}
          message={t("search.locationRequiredMessage")}
        />
      );
    }
    if ((isLoading || isFetching) && searchEnabled) {
      return (
        <div className="items-center py-8">
          <Spinner size="large" />
        </div>
      );
    }
    if (isError && searchEnabled) {
      return (
        <div className="items-center py-8 px-6">
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <span className="text-gray-500 mt-3 text-center">{t("common.error")}</span>
        </div>
      );
    }
    if (searchEnabled) {
      return <EmptyState icon={<Icon name="search-outline" size={48} color={colors.neutral[500]} />} title={t("search.noResults")} />;
    }
    return null;
  })();

  return (
    <div className="flex-1 bg-brand-surface overflow-y-auto scrollbar-none" style={{ paddingBottom: 32, minHeight: 0 }}>
      {header}
      {facilities.length === 0
        ? empty
        : facilities.map((item) => (
            <div key={item.id} className="px-4">
              <FacilityCard facility={item} isAllianceMember={isAlliance} />
            </div>
          ))}
    </div>
  );
}
