import { useTranslation } from "@/src/shared/i18n";
import { Asterisk } from "lucide-react";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import type { SearchTab } from "../types";

interface SearchTabBarProps {
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
}

const TAB_CONFIG: { key: SearchTab; icon: string }[] = [
  { key: "providers", icon: "medical-outline" },
  { key: "facilities", icon: "business-outline" },
  { key: "pharmacies", icon: "storefront-outline" },
];

export function SearchTabBar({ activeTab, onTabChange }: SearchTabBarProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-brand-surface border-b border-gray-100">
      <div className="flex-row" role="tablist">
        {TAB_CONFIG.map(({ key, icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              type="button"
              key={key}
              onClick={() => onTabChange(key)}
              className="flex-1 items-center pt-2 pb-2.5"
              role="tab"
              aria-selected={isActive}
              aria-label={t(`search.tabs.${key}`)}
            >
              {/* Ionicons "medical" is an asterisk; the shared map renders a stethoscope. */}
              {icon === "medical-outline" ? (
                <Asterisk size={22} color={isActive ? colors.searchSlate.light : colors.neutral[500]} aria-hidden="true" />
              ) : (
                <Icon name={icon} size={22} color={isActive ? colors.searchSlate.light : colors.neutral[500]} />
              )}
              <span className={`text-xs mt-1 ${isActive ? "text-brand-primary font-semibold" : "text-gray-500"}`}>
                {t(`search.tabs.${key}`)}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ backgroundColor: colors.searchSlate.light }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
