import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { InNetworkBadge } from "../components/InNetworkBadge";
import { MapPreview } from "../components/MapPreview";
import { DetailActionButton } from "../components/DetailActionButton";
import { parseOfficeHours, formatDistance } from "../services/searchTransforms";
import { findProvider, readState } from "../placeholder";
import { colors } from "@/src/shared/theme/colors";
import { gradientCss, providerHeaderGradient } from "@/src/shared/theme/gradients";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { Label, Caption } from "@/src/shared/components/Typography";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";

/** Translated from `app/provider/[npi].tsx`. `?state=loading|error` shows those states. */
export function ProviderDetailRoute() {
  const { npi } = useParams<{ npi: string }>();
  const [params] = useSearchParams();
  const state = readState(params);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const provider = state === "error" || state === "empty" ? null : findProvider(npi);
  const isLoading = state === "loading";
  const [practiceOpen, setPracticeOpen] = useState(true);

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

  if (!provider) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background px-6">
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <span className="text-error text-center mt-3 mb-4 text-base">{t("common.error")}</span>
        <Button label={t("common.back")} onPress={() => navigate(-1)} />
      </div>
    );
  }

  const fullName = `${provider.firstName} ${provider.lastName}${provider.credentials ? `, ${provider.credentials}` : ""}`;
  const officeHours = parseOfficeHours(provider.officeHours);
  const cityLine = `${provider.city}, ${provider.state} ${provider.zip}`;
  const distance = formatDistance(provider.distanceMiles);

  // Wireframe: tel:, maps, the share sheet and the contact form are native hand-offs.
  const noop = () => {};

  const hasPracticeInfo =
    officeHours.length > 0 ||
    !!provider.about ||
    !!provider.medicalSchool ||
    provider.yearsExperience != null ||
    !!provider.boardCertifications ||
    provider.languages.length > 0 ||
    provider.hospitalAffiliations.length > 0;

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      {/* Header */}
      <div style={{ background: gradientCss(providerHeaderGradient), paddingTop: 8, paddingBottom: 14, paddingLeft: 16, paddingRight: 16 }}>
        <div className="flex-row items-center">
          <button type="button" onClick={() => navigate(-1)} className="p-1 active:opacity-80" aria-label={t("common.back")}>
            <Icon name="arrow-back" size={24} color={colors.brand.surface} />
          </button>
          <h1 className="flex-1 text-center text-white text-lg font-bold mr-8 truncate">{fullName}</h1>
        </div>
      </div>

      <ScreenScrollView className="pt-4">
        {/* Map preview + fullscreen */}
        <MapPreview latitude={provider.latitude} longitude={provider.longitude} title={fullName} />

        {/* Provider summary card */}
        <Card className="mt-3">
          <span className="text-2xl font-bold text-brand-primary">{fullName}</span>
          <Label className="mt-0.5">{provider.specialty}</Label>

          {/* Status line (replaces the mock's accepted-plans line) */}
          <div className="flex-row flex-wrap gap-2 mt-2">
            <InNetworkBadge isInNetwork={provider.isInNetwork} />
            {provider.acceptingNewPatients && (
              <div className="flex-row items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                <Icon name="checkmark-circle" size={14} color={colors.inNetwork} />
                <span className="text-xs text-emerald-700 ml-0.5">{t("search.acceptingPatients")}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Address + distance */}
          <div className="flex-row items-start justify-between">
            <div className="flex-1 pr-3">
              <span className="text-sm text-gray-600">{provider.addressLine1}</span>
              <span className="text-sm text-gray-600">{cityLine}</span>
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

        {/* Practice Information (collapsible) */}
        {hasPracticeInfo && (
          <Card className="mt-3">
            <button
              type="button"
              onClick={() => setPracticeOpen((o) => !o)}
              className="flex-row items-center justify-between active:opacity-80"
              aria-label={t("search.providerDetail.practiceInformation")}
              aria-expanded={practiceOpen}
            >
              <span className="text-sm font-bold text-brand-primary uppercase tracking-wide">
                {t("search.providerDetail.practiceInformation")}
              </span>
              <Icon name={practiceOpen ? "remove" : "add"} size={22} color={colors.brand.primary} />
            </button>

            {practiceOpen && (
              <div className="mt-3">
                {/* Office Hours */}
                {officeHours.length > 0 && (
                  <div className="flex-row mb-3">
                    <Label className="w-24">{t("search.providerDetail.officeHours")}:</Label>
                    <div className="flex-1">
                      {officeHours.map(({ day, hours }) => (
                        <div key={day} className="flex-row mb-0.5">
                          <span className="w-24 text-sm font-semibold text-brand-primary truncate">{day}</span>
                          <span className="text-sm text-brand-primary flex-1 truncate">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                {provider.about && (
                  <div className="mb-3">
                    <Caption className="mb-1">{t("search.providerDetail.about")}</Caption>
                    <span className="text-sm text-gray-600 leading-5">{provider.about}</span>
                  </div>
                )}

                {/* Credentials */}
                {(provider.medicalSchool || provider.yearsExperience != null || provider.boardCertifications) && (
                  <div className="mb-3">
                    <Caption className="mb-1">{t("search.providerDetail.credentials")}</Caption>
                    {provider.medicalSchool && (
                      <div className="flex-row items-center mb-1.5">
                        <Icon name="school-outline" size={16} color={colors.brand.secondary} />
                        <span className="text-sm text-gray-600 ml-2 flex-1">{provider.medicalSchool}</span>
                      </div>
                    )}
                    {provider.yearsExperience != null && (
                      <div className="flex-row items-center mb-1.5">
                        <Icon name="time-outline" size={16} color={colors.brand.secondary} />
                        <span className="text-sm text-gray-600 ml-2">
                          {t("search.providerDetail.yearsExperience", { years: provider.yearsExperience })}
                        </span>
                      </div>
                    )}
                    {provider.boardCertifications && (
                      <div className="flex-row items-center">
                        <Icon name="ribbon-outline" size={16} color={colors.inNetwork} />
                        <span className="text-sm text-emerald-700 ml-2 font-medium flex-1">
                          {t("search.providerDetail.boardCertified")} — {provider.boardCertifications}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Languages */}
                {provider.languages.length > 0 && (
                  <div className="mb-3">
                    <Caption className="mb-1">{t("search.providerDetail.languages")}</Caption>
                    <div className="flex-row flex-wrap gap-1">
                      {provider.languages.map((lang) => (
                        <div key={lang} className="bg-gray-100 rounded-full px-2 py-0.5">
                          <span className="text-xs text-gray-600">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hospital Affiliations */}
                {provider.hospitalAffiliations.length > 0 && (
                  <div>
                    <Caption className="mb-1">{t("search.providerDetail.hospitalAffiliations")}</Caption>
                    {provider.hospitalAffiliations.map((aff) => (
                      <div key={aff} className="flex-row items-center mb-1">
                        <Icon name="business-outline" size={14} color={colors.neutral[500]} />
                        <span className="text-sm text-gray-600 ml-2 flex-1">{aff}</span>
                      </div>
                    ))}
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
