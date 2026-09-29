import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { SearchTabBar } from "../components/SearchTabBar";
import { ProviderSearchTab } from "./ProviderSearchTab";
import { FacilitySearchTab } from "./FacilitySearchTab";
import { PharmacySearchTab } from "./PharmacySearchTab";
import { PLACEHOLDER_LOCATION, PLACEHOLDER_ZIP, readState } from "../placeholder";
import type { SearchTab } from "../types";

type GeoCoords = { lat: number; lng: number };

const TABS: SearchTab[] = ["providers", "facilities", "pharmacies"];

/**
 * Main Find Care screen — hosts the 3-tab strip (providers, facilities,
 * pharmacies) and renders the active tab. Location state (ZIP + GPS coords)
 * is shared across all three.
 *
 * Wireframe: starts with no location ("Location Required", as in the app).
 * Any 5-digit ZIP or "Use My Location" resolves to a placeholder location and
 * shows results. `?tab=facilities|pharmacies` opens a sub-tab;
 * `?state=results|loading|empty|error` starts with a location set.
 */
export function SearchScreen() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initialTab = TABS.find((tab) => tab === params.get("tab")) ?? "providers";
  const startWithLocation = readState(params) != null;

  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);
  const [zip, setZip] = useState(startWithLocation ? PLACEHOLDER_ZIP : "");
  const [location, setLocation] = useState<GeoCoords | null>(startWithLocation ? PLACEHOLDER_LOCATION : null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleZipChange = useCallback((text: string) => {
    setZip(text);
    setIsGpsActive(false);
    if (text.length === 5) {
      setLocation(PLACEHOLDER_LOCATION);
    } else if (text.length < 5) {
      setLocation(null);
    }
  }, []);

  const handleUseMyLocation = useCallback(() => {
    setIsLocating(true);
    window.setTimeout(() => {
      setIsLocating(false);
      setLocation(PLACEHOLDER_LOCATION);
      setIsGpsActive(true);
      setZip(PLACEHOLDER_ZIP);
    }, 600);
  }, []);

  const locationProps = { zip, handleZipChange, location, isLocating, handleUseMyLocation, locationActive: isGpsActive };

  return (
    <div className="flex-1 bg-brand-surface" style={{ minHeight: 0 }}>
      <div className="px-4 pt-2 pb-1">
        <span className="text-xl font-bold text-brand-primary">{t("search.title")}</span>
      </div>

      <SearchTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "providers" && <ProviderSearchTab {...locationProps} />}
      {activeTab === "facilities" && <FacilitySearchTab {...locationProps} />}
      {activeTab === "pharmacies" && <PharmacySearchTab {...locationProps} />}
    </div>
  );
}
