import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import type { CoverageSubTab } from "../types";

const COVERAGE_TABS: {
  key: CoverageSubTab;
  labelKey: string;
  icon: string;
}[] = [
  { key: "medical", labelKey: "benefits.medicalTab", icon: "medkit-outline" },
  { key: "dental", labelKey: "benefits.dentalTab", icon: "happy-outline" },
  { key: "pharmacy", labelKey: "benefits.pharmacyTab", icon: "medical-outline" },
];

interface CoverageSubTabsProps {
  active: CoverageSubTab;
  onSelect: (tab: CoverageSubTab) => void;
}

/**
 * Medical / Dental / Prescription sub-tab bar.
 * Three tabs in a simple flex row — no scroll needed.
 */
export function CoverageSubTabs({ active, onSelect }: CoverageSubTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-row bg-brand-surface border-b border-gray-200" role="tablist">
      {COVERAGE_TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            type="button"
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`flex-1 flex-row items-center justify-center px-3 py-2 ${
              isActive ? "border-b-2 border-brand-accent" : ""
            }`}
            role="tab"
            aria-selected={isActive}
            aria-label={t(tab.labelKey)}
          >
            <Icon name={tab.icon} size={16} color={isActive ? colors.brand.accent : colors.neutral[500]} />
            <span className={`ml-1.5 text-sm font-medium ${isActive ? "text-brand-accent" : "text-gray-500"}`}>
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
