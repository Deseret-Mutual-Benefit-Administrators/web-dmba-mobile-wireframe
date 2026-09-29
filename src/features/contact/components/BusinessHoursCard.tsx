import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { businessHours } from "../data/departments";

export function BusinessHoursCard() {
  const { t } = useTranslation();

  return (
    <div className="bg-brand-surface rounded-2xl p-4 mb-4 shadow-sm" aria-label={t("contact.businessHoursLabel")}>
      <div className="flex-row items-center mb-3">
        {/* Clock icon — decorative, card label covers context */}
        <div className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-2.5" aria-hidden="true">
          <Icon name="time-outline" size={18} color={colors.brand.accent} />
        </div>
        <span className="text-brand-primary font-semibold text-sm">{t("contact.businessHours")}</span>
      </div>

      {businessHours.map((row) => (
        <div key={row.daysKey} className="flex-row justify-between items-center py-1">
          <span className="text-brand-secondary text-sm">{t(row.daysKey)}</span>
          <span className="text-brand-primary text-sm font-medium">{t(row.hoursKey)}</span>
        </div>
      ))}

      <div className="mt-2 pt-2 border-t border-gray-100 flex-row items-center">
        {/* Location pin icon — decorative */}
        <Icon name="location-outline" size={13} color={colors.brand.secondary} />
        <span className="text-brand-secondary text-xs ml-1">{t("contact.mountainTime")}</span>
      </div>
    </div>
  );
}
