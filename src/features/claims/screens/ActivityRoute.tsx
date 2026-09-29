/**
 * Port of `app/(tabs)/activity.tsx` — 3 sub-sections: Claims, HSA/FSA, Preauthorizations.
 * Supports a `?tab=claims|hsa-fsa|preauth` deep link.
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { SpendingAccountsList } from "@/src/features/financial-accounts/screens/SpendingAccountsListScreen";
import { ClaimsListScreen } from "./ClaimsListScreen";
import { PriorAuthList } from "@/src/features/prior-auths/components/PriorAuthList";

type ActivityTab = "claims" | "hsa-fsa" | "preauth";

const VALID_TABS: readonly ActivityTab[] = ["claims", "hsa-fsa", "preauth"];

const TABS: { key: ActivityTab; labelKey: string; icon: string }[] = [
  { key: "claims", labelKey: "activity.tabClaims", icon: "document-text-outline" },
  { key: "hsa-fsa", labelKey: "activity.tabHsaFsa", icon: "cash-outline" },
  { key: "preauth", labelKey: "activity.tabPreauth", icon: "shield-checkmark-outline" },
];

/** Stand-in for `src/shared/services/tabParam.ts`. */
function parseTabParam<T extends string>(value: string | null, valid: readonly T[]): T | null {
  return value !== null && (valid as readonly string[]).includes(value) ? (value as T) : null;
}

export function ActivityRoute() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const tabParam = params.get("tab");
  const [activeTab, setActiveTab] = useState<ActivityTab>(parseTabParam(tabParam, VALID_TABS) ?? "claims");

  // Sync activeTab when the route param changes while already on this tab.
  useEffect(() => {
    const parsed = parseTabParam(tabParam, VALID_TABS);
    if (parsed) setActiveTab(parsed);
  }, [tabParam]);

  return (
    <div className="flex-1 bg-brand-background min-h-0 h-full">
      {/* Sub-tab navigation */}
      <div className="flex-row border-b border-gray-200 bg-brand-surface" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex-row items-center justify-center py-3 ${
                isActive ? "border-b-2 border-brand-accent" : ""
              }`}
              role="tab"
              aria-selected={isActive}
              aria-label={t(tab.labelKey)}
            >
              <Icon name={tab.icon} size={18} color={isActive ? colors.brand.accent : colors.neutral[500]} />
              <span className={`ml-1.5 text-sm font-medium ${isActive ? "text-brand-accent" : "text-gray-500"}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "claims" && <ClaimsListScreen />}
      {/* SpendingAccountsList belongs to the money slice of this wireframe. */}
      {activeTab === "hsa-fsa" && <SpendingAccountsList />}
      {activeTab === "preauth" && <PriorAuthList />}
    </div>
  );
}
