import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface DisclaimerCardProps {
  /** i18n key; defaults to the Financial pane's not-financial-advice text. */
  textKey?: string;
}

/** Small informational note card on the info tint. */
export function DisclaimerCard({ textKey = "careNavigation.disclaimer" }: DisclaimerCardProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-info-tint rounded-xl px-4 py-3 mb-3 flex-row items-start">
      <div className="mt-0.5" aria-hidden="true">
        <Icon name="information-circle-outline" size={16} color={colors.brand.accent} />
      </div>
      <span className="text-xs text-brand-secondary ml-2 flex-1 leading-relaxed">{t(textKey)}</span>
    </div>
  );
}
