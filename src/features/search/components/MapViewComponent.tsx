import type { CSSProperties } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import type { MapMarker } from "../types";

/** react-native-maps' `Region`, declared locally (no map library on the web). */
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewComponentProps {
  markers: MapMarker[];
  onMarkerPress: (id: string) => void;
  initialRegion?: Region;
}

/**
 * Wireframe: the build can always "mount" the stand-in. The app returns false on
 * a key-less Android build and renders the "Map not available" placeholder.
 */
export function mapAvailable(): boolean {
  return true;
}

/** Light grey-green ground with a faint street grid — a static map stand-in. */
const MAP_GROUND: CSSProperties = {
  backgroundColor: "#e8efe6",
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.9) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.9) 2px, transparent 2px), linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
  backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
};

/**
 * Stand-in for the react-native-maps MapView wrapper: no tiles, no network.
 * Markers are placed by projecting lat/lng into the region box; a marker
 * outside the box is clamped to the edge.
 */
export function MapViewComponent({ markers, onMarkerPress, initialRegion }: MapViewComponentProps) {
  const { t } = useTranslation();

  // Default to Salt Lake City — DMBA's primary service area
  const region: Region = initialRegion ?? {
    latitude: 40.7608,
    longitude: -111.891,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  if (!mapAvailable()) {
    return (
      <div className="flex-1 items-center justify-center bg-gray-100" role="img" aria-label={t("search.mapUnavailable")}>
        <Icon name="map-outline" size={28} color={colors.neutral[500]} />
        <span className="mt-2 text-sm text-gray-600">{t("search.mapUnavailable")}</span>
      </div>
    );
  }

  const clamp = (v: number) => Math.min(95, Math.max(5, v));

  return (
    <div className="flex-1 overflow-hidden" style={MAP_GROUND} role="img" aria-label={markers.map((m) => m.title).join(", ")}>
      {/* A "road" and a "park" so it reads as a map at a glance. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "62%", height: 10, backgroundColor: "#fdf6dc", transform: "rotate(-8deg)" }} />
      <div style={{ position: "absolute", left: "8%", top: "12%", width: "22%", height: "26%", borderRadius: 12, backgroundColor: "#d3e6cc" }} />
      {markers.map((marker) => {
        const x = clamp(50 + ((marker.lng - region.longitude) / region.longitudeDelta) * 100);
        const y = clamp(50 - ((marker.lat - region.latitude) / region.latitudeDelta) * 100);
        return (
          <button
            type="button"
            key={marker.id}
            onClick={() => onMarkerPress(marker.id)}
            aria-label={marker.title}
            style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -100%)" }}
          >
            <svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true">
              <path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 25 15 25s15-13.8 15-25C30 6.7 23.3 0 15 0z" fill={colors.brand.accent} />
              <circle cx="15" cy="15" r="5.5" fill={colors.brand.surface} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
