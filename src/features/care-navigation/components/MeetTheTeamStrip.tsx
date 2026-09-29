import { useTranslation } from "@/src/shared/i18n";
import { SectionTitle } from "@/src/shared/components/Typography";
import { planners } from "../data/planners";
import { PlannerAvatar } from "./PlannerAvatar";

const CARD_WIDTH = 84;

/** "Meet the team" strip — photo/name/credentials only, non-interactive. */
export function MeetTheTeamStrip() {
  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <SectionTitle className="mb-2">{t("careNavigation.meetTheTeam.title")}</SectionTitle>
      <div
        className="flex-row overflow-x-auto scrollbar-none"
        role="list"
        aria-label={t("careNavigation.meetTheTeam.title")}
      >
        {planners.map((planner) => (
          <div
            key={planner.id}
            className="items-center mr-4"
            style={{ width: CARD_WIDTH }}
            role="listitem"
            aria-label={t("careNavigation.meetTheTeam.plannerLabel", {
              name: planner.name,
              credentials: planner.credentials,
            })}
          >
            <PlannerAvatar planner={planner} />
            <span className="text-brand-primary text-xs font-medium text-center mt-1.5 line-clamp-2">
              {planner.name}
            </span>
            <span className="text-gray-500 text-[10px] text-center mt-0.5 line-clamp-2">{planner.credentials}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
