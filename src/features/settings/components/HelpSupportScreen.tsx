import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Eyebrow } from "@/src/shared/components/Typography";
import { IconChip } from "@/src/shared/components/IconChip";
import { FAQ_ENTRIES } from "../data/faq";

interface HelpSupportScreenProps {
  onBack: () => void;
}

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  function toggleFaq(id: string) {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={t("settings.help.title")} onBack={onBack} />

      <ScreenScrollView padded={false} bottomExtra={8}>
        {/* FAQ section header */}
        <div className="px-4 pt-4 pb-1">
          <Eyebrow>{t("settings.help.faqSection")}</Eyebrow>
        </div>

        {/* FAQ accordion */}
        <div className="bg-brand-surface rounded-2xl shadow-sm mx-4 mb-4 overflow-hidden">
          {FAQ_ENTRIES.map((entry, index) => (
            <div key={entry.id} className={index > 0 ? "border-t border-gray-100" : ""}>
              <button
                type="button"
                onClick={() => toggleFaq(entry.id)}
                className="flex-row items-center px-4 py-3 active:opacity-80"
                aria-label={t(entry.questionKey)}
                aria-expanded={expandedFaqId === entry.id}
              >
                <span className="flex-1 text-sm font-medium text-brand-primary pr-2 text-left">
                  {t(entry.questionKey)}
                </span>
                <Icon
                  name={expandedFaqId === entry.id ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.brand.secondary}
                />
              </button>
              {expandedFaqId === entry.id && (
                <div className="px-4 pb-3">
                  <span className="text-sm text-gray-600 leading-5">
                    {t(entry.answerKey)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions section header */}
        <div className="px-4 pb-1">
          <Eyebrow>{t("settings.help.actionsSection")}</Eyebrow>
        </div>

        {/* Action rows */}
        <div className="bg-brand-surface rounded-2xl shadow-sm mx-4 mb-4 overflow-hidden">
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="flex-row items-center px-4 py-3 active:opacity-80"
            aria-label={t("settings.help.contactSupport")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="call-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <span className="flex-1 text-sm font-medium text-brand-primary text-left">
              {t("settings.help.contactSupport")}
            </span>
            <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
          </button>

          {/* The app opens a mail compose to DMBA support; inert in the wireframe. */}
          <button
            type="button"
            onClick={() => undefined}
            className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
            aria-label={t("settings.help.appFeedback")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="chatbubble-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <span className="flex-1 text-sm font-medium text-brand-primary text-left">
              {t("settings.help.appFeedback")}
            </span>
            <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
          </button>
        </div>
      </ScreenScrollView>
    </div>
  );
}
