import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { TierBadge } from "../components/TierBadge";
import { findMedicineCabinetItem, formatCopay, requirementState } from "../services/medicationTransforms";
import { medicationDetailFor, medicineCabinet } from "../placeholder";
import type { MedicineCabinetItem } from "../types";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import { dashboardHeroGradient, gradientCss } from "@/src/shared/theme/gradients";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Caption, SectionTitle } from "@/src/shared/components/Typography";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { Spinner } from "@/src/shared/components/Spinner";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { useToast } from "@/src/shared/components/Toast";

/**
 * `app/medication/[name].tsx`. `?state=loading|error` shows those states;
 * `?state=empty` is the 404 answer (the drug reference doesn't carry this name).
 * The medicine cabinet is local state seeded from sample data.
 */
export function MedicationDetailRoute() {
  const { name } = useParams<{ name: string }>();
  const [params] = useSearchParams();
  const state = params.get("state");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [cabinetItems, setCabinetItems] = useState<MedicineCabinetItem[]>(medicineCabinet);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const isLoading = state === "loading";
  const isError = state === "error";
  const medication = isLoading || isError || state === "empty" ? undefined : medicationDetailFor(name);
  const cabinetItem = medication ? findMedicineCabinetItem(cabinetItems, medication) : undefined;
  const alreadyInCabinet = cabinetItem !== undefined;

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background">
        <Spinner size="large" tone="accent" />
        <span className="mt-2 text-gray-500">{t("common.loading")}</span>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="flex-1 justify-center bg-brand-background">
        <EmptyState
          icon={
            <div className="w-16 h-16 rounded-full bg-teal-100 items-center justify-center">
              <Icon name="medkit-outline" size={32} color={colors.medication} />
            </div>
          }
          title={t("search.medicationDetail.notFoundTitle")}
          message={t("search.medicationDetail.notFoundMessage", { name: name ?? "" })}
          action={{
            label: t("search.medicationDetail.searchAction"),
            onPress: () => navigate("/benefits?tab=coverage&sub=pharmacy", { replace: true }),
          }}
        />
      </div>
    );
  }

  if (isError || !medication) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background px-6">
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <span className="text-error text-center mt-3 mb-4 text-base">{t("common.error")}</span>
        <Button label={t("common.back")} onPress={() => navigate(-1)} />
      </div>
    );
  }

  const handleAddToMedicineCabinet = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setCabinetItems((items) => [
        ...items,
        {
          medicationId: medication.ndcCode,
          drugName: medication.name,
          genericName: medication.genericName,
          addedAt: "2026-09-29T00:00:00Z",
          source: "ManualAdd",
        },
      ]);
      window.alert(
        `${t("search.medicineCabinet.added")}\n\n${t("search.medicineCabinet.addedMessage", { name: medication.genericName })}`
      );
    }, 400);
  };

  const unavailable = t("common.unavailableValue");
  const copay = formatCopay(medication.copayDisplay, unavailable);
  const hasCopay = copay !== unavailable;
  const priorAuth = requirementState(medication.requiresPriorAuth);
  const stepTherapy = requirementState(medication.requiresStepTherapy);

  const handleRemoveFromMedicineCabinet = () => {
    if (!cabinetItem) return;
    setIsRemoving(true);
    setTimeout(() => {
      setIsRemoving(false);
      setCabinetItems((items) => items.filter((item) => item.medicationId !== cabinetItem.medicationId));
    }, 400);
  };

  const handleCopyNdc = async () => {
    try {
      await navigator.clipboard.writeText(medication.ndcCode);
    } catch {
      // Clipboard can be unavailable (insecure context); the toast still shows.
    }
    toast.show(t("search.medicationDetail.ndcCopied"));
  };

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      {/* Gradient header — matches dashboard style */}
      <div
        style={{
          background: gradientCss(dashboardHeroGradient, 135),
          paddingTop: 0 + 8,
          paddingBottom: 24,
          paddingLeft: 16,
          paddingRight: 16,
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute rounded-full"
          style={{ top: -60, right: -60, width: 160, height: 160, backgroundColor: withAlpha(colors.brand.surface, 0.08) }}
        />
        <div
          className="absolute rounded-full"
          style={{ bottom: -40, left: -40, width: 120, height: 120, backgroundColor: withAlpha(colors.brand.surface, 0.06) }}
        />

        {/* Back + Title */}
        <div className="flex-row items-center mb-4 relative z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-3 p-1 active:opacity-80"
            aria-label={t("common.back")}
          >
            <Icon name="arrow-back" size={24} color={colors.brand.surface} />
          </button>
          <div className="flex-1">
            <span className="text-white text-xl font-bold">{medication.genericName}</span>
            {medication.brandName && <span className="text-white text-sm mt-0.5">{medication.brandName}</span>}
          </div>
        </div>
      </div>

      <ScreenScrollView className="pt-4">
        {/* Coverage Tier + Copay */}
        <Card className="mb-3">
          <div className="flex-row items-center justify-between">
            <div>
              <div className="flex-row items-center mb-1">
                <Caption className="mr-1.5">{t("search.medicationDetail.coverageTier")}</Caption>
                <button
                  type="button"
                  onClick={() =>
                    window.alert(
                      `${t("search.medicationDetail.coverageTier")}\n\n${t("search.medicationDetail.tierExplanation")}`
                    )
                  }
                  className="active:opacity-80"
                  aria-label={t("search.medicationDetail.tierInfo")}
                >
                  <Icon name="help-circle-outline" size={14} color={colors.neutral[500]} />
                </button>
              </div>
              <TierBadge tier={medication.tier} />
            </div>
            <div className="items-end">
              <Caption className="mb-1">{t("search.medications.copay")}</Caption>
              {hasCopay ? (
                <span className="text-2xl font-bold text-brand-accent">{copay}</span>
              ) : (
                <Caption>{copay}</Caption>
              )}
            </div>
          </div>
          {hasCopay && <Caption className="mt-2">{t("search.medicationDetail.copayCaveat")}</Caption>}
        </Card>

        {/* NDC Code */}
        <Card className="mb-3">
          <Caption className="mb-1">{t("search.medications.ndcCode")}</Caption>
          <button
            type="button"
            onClick={() => void handleCopyNdc()}
            className="flex-row items-center active:opacity-80"
            aria-label={t("search.medicationDetail.copyNdc")}
          >
            <span className="font-mono text-sm text-brand-primary">{medication.ndcCode}</span>
            <span style={{ marginLeft: 6, display: "inline-flex" }}>
              <Icon name="copy-outline" size={14} color={colors.neutral[500]} />
            </span>
          </button>
        </Card>

        {/* Description */}
        {medication.description && (
          <Card className="mb-3">
            <span className="text-sm font-semibold text-brand-primary mb-1">{t("search.medicationDetail.about")}</span>
            <span className="text-sm text-gray-600 leading-5">{medication.description}</span>
          </Card>
        )}

        {/* Prior Auth / Requirements */}
        {priorAuth === "required" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
            <div className="flex-row items-start">
              <span style={{ marginTop: 1, display: "inline-flex" }}>
                <Icon name="alert-circle" size={18} color={colors.highlight.base} />
              </span>
              <div className="ml-2 flex-1">
                <span className="text-sm font-semibold text-amber-800 mb-1">
                  {t("search.medicationDetail.priorAuthRequired")}
                </span>
                <span className="text-xs text-amber-700">{t("search.medicationDetail.priorAuthNotice")}</span>
              </div>
            </div>
          </div>
        )}

        {stepTherapy === "required" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
            <div className="flex-row items-start">
              <span style={{ marginTop: 1, display: "inline-flex" }}>
                <Icon name="alert-circle" size={18} color={colors.highlight.base} />
              </span>
              <div className="ml-2 flex-1">
                <span className="text-sm font-semibold text-amber-800 mb-1">
                  {t("search.medicationDetail.stepTherapyRequired")}
                </span>
                <span className="text-xs text-amber-700">{t("search.medicationDetail.stepTherapyDetail")}</span>
              </div>
            </div>
          </div>
        )}

        {(priorAuth === "unknown" || stepTherapy === "unknown") && (
          <Card className="mb-3">
            <Caption className="mb-1">{t("search.medicationDetail.requirements")}</Caption>
            {priorAuth === "unknown" && (
              <KeyValueRow label={t("search.medicationDetail.priorAuthLabel")} value={unavailable} />
            )}
            {stepTherapy === "unknown" && (
              <KeyValueRow label={t("search.medicationDetail.stepTherapyLabel")} value={unavailable} />
            )}
          </Card>
        )}

        {/* Therapeutic Alternatives */}
        {medication.alternatives.length > 0 && (
          <div className="mb-3">
            <SectionTitle className="mb-3">{t("search.medicationDetail.therapeuticAlternatives")}</SectionTitle>
            {medication.alternatives.map((alt) => (
              <Card key={alt.ndcCode} className="mb-2 flex-row items-center">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-brand-primary">{alt.name}</span>
                  <div className="mt-1">
                    <TierBadge tier={alt.tier} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add to Medicine Cabinet — hidden once already added */}
        {alreadyInCabinet ? (
          <div className="mt-2">
            <div className="flex-row items-center justify-center bg-teal-50 py-4 rounded-xl">
              <Icon name="checkmark-circle" size={20} color={colors.medication} />
              <span className="text-teal-700 font-semibold ml-2">{t("search.medicineCabinet.inCabinet")}</span>
            </div>
            {cabinetItem?.source === "ManualAdd" && (
              <Button
                variant="secondary"
                size="sm"
                label={t("search.medicineCabinet.removeFromCabinet")}
                onPress={handleRemoveFromMedicineCabinet}
                loading={isRemoving}
                className="self-center mt-3"
              />
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToMedicineCabinet}
            disabled={isAdding}
            className="flex-row items-center justify-center bg-brand-accent py-4 rounded-xl active:opacity-80 disabled:opacity-50 mt-2"
            aria-label={t("search.medications.addToMedicineCabinet")}
          >
            {isAdding ? (
              <Spinner size="small" tone="onDark" />
            ) : (
              <Icon name="medkit-outline" size={20} color={colors.brand.surface} />
            )}
            <span className="text-white font-semibold ml-2">{t("search.medications.addToMedicineCabinet")}</span>
          </button>
        )}
      </ScreenScrollView>
    </div>
  );
}
