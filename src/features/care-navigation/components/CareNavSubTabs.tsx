import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { CARE_NAV_SUB_TABS } from "../data/resources";
import type { CareNavSubTab } from "../types";

interface CareNavSubTabsProps {
  active: CareNavSubTab;
  onSelect: (tab: CareNavSubTab) => void;
}

/** Financial / Mental Health / Clinical sub-tab bar — icon-above-label, like the main tabs. */
export function CareNavSubTabs({ active, onSelect }: CareNavSubTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-row border-b border-gray-200 bg-brand-surface" role="tablist">
      {CARE_NAV_SUB_TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            type="button"
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`flex-1 flex-col items-center justify-center py-3 ${
              isActive ? "border-b-2 border-brand-accent" : ""
            }`}
            role="tab"
            aria-selected={isActive}
            aria-label={t(tab.labelKey)}
          >
            <Icon name={tab.icon} size={20} color={isActive ? colors.brand.accent : colors.neutral[500]} />
            <span
              className={`mt-0.5 text-[10px] font-medium ${isActive ? "text-brand-accent" : "text-gray-500"} truncate`}
            >
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
