import { useCallback, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import {
  usePlanYears,
  useFinancialSummary,
  useFsaAccount,
  useLpfsaAccount,
  useDepcAccount,
} from "../api/accountsQueries";
import { formatPlanYearLabel } from "../services/accountTransforms";
import { planYearLabel } from "../services/planYearStatus";
import { ActivityFeed } from "../components/ActivityFeed";

/**
 * Every account's claims and payments, for one plan year, unfiltered — the one
 * place a row whose vendor code maps to no known account still appears.
 */
export function SpendingActivityScreen() {
  const { t } = useTranslation();
  const [selectedPlanYear, setSelectedPlanYear] = useState(0);

  const planYearsQuery = usePlanYears();
  const planYears = planYearsQuery.data ?? [];

  const selectedPlanYearInfo = planYears.find((year) => year.planYear === selectedPlanYear) ?? null;
  const needsCurrentWindow = selectedPlanYear === 0;

  const summaryQuery = useFinancialSummary({ planYear: selectedPlanYear });
  const summary = summaryQuery.data;
  const fsaEnabled = needsCurrentWindow && Boolean(summary?.fsa);
  const lpfsaEnabled = needsCurrentWindow && !fsaEnabled && Boolean(summary?.lpfsa);
  const depcEnabled = needsCurrentWindow && !fsaEnabled && !lpfsaEnabled && Boolean(summary?.depc);

  const fsaQuery = useFsaAccount({ enabled: fsaEnabled, planYear: selectedPlanYear });
  const lpfsaQuery = useLpfsaAccount({ enabled: lpfsaEnabled, planYear: selectedPlanYear });
  const depcQuery = useDepcAccount({ enabled: depcEnabled, planYear: selectedPlanYear });

  const planYearWindow = selectedPlanYearInfo ?? fsaQuery.data ?? lpfsaQuery.data ?? depcQuery.data;
  const rowPlanYear = planYearWindow ? planYearLabel(planYearWindow) : "";

  const isOnBehalf = Boolean(summary?.onBehalf?.spendingAccounts);

  const handlePlanYearChange = useCallback((planYear: number) => {
    setSelectedPlanYear(planYear);
  }, []);

  return (
    <div className="flex-1 bg-brand-background h-full" style={{ minHeight: 0 }}>
      <ScreenHeader title={t("financialAccounts.activity.allTitle")} />

      {!isOnBehalf && planYears.length > 0 && (
        <div className="mx-4 mt-4 mb-1">
          <span className="text-xs text-gray-500 mb-1.5">{t("financialAccounts.planYear.selectorLabel")}</span>
          <div className="flex-row scrollbar-none" style={{ overflowX: "auto", paddingRight: 8 }} role="tablist">
            <PlanYearChip
              label={t("financialAccounts.planYear.current")}
              isActive={selectedPlanYear === 0}
              onPress={() => handlePlanYearChange(0)}
            />
            {planYears.map((year) => (
              <PlanYearChip
                key={year.planYear}
                label={formatPlanYearLabel(year)}
                isActive={selectedPlanYear === year.planYear}
                onPress={() => handlePlanYearChange(year.planYear)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1" style={{ minHeight: 0 }}>
        {isOnBehalf ? (
          <div className="flex-1 justify-center px-6">
            <EmptyState
              icon={<Icon name="lock-closed-outline" size={40} color={colors.neutral[500]} />}
              title={t("financialAccounts.onBehalfBalancesOnly")}
            />
          </div>
        ) : (
          <ActivityFeed accountType={null} planYear={selectedPlanYear} planYearLabel={rowPlanYear} isOnBehalf={isOnBehalf} />
        )}
      </div>
    </div>
  );
}

interface PlanYearChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function PlanYearChip({ label, isActive, onPress }: PlanYearChipProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="active:opacity-70"
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 6,
        paddingBottom: 6,
        marginRight: 8,
        borderRadius: 999,
        borderWidth: 1,
        backgroundColor: isActive ? colors.brand.accent : withAlpha(colors.brand.surface, 0.7),
        borderColor: isActive ? colors.brand.accent : colors.border,
      }}
      role="tab"
      aria-label={label}
      aria-selected={isActive}
    >
      <span style={{ fontSize: 14, fontWeight: "500", whiteSpace: "nowrap", color: isActive ? colors.brand.surface : colors.neutral[700] }}>
        {label}
      </span>
    </button>
  );
}
