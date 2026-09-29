import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Card } from "@/src/shared/components/Card";
import { IconChip } from "@/src/shared/components/IconChip";
import { SectionTitle } from "@/src/shared/components/Typography";
import { SeeYourCostsButton } from "./SeeYourCostsButton";
import { SendMessageCta } from "./SendMessageCta";
import type { CalloutTone, InfoCardDef } from "../types";

interface InfoCardProps {
  card: InfoCardDef;
  /** Required when any card in the pane uses a "seeCosts" CTA. */
  onShowCoverage?: () => void;
}

const CALLOUT_STYLE: Record<CalloutTone, { container: string; text: string; icon: string; color: string }> = {
  info: {
    container: "bg-info-tint",
    text: "text-brand-secondary",
    icon: "information-circle-outline",
    color: colors.brand.accent,
  },
  warning: {
    container: "bg-amber-50",
    text: "text-amber-900",
    icon: "warning-outline",
    color: colors.tone.warning.icon,
  },
  excluded: {
    container: "bg-red-50",
    text: "text-red-900",
    icon: "close-circle-outline",
    color: colors.tone.error.icon,
  },
};

/** One static InfoCardDef: icon + title, summary, bullets, toned callouts, typed CTA. */
export function InfoCard({ card, onShowCoverage }: InfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-3">
      <div className="flex-row items-center mb-2">
        <div className="mr-3" aria-hidden="true">
          <IconChip icon={<Icon name={card.icon} size={20} color={colors.brand.accent} />} tone="info" />
        </div>
        <SectionTitle className="flex-1">{t(card.titleKey)}</SectionTitle>
      </div>

      <span className="text-sm text-gray-600 leading-relaxed">{t(card.summaryKey)}</span>

      {card.bulletKeys && card.bulletKeys.length > 0 && (
        <div className="mt-3">
          {card.bulletsHeadingKey && (
            <span className="text-sm font-semibold text-brand-primary mb-1">{t(card.bulletsHeadingKey)}</span>
          )}
          {card.bulletKeys.map((bulletKey) => (
            <div key={bulletKey} className="flex-row items-start mb-1">
              <span className="text-brand-accent mr-2" aria-hidden="true">
                •
              </span>
              <span className="text-sm text-gray-700 flex-1 leading-relaxed">{t(bulletKey)}</span>
            </div>
          ))}
        </div>
      )}

      {card.callouts?.map((callout) => {
        const style = CALLOUT_STYLE[callout.tone];
        return (
          <div key={callout.textKey} className={`${style.container} rounded-xl px-3 py-2.5 mt-3 flex-row items-start`}>
            <div className="mt-0.5" aria-hidden="true">
              <Icon name={style.icon} size={16} color={style.color} />
            </div>
            <span className={`text-xs ${style.text} ml-2 flex-1 leading-relaxed`}>{t(callout.textKey)}</span>
          </div>
        );
      })}

      {card.cta?.kind === "seeCosts" && onShowCoverage && <SeeYourCostsButton onPress={onShowCoverage} />}
      {card.cta?.kind === "message" && <SendMessageCta labelKey={card.cta.labelKey} topic={card.cta.topic} />}
    </Card>
  );
}
