import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import type { PhoneEntry } from "../types";

interface PhoneRowProps {
  entry: PhoneEntry;
}

export function PhoneRow({ entry }: PhoneRowProps) {
  const { t } = useTranslation();

  return (
    <a
      href={entry.number}
      className="flex-row items-center py-3.5 px-4 bg-brand-surface rounded-xl mb-2 active:opacity-80"
      role="button"
      aria-label={t("contact.callPhoneEntry", { label: t(entry.labelKey), number: entry.displayNumber })}
      aria-description={t("common.hints.callsPhone")}
    >
      {/* Phone icon — decorative, covered by the row label */}
      <div className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3" aria-hidden="true">
        <Icon name="call-outline" size={18} color={colors.brand.accent} />
      </div>

      {/* Label + note */}
      <div className="flex-1">
        <span className="text-brand-primary font-medium text-sm">{t(entry.labelKey)}</span>
        {entry.noteKey && <span className="text-brand-secondary text-xs mt-0.5">{t(entry.noteKey)}</span>}
      </div>

      {/* Phone number */}
      <span className="text-brand-accent font-semibold text-sm mr-2">{entry.displayNumber}</span>

      {/* Chevron — decorative */}
      <Icon name="chevron-forward" size={16} color={colors.brand.secondary} />
    </a>
  );
}
