import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Card } from "@/src/shared/components/Card";
import { colors } from "@/src/shared/theme/colors";
import { BusinessHoursCard } from "../components/BusinessHoursCard";
import { PhoneRow } from "../components/PhoneRow";
import { phoneEntries } from "../data/departments";

export function ContactRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={t("contact.title")} />

      <ScreenScrollView className="pt-5">
        {/* Business hours */}
        <BusinessHoursCard />

        {/* Secure messaging — a written alternative to the phone directory below. */}
        <button
          type="button"
          onClick={() => navigate("/messages/compose")}
          aria-label={t("contact.sendSecureMessage")}
          aria-description={t("common.hints.opensNewMessage")}
          className="active:opacity-80 mb-4 text-left"
        >
          <Card className="flex-row items-center">
            <div className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3" aria-hidden="true">
              <Icon name="mail-outline" size={18} color={colors.brand.accent} />
            </div>
            <div className="flex-1">
              <span className="text-brand-primary font-medium text-sm">{t("contact.sendSecureMessage")}</span>
              <span className="text-brand-secondary text-xs mt-0.5">{t("contact.sendSecureMessageNote")}</span>
            </div>
            <Icon name="chevron-forward" size={16} color={colors.brand.secondary} />
          </Card>
        </button>

        {/* Phone directory */}
        <span className="text-brand-secondary text-xs font-semibold uppercase tracking-wide mb-3 ml-1">
          {t("contact.phoneDirectory")}
        </span>

        {/* Keyed by label, not number: the placeholder numbers repeat. */}
        {phoneEntries.map((entry) => (
          <PhoneRow key={entry.labelKey} entry={entry} />
        ))}

        {/* Emergency / after-hours note */}
        <div className="mt-4 bg-amber-50 rounded-xl p-4 flex-row items-start gap-3">
          <Icon name="information-circle-outline" size={20} color={colors.highlight.base} />
          <span className="text-amber-800 text-sm flex-1">{t("contact.emergencyNote")}</span>
        </div>
      </ScreenScrollView>
    </div>
  );
}
