import { useState } from "react";
import { Asterisk } from "lucide-react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors } from "@/src/shared/theme/colors";
import { SpecialtyAutocomplete } from "../components/SpecialtyAutocomplete";
import { LocationRow } from "../components/LocationRow";
import { ProviderCard } from "../components/ProviderCard";
import { PROVIDERS, SPECIALTIES } from "../placeholder";
import { useWireframeSearch } from "./useWireframeSearch";
import type { SharedLocationProps } from "../types";

export function ProviderSearchTab({ zip, handleZipChange, location, isLocating, handleUseMyLocation, locationActive }: SharedLocationProps) {
  const { t } = useTranslation();
  const isAlliance = false;
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const { searchInput, handleSearchInput, handleClear, searchEnabled, results, isLoading, isFetching, isError } =
    useWireframeSearch(location, PROVIDERS, (p, q) =>
      `${p.firstName} ${p.lastName} ${p.specialty}`.toLowerCase().includes(q)
    );
  const providers = selectedSpecialty ? results.filter((p) => p.specialty === selectedSpecialty) : results;
  const showAutocomplete = searchInput.length > 0;
  const handleSelectSpecialty = (s: string) => {
    setSelectedSpecialty(s);
    handleSearchInput("");
  };
  const handleClearSpecialty = () => setSelectedSpecialty(null);

  const specialties = SPECIALTIES;
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
      {selectedSpecialty && (
        <div className="flex-row items-center mb-2">
          <div className="flex-row items-center bg-brand-accent/15 rounded-full px-3 py-1.5">
            <Asterisk size={14} color={colors.searchSlate.deep} aria-hidden="true" />
            <span className="text-sm font-medium text-brand-primary ml-1.5">{selectedSpecialty}</span>
            <button type="button" onClick={handleClearSpecialty} className="ml-2 active:opacity-80" aria-label={t("search.clearSpecialty")}>
              <Icon name="close-circle" size={16} color={colors.searchSlate.deep} />
            </button>
          </div>
        </div>
      )}
      <SearchBar
        value={searchInput}
        onChangeText={handleSearchInput}
        placeholder={selectedSpecialty ? t("search.providers.nameSearchPlaceholder") : t("search.providers.searchPlaceholder")}
        onClear={handleClear}
      />
      {!selectedSpecialty && (
        <SpecialtyAutocomplete query={searchInput} specialties={specialties ?? []} onSelect={handleSelectSpecialty} visible={showAutocomplete} />
      )}
      <div className="mt-3">
        <LocationRow
          zip={zip}
          onZipChange={handleZipChange}
          onUseMyLocation={handleUseMyLocation}
          isLocating={isLocating}
          locationActive={locationActive}
        />
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
      {providers.length === 0
        ? empty
        : providers.map((item) => (
            <div key={item.npi} className="px-4">
              <ProviderCard provider={item} isAllianceMember={isAlliance} />
            </div>
          ))}
    </div>
  );
}
