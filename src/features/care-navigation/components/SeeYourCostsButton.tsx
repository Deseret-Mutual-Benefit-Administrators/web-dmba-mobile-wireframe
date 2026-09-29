import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface SeeYourCostsButtonProps {
  onPress: () => void;
}

/** "See what you'll pay on the Coverage tab" — the only cost CTA a static pane gets. */
export function SeeYourCostsButton({ onPress }: SeeYourCostsButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex-row items-center justify-center border border-brand-accent rounded-xl py-2.5 mt-3 active:opacity-80"
      aria-label={t("careNavigation.seeYourCosts")}
    >
      <span className="text-brand-accent font-semibold mr-1.5">{t("careNavigation.seeYourCosts")}</span>
      <Icon name="arrow-forward" size={16} color={colors.brand.accent} />
    </button>
  );
}
