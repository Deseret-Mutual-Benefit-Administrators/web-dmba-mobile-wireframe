import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { IconChip } from "@/src/shared/components/IconChip";
import { useOpenExternalLink } from "../placeholder";
import { SCHEDULE_URL } from "../data/financialResources";

/** "Schedule with a planner" card — links out to the scheduling web flow. */
export function ScheduleCard() {
  const { t } = useTranslation();
  const { open, isOpening } = useOpenExternalLink();

  return (
    <button
      type="button"
      onClick={() => open(SCHEDULE_URL)}
      disabled={isOpening}
      className={`bg-brand-surface rounded-2xl shadow-sm p-4 mb-3 flex-row items-center active:opacity-80 ${
        isOpening ? "opacity-50" : ""
      }`}
      aria-label={t("careNavigation.schedule.cta")}
      title={t("common.hints.opensBrowser")}
    >
      <div className="mr-3" aria-hidden="true">
        <IconChip icon={<Icon name="calendar-outline" size={20} color={colors.brand.accent} />} tone="info" />
      </div>
      <div className="flex-1">
        <span className="text-brand-primary font-semibold">{t("careNavigation.schedule.title")}</span>
        <span className="text-gray-500 text-xs mt-0.5">{t("careNavigation.schedule.subtitle")}</span>
      </div>
      <Icon name="chevron-forward" size={20} color={colors.brand.secondary} />
    </button>
  );
}
