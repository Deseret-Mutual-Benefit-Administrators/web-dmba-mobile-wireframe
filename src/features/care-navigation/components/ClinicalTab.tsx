import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Card } from "@/src/shared/components/Card";
import { SectionTitle } from "@/src/shared/components/Typography";
import { InfoCard } from "./InfoCard";
import { SendMessageCta } from "./SendMessageCta";
import { DisclaimerCard } from "@/src/shared/components/DisclaimerCard";
import { clinicalCards, clinicalScenarios } from "../data/clinicalContent";

/** Clinical/Medical sub-tab — header + message CTA, one InfoCard per service, "When to reach out". */
export function ClinicalTab() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0 }}>
      <div style={{ padding: 16, paddingBottom: 80 }}>
        <Card className="mb-3">
          <h2 className="text-brand-primary font-semibold text-lg">{t("careNavigation.clinical.title")}</h2>
          <span className="text-sm text-gray-600 leading-relaxed mt-1">{t("careNavigation.clinical.summary")}</span>
          <SendMessageCta labelKey="careNavigation.clinical.contactCta" topic="benefitsCoverage" />
        </Card>

        {clinicalCards.map((card) => (
          <InfoCard key={card.key} card={card} />
        ))}

        <Card className="mb-3">
          <div className="flex-row items-center mb-3">
            <div aria-hidden="true">
              <Icon name="information-circle-outline" size={20} color={colors.brand.accent} />
            </div>
            <SectionTitle className="ml-2 flex-1">{t("careNavigation.clinical.scenarios.title")}</SectionTitle>
          </div>
          {clinicalScenarios.map((scenario) => (
            <div key={scenario.key} className="bg-gray-50 rounded-xl px-3 py-2.5 mb-2">
              <span className="text-sm font-semibold text-brand-primary">{t(scenario.titleKey)}</span>
              <span className="text-xs text-gray-600 mt-0.5 leading-relaxed">{t(scenario.descriptionKey)}</span>
            </div>
          ))}
        </Card>
        <DisclaimerCard textKey="careNavigation.clinical.disclaimer" />
      </div>
    </div>
  );
}
