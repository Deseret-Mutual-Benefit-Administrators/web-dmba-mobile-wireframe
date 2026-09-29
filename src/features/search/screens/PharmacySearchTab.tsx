import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors } from "@/src/shared/theme/colors";
import { LocationRow } from "../components/LocationRow";
import { PharmacyCard } from "../components/PharmacyCard";
import { PHARMACIES } from "../placeholder";
import { useWireframeSearch } from "./useWireframeSearch";
import type { SharedLocationProps } from "../types";

export function PharmacySearchTab({ zip, handleZipChange, location, isLocating, handleUseMyLocation, locationActive }: SharedLocationProps) {
  const { t } = useTranslation();
  const isAlliance = false;
  const { searchInput, handleSearchInput, handleClear, searchEnabled, results: pharmacies, isLoading, isFetching, isError } =
    useWireframeSearch(location, PHARMACIES, (p, q) => p.name.toLowerCase().includes(q));
  const needsLocation = !location;

  const header = (
    <div className="px-4 pt-3 pb-4">
      <SearchBar
        value={searchInput}
        onChangeText={handleSearchInput}
        placeholder={t("search.pharmacies.searchPlaceholder")}
        onClear={handleClear}
      />
      <div className="mt-3">
        <LocationRow
          zip={zip}
          onZipChange={handleZipChange}
          onUseMyLocation={handleUseMyLocation}
          isLocating={isLocating}
          locationActive={locationActive}
          highlighted={needsLocation && searchInput.length > 0}
        />
      </div>
      {isAlliance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 flex-row items-start">
          <div style={{ marginTop: 1 }}>
            <Icon name="information-circle" size={18} color={colors.highlight.base} />
          </div>
          <span className="text-xs text-amber-800 ml-2 flex-1">{t("search.allianceBanner")}</span>
        </div>
      )}
      <div className="flex-row items-start bg-blue-50 rounded-xl p-3 mt-3">
        <div style={{ marginTop: 1 }}>
          <Icon name="information-circle-outline" size={18} color={colors.searchSlate.base} />
        </div>
        <span className="text-xs text-gray-600 ml-2 flex-1">{t("search.pharmacies.navitusContext")}</span>
      </div>
      {/* Wireframe: the app opens the pharmacy-benefit manager's member site; no external link here. */}
      <button
        type="button"
        onClick={() => {}}
        className="flex-row items-center bg-brand-accent/10 rounded-xl p-3 mt-3 active:opacity-80 text-left"
        role="link"
        aria-label={t("search.pharmacies.mailOrder")}
        aria-description={t("common.hints.opensBrowser")}
      >
        <Icon name="mail-outline" size={18} color={colors.searchSlate.deep} />
        <div className="ml-2 flex-1">
          <span className="text-sm font-semibold text-brand-primary">{t("search.pharmacies.mailOrder")}</span>
          <span className="text-xs text-gray-500">{t("search.pharmacies.mailOrderDescription")}</span>
        </div>
        <Icon name="open-outline" size={16} color={colors.neutral[500]} />
      </button>
    </div>
  );

  const empty = (() => {
    if (needsLocation) {
      return (
        <EmptyState
          icon={<Icon name="location-outline" size={48} color={colors.searchSlate.base} />}
          title={t("search.pharmacies.locationRequiredTitle")}
          message={t("search.pharmacies.locationRequiredMessage")}
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
      return <EmptyState icon={<Icon name="storefront-outline" size={48} color={colors.neutral[500]} />} title={t("search.noResults")} />;
    }
    return null;
  })();

  return (
    <div className="flex-1 bg-brand-surface overflow-y-auto scrollbar-none" style={{ paddingBottom: 32, minHeight: 0 }}>
      {header}
      {pharmacies.length === 0
        ? empty
        : pharmacies.map((item, index) => (
            <div key={`${item.name}-${item.address}-${index}`} className="px-4">
              <PharmacyCard pharmacy={item} isAllianceMember={isAlliance} />
            </div>
          ))}
    </div>
  );
}
