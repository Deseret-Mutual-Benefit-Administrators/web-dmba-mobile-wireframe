import { useTranslation } from "@/src/shared/i18n";
import { SectionTitle } from "@/src/shared/components/Typography";
import { CoreScoreCard } from "./CoreScoreCard";
import { ChecklistSection } from "./ChecklistSection";
import { FinancialContentCards } from "./FinancialContentCards";
import { ResourceLinkRow } from "./ResourceLinkRow";
import { MeetTheTeamStrip } from "./MeetTheTeamStrip";
import { ScheduleCard } from "./ScheduleCard";
import { DisclaimerCard } from "@/src/shared/components/DisclaimerCard";
import { financialResources } from "../data/financialResources";

/**
 * Financial Planning sub-tab. Layout: tagline → Core Score card → checklist →
 * content cards → resources → Meet the team → schedule card → disclaimer.
 */
export function FinancialPlanningTab() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0 }}>
      <div style={{ padding: 16, paddingBottom: 80 }}>
        <SectionTitle className="mb-4">{t("careNavigation.tagline")}</SectionTitle>

        <CoreScoreCard />
        <ChecklistSection />
        <FinancialContentCards />

        {financialResources.length > 0 && (
          <div className="mb-1">
            {financialResources.map((resource) => (
              <ResourceLinkRow key={resource.key} resource={resource} />
            ))}
          </div>
        )}

        <MeetTheTeamStrip />
        <ScheduleCard />
        <DisclaimerCard />
      </div>
    </div>
  );
}
