import { useTranslation } from "@/src/shared/i18n";
import { InfoCard } from "./InfoCard";
import { SendMessageCta } from "./SendMessageCta";
import { DisclaimerCard } from "@/src/shared/components/DisclaimerCard";
import { mentalHealthCards } from "../data/mentalHealthContent";

interface MentalHealthTabProps {
  onShowCoverage: () => void;
}

/** Mental Health sub-tab — static coverage language, no cost-share numbers. */
export function MentalHealthTab({ onShowCoverage }: MentalHealthTabProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0 }}>
      <div style={{ padding: 16, paddingBottom: 80 }}>
        <span className="text-sm text-gray-600 leading-relaxed mb-1">{t("careNavigation.mentalHealth.intro")}</span>
        <div className="mb-4">
          <SendMessageCta labelKey="careNavigation.mentalHealth.contactCta" topic="benefitsCoverage" />
        </div>
        {mentalHealthCards.map((card) => (
          <InfoCard key={card.key} card={card} onShowCoverage={onShowCoverage} />
        ))}
        <DisclaimerCard textKey="careNavigation.mentalHealth.disclaimer" />
      </div>
    </div>
  );
}
