import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { MapViewComponent, mapAvailable, type Region } from "./MapViewComponent";
import { colors } from "@/src/shared/theme/colors";
import type { MapMarker } from "../types";

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  /** Marker title (provider/practice/facility name). */
  title: string;
}

/** Fixed height of the inline preview map. */
const PREVIEW_HEIGHT = 200;

/**
 * Inline map preview for a provider/facility detail screen. Tapping it (or
 * the expand control) pushes `/search/map`, a shared fullscreen route.
 */
export function MapPreview({ latitude, longitude, title }: MapPreviewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const marker: MapMarker = { id: "location", lat: latitude, lng: longitude, title };

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const openFullscreen = () => {
    const params = new URLSearchParams({ lat: String(latitude), lng: String(longitude), title });
    navigate(`/search/map?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-100" style={{ height: PREVIEW_HEIGHT }}>
      <MapViewComponent markers={[marker]} onMarkerPress={openFullscreen} initialRegion={region} />

      {mapAvailable() && (
        <>
          <button
            type="button"
            onClick={openFullscreen}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            aria-label={t("search.expandMap")}
            aria-description={t("common.hints.opensMap")}
          />

          {/* Expand control */}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm pointer-events-none">
            <Icon name="expand-outline" size={18} color={colors.brand.accent} />
          </div>
        </>
      )}
    </div>
  );
}
