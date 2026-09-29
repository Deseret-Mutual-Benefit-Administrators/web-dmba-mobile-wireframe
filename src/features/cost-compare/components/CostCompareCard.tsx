import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Button } from "@/src/shared/components/Button";
import { IconChip } from "@/src/shared/components/IconChip";
import { SectionTitle, Label } from "@/src/shared/components/Typography";
import { useOpenExternalLink } from "@/src/features/care-navigation/placeholder";
import { useCostCompareLaunch } from "../placeholder";

/**
 * Benefits > Estimate Costs tab — the price-comparison link-out entry point
 * (ADR-138, ADR-140). Three states: not available (calm copy), error (shared
 * InlineErrorState with Try Again), idle/loading (the CTA).
 */
export function CostCompareCard() {
  const { t } = useTranslation();
  const { open, isOpening } = useOpenExternalLink();
  const launch = useCostCompareLaunch();

  const handlePress = () => {
    launch.mutate(undefined, {
      onSuccess: (data) => {
        open(data.url);
      },
    });
  };

  const isBusy = launch.isPending || isOpening;
  const errorKind = launch.errorKind;

  return (
    <div className="bg-brand-surface rounded-2xl shadow-sm p-4 mb-3">
      <div className="flex-row items-center mb-2">
        <div className="mr-3" aria-hidden="true">
          <IconChip icon={<Icon name="calculator-outline" size={20} color={colors.brand.accent} />} />
        </div>
        <SectionTitle className="flex-1">{t("costCompare.title")}</SectionTitle>
      </div>

      <span className="text-sm text-gray-600 mb-4 leading-relaxed">{t("costCompare.description")}</span>

      {errorKind === "notAvailable" ? (
        <Label className="leading-relaxed">{t("costCompare.notAvailable")}</Label>
      ) : errorKind === "error" ? (
        <InlineErrorState message={t("costCompare.loadError")} onRetry={handlePress} />
      ) : (
        <Button
          label={t("costCompare.cta")}
          onPress={handlePress}
          loading={isBusy}
          fullWidth
          accessibilityHint={t("common.hints.opensBrowser")}
        />
      )}
    </div>
  );
}
