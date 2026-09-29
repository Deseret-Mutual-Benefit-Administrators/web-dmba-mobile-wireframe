import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { InNetworkBadge } from "../components/InNetworkBadge";
import { MapPreview } from "../components/MapPreview";
import { DetailActionButton } from "../components/DetailActionButton";
import { formatDistance } from "../services/searchTransforms";
import { findFacility, readState } from "../placeholder";
import { colors } from "@/src/shared/theme/colors";
import { facilityHeaderGradient, gradientCss } from "@/src/shared/theme/gradients";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { Label, Caption } from "@/src/shared/components/Typography";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";

/** Translated from `app/facility/[id].tsx`. `?state=loading|error` shows those states. */
export function FacilityDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const state = readState(params);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const facility = state === "error" || state === "empty" ? null : findFacility(id);
  const isLoading = state === "loading";
  const [infoOpen, setInfoOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background">
        <div
          role="progressbar"
          className="animate-spin rounded-full"
          style={{ width: 36, height: 36, border: `3px solid ${colors.brand.secondary}`, borderTopColor: "transparent" }}
        />
        <span className="mt-2 text-gray-500">{t("common.loading")}</span>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background px-6">
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <span className="text-error text-center mt-3 mb-4 text-base">{t("common.error")}</span>
        <Button label={t("common.back")} onPress={() => navigate(-1)} />
      </div>
    );
  }

  const cityLine = `${facility.city}, ${facility.state} ${facility.zip}`;
  const distance = formatDistance(facility.distanceMiles);
  const isPreauth = facility.facilityType === "Hospital" || facility.facilityType === "SurgeryCenterASC";

  // Wireframe: tel:, maps, the share sheet and the contact form are native hand-offs.
  const noop = () => {};

  const hasFacilityInfo = !!facility.hours || facility.services.length > 0 || facility.beds != null;

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      {/* Header */}
      <div style={{ background: gradientCss(facilityHeaderGradient), paddingTop: 8, paddingBottom: 14, paddingLeft: 16, paddingRight: 16 }}>
        <div className="flex-row items-center">
          <button type="button" onClick={() => navigate(-1)} className="p-1 active:opacity-80" aria-label={t("common.back")}>
            <Icon name="arrow-back" size={24} color={colors.brand.surface} />
          </button>
          <h1 className="flex-1 text-center text-white text-lg font-bold mr-8 truncate">{facility.name}</h1>
        </div>
      </div>

      <ScreenScrollView className="pt-4">
        {/* Map preview + fullscreen */}
        <MapPreview latitude={facility.latitude} longitude={facility.longitude} title={facility.name} />

        {/* Facility summary card */}
        <Card className="mt-3">
          <span className="text-2xl font-bold text-brand-primary">{facility.name}</span>
          <Label className="mt-0.5">{facility.facilityType}</Label>

          {/* Status line */}
          <div className="flex-row flex-wrap gap-2 mt-2">
            <InNetworkBadge isInNetwork={facility.isInNetwork} />
            {facility.isOpen24Hours && (
              <div className="bg-blue-50 px-2 py-0.5 rounded-full">
                <span className="text-xs text-blue-700 font-medium">{t("search.facilityDetail.open24Hours")}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Address + distance */}
          <div className="flex-row items-start justify-between">
            <div className="flex-1 pr-3">
              {facility.addressLine1 ? (
                <>
                  <span className="text-sm text-gray-600">{facility.addressLine1}</span>
                  <span className="text-sm text-gray-600">{cityLine}</span>
                </>
              ) : (
                <span className="text-sm text-gray-600">{facility.address}</span>
              )}
            </div>
            {distance !== "" && <span className="text-base font-bold text-brand-primary">{distance}</span>}
          </div>

          {/* Action row */}
          <div className="flex-row justify-between mt-5">
            <DetailActionButton icon="call-outline" label={t("search.call")} onPress={noop} hint={t("common.hints.callsPhone")} />
            <DetailActionButton icon="navigate-outline" label={t("search.directions")} onPress={noop} hint={t("common.hints.opensBrowser")} />
            <DetailActionButton icon="share-social-outline" label={t("search.share")} onPress={noop} hint={t("common.hints.opensShareSheet")} />
            <DetailActionButton icon="add" label={t("search.addContact")} onPress={noop} hint={t("common.hints.opensContactForm")} />
          </div>
        </Card>

        {/* Preauth warning — safety notice, always visible (not collapsed) */}
        {isPreauth && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-3 flex-row">
            <div style={{ marginTop: 2 }}>
              <Icon name="alert-circle-outline" size={20} color={colors.highlight.base} />
            </div>
            <span className="text-sm text-amber-800 ml-2 flex-1">{t("search.facilityDetail.preauthWarning")}</span>
          </div>
        )}

        {/* Facility Information (collapsible) */}
        {hasFacilityInfo && (
          <Card className="mt-3">
            <button
              type="button"
              onClick={() => setInfoOpen((o) => !o)}
              className="flex-row items-center justify-between active:opacity-80"
              aria-label={t("search.facilityDetail.facilityInformation")}
              aria-expanded={infoOpen}
            >
              <span className="text-sm font-bold text-brand-primary uppercase tracking-wide">
                {t("search.facilityDetail.facilityInformation")}
              </span>
              <Icon name={infoOpen ? "remove" : "add"} size={22} color={colors.brand.primary} />
            </button>

            {infoOpen && (
              <div className="mt-3">
                {/* Hours */}
                {facility.hours && (
                  <div className="flex-row mb-3">
                    <Label className="w-24">{t("search.facilityDetail.hours")}:</Label>
                    <div className="flex-1">
                      {Object.entries(facility.hours).map(([day, time]) => (
                        <div key={day} className="flex-row mb-0.5">
                          <span className="w-24 text-sm font-semibold text-brand-primary truncate">{day}</span>
                          <span className="text-sm text-brand-primary flex-1 truncate">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {facility.services.length > 0 && (
                  <div className="mb-3">
                    <Caption className="mb-1">{t("search.facilityDetail.services")}</Caption>
                    <div className="flex-row flex-wrap gap-1.5">
                      {facility.services.map((svc) => (
                        <div key={svc} className="bg-blue-50 rounded-full px-3 py-1">
                          <span className="text-xs text-blue-700">{svc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beds */}
                {facility.beds != null && (
                  <div className="flex-row">
                    <Label className="w-24">{t("search.facilityDetail.beds")}:</Label>
                    <span className="text-sm text-brand-primary flex-1">{facility.beds}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </ScreenScrollView>
    </div>
  );
}
