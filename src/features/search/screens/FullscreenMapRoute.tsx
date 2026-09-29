import { useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { MapViewComponent, type Region } from "../components/MapViewComponent";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { Button } from "@/src/shared/components/Button";
import { colors } from "@/src/shared/theme/colors";
import { FACILITIES, readState } from "../placeholder";
import type { MapMarker } from "../types";

/** The app pads by `useSafeAreaInsets().bottom`; the phone frame's home-indicator zone is 34. */
const INSETS_BOTTOM = 34;

/**
 * Translated from `app/search/map.tsx` — a pushed fullscreen map taking
 * lat/lng/title as query params. Wireframe: with no params at all it shows a
 * sample location (the bare `/search/map` sample URL); malformed params, or
 * `?state=error`, render the app's invalid-coordinates fallback.
 */
export function FullscreenMapRoute() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const sample = FACILITIES[0];
  const noParams = !params.has("lat") && !params.has("lng");

  const latitude = noParams ? sample.latitude : Number.parseFloat(params.get("lat") ?? "");
  const longitude = noParams ? sample.longitude : Number.parseFloat(params.get("lng") ?? "");
  const hasValidCoords = readState(params) !== "error" && Number.isFinite(latitude) && Number.isFinite(longitude);
  const title = params.get("title") ?? (noParams ? sample.name : "");

  // Wireframe: the app opens Apple/Google Maps directions.
  const handleDirections = () => {};

  if (!hasValidCoords) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={title || t("search.expandMap")} />
        <div className="flex-1 items-center justify-center px-8">
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <span className="text-error text-center mt-3 text-base">{t("common.error")}</span>
        </div>
      </div>
    );
  }

  const marker: MapMarker = { id: "location", lat: latitude, lng: longitude, title };
  const region: Region = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={title || t("search.expandMap")} />
      <div className="flex-1">
        <MapViewComponent markers={[marker]} onMarkerPress={() => {}} initialRegion={region} />

        <Button
          label={t("search.directions")}
          onPress={handleDirections}
          icon={<Icon name="navigate-outline" size={18} color={colors.brand.surface} />}
          style={{ position: "absolute", bottom: INSETS_BOTTOM + 16, left: 16, right: 16 }}
          accessibilityHint={t("common.hints.opensBrowser")}
        />
      </div>
    </div>
  );
}
