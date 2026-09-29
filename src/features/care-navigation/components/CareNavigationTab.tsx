import { useState } from "react";
import { CareNavSubTabs } from "./CareNavSubTabs";
import { FinancialPlanningTab } from "./FinancialPlanningTab";
import { MentalHealthTab } from "./MentalHealthTab";
import { ClinicalTab } from "./ClinicalTab";
import type { CareNavSubTab } from "../types";

interface CareNavigationTabProps {
  /** Switches BenefitsScreen to the Coverage main tab (ADR-141 #3). */
  onShowCoverage: () => void;
}

/** Entry point for Benefits > Navigation. Owns the sub-tab state locally. */
export function CareNavigationTab({ onShowCoverage }: CareNavigationTabProps) {
  const [subTab, setSubTab] = useState<CareNavSubTab>("financial");

  const renderPane = () => {
    switch (subTab) {
      case "financial":
        return <FinancialPlanningTab />;
      case "mentalHealth":
        return <MentalHealthTab onShowCoverage={onShowCoverage} />;
      case "clinical":
        return <ClinicalTab />;
      default: {
        const exhaustive: never = subTab;
        return exhaustive;
      }
    }
  };

  return (
    <div className="flex-1" style={{ minHeight: 0 }}>
      <CareNavSubTabs active={subTab} onSelect={setSubTab} />
      {renderPane()}
    </div>
  );
}
