import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { useBenefitsScreen } from "../hooks/useBenefitsScreen";
import { CoverageSubTabs } from "../components/CoverageSubTabs";
import { CoverageTabPanel } from "../components/CoverageTabPanel";
import { EmptyState } from "@/src/shared/components/EmptyState";
import type { CoverageTabPanelProps } from "../components/CoverageTabPanel";
import { ProcedureCodeSearch } from "../components/ProcedureCodeSearch";
import { AssistantFab } from "../components/AssistantFab";
import { coverageSearchMode } from "../services/coverageSearchMode";
import { CareNavigationTab } from "@/src/features/care-navigation/components/CareNavigationTab";
import { CostCompareCard } from "@/src/features/cost-compare/components/CostCompareCard";
import { formatCurrency } from "../services/benefitsTransforms";
import type { BenefitsMainTab, CoverageSubTab } from "../types";

const MAIN_TABS: {
  key: BenefitsMainTab;
  labelKey: string;
  icon: string;
}[] = [
  { key: "coverage", labelKey: "benefits.coverageTab", icon: "shield-checkmark-outline" },
  { key: "estimateCosts", labelKey: "benefits.estimateCostsTab", icon: "calculator-outline" },
  { key: "codes", labelKey: "benefits.codesTab", icon: "code-slash-outline" },
  { key: "navigation", labelKey: "benefits.navigationTab", icon: "compass-outline" },
];

export interface BenefitsScreenProps {
  /** Seeds the main tab from a `?tab=` route param. */
  initialMainTab?: BenefitsMainTab;
  /** Seeds the Coverage sub-tab from a `?sub=` route param; cleared from the URL once consumed. */
  initialCoverageTab?: CoverageSubTab;
  /** The topic to land on from a `?topic=` route param. */
  initialTopicKey?: string;
}

/**
 * Benefits Screen — main tab bar (Coverage | Estimate Costs | Codes |
 * Navigation), each tab's panel, and the advisor FAB on every tab.
 */
export function BenefitsScreen({ initialMainTab, initialCoverageTab, initialTopicKey }: BenefitsScreenProps = {}) {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const {
    mainTab,
    setMainTab,
    coverageTab,
    setCoverageTab,
    targetTopicKey,
    setTargetTopicKey,
    clearTargetTopicKey,
    codeSearchInput,
    handleCodeSearchInput,
    medicalData,
    dentalData,
    pharmacyData,
    procedureCodes,
    procedureCodeTotalCount,
    procedureCodesHasNextPage,
    procedureCodesFetchNextPage,
    procedureCodesIsLoading,
    isCoverageLoading,
    isCoverageError,
    isDentalPlanMissing,
  } = useBenefitsScreen(initialMainTab, initialCoverageTab);

  useEffect(() => {
    if (initialMainTab) setMainTab(initialMainTab);
  }, [initialMainTab, setMainTab]);

  // The app consumes `?sub=`/`?topic=` (or the chat sheet's mailbox) on focus;
  // the wireframe consumes the route params when they change.
  useEffect(() => {
    if (!initialCoverageTab && !initialTopicKey) return;
    setMainTab("coverage");
    if (initialCoverageTab) setCoverageTab(initialCoverageTab);
    if (initialTopicKey) setTargetTopicKey(initialTopicKey);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("sub");
        next.delete("topic");
        return next;
      },
      { replace: true }
    );
  }, [initialCoverageTab, initialTopicKey, setMainTab, setCoverageTab, setTargetTopicKey, setSearchParams]);

  const activeData =
    coverageTab === "medical" ? medicalData : coverageTab === "dental" ? dentalData : pharmacyData;
  const activeCategories = activeData?.categories ?? [];
  const activeBasics = activeData?.basics ?? [];

  const planHeader: CoverageTabPanelProps["planHeader"] =
    coverageTab === "medical"
      ? medicalData
        ? {
            planName: medicalData.planName,
            planId: medicalData.planId,
            rows: [
              {
                label: t("benefits.inNetworkCoinsurance"),
                value:
                  medicalData.hasInNetworkDeductible === true
                    ? `${medicalData.coinsuranceInNetwork}% ${t("benefits.afterDeductible")}`
                    : medicalData.hasInNetworkDeductible === false
                      ? `${medicalData.coinsuranceInNetwork}% ${t("benefits.ofAllowable")}`
                      : `${medicalData.coinsuranceInNetwork}%`,
              },
              {
                label: t("benefits.outOfNetworkCoinsurance"),
                value:
                  medicalData.hasOutOfNetworkDeductible === true
                    ? `${medicalData.coinsuranceOutOfNetwork}% ${t("benefits.afterDeductible")}`
                    : medicalData.hasOutOfNetworkDeductible === false
                      ? `${medicalData.coinsuranceOutOfNetwork}% ${t("benefits.ofAllowable")}`
                      : `${medicalData.coinsuranceOutOfNetwork}%`,
              },
            ],
          }
        : null
      : coverageTab === "dental"
        ? dentalData
          ? {
              planName: dentalData.planName,
              planId: dentalData.planId,
              rows: [
                { label: t("benefits.annualMax"), value: formatCurrency(dentalData.annualMax) },
                { label: t("benefits.deductible"), value: formatCurrency(dentalData.deductible) },
              ],
            }
          : null
        : pharmacyData
          ? {
              planName: pharmacyData.planName,
              planId: pharmacyData.planId,
              rows: [
                { label: t("benefits.managedBy"), value: pharmacyData.pharmacyManager },
                ...(pharmacyData.pharmacyPhone
                  ? [{ label: t("benefits.pharmacyPhone"), value: pharmacyData.pharmacyPhone }]
                  : []),
              ],
            }
          : null;

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      {/* ── Main tab bar ── */}
      <div className="flex-row border-b border-gray-200 bg-brand-surface" role="tablist">
        {MAIN_TABS.map((tab) => {
          const isActive = mainTab === tab.key;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
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

      {/* ── Coverage tab ── */}
      {mainTab === "coverage" && (
        <div className="flex-1" style={{ minHeight: 0 }}>
          <CoverageSubTabs active={coverageTab} onSelect={setCoverageTab} />

          {coverageTab === "dental" && isDentalPlanMissing ? (
            <EmptyState
              icon={<Icon name="information-circle-outline" size={40} color={colors.brand.secondary} />}
              title={t("benefits.noDentalPlan.title")}
              message={t("benefits.noDentalPlan.message")}
            />
          ) : (
            <CoverageTabPanel
              key={coverageTab}
              planHeader={planHeader}
              categories={activeCategories}
              basics={activeBasics}
              disclaimer={activeData?.disclaimer}
              governingDocumentId={activeData?.governingDocumentId}
              planId={activeData?.planId}
              isLoading={isCoverageLoading}
              isError={isCoverageError}
              targetTopicKey={targetTopicKey}
              onTargetConsumed={clearTargetTopicKey}
              searchMode={coverageSearchMode(coverageTab)}
            />
          )}
        </div>
      )}

      {/* ── Codes tab ── */}
      {mainTab === "codes" && (
        <ProcedureCodeSearch
          searchInput={codeSearchInput}
          onSearchChange={handleCodeSearchInput}
          codes={procedureCodes}
          totalCount={procedureCodeTotalCount}
          hasNextPage={procedureCodesHasNextPage}
          fetchNextPage={procedureCodesFetchNextPage}
          isLoading={procedureCodesIsLoading}
        />
      )}

      {/* ── Estimate Costs tab ── */}
      {mainTab === "estimateCosts" && (
        <div className="flex-1 p-4">
          <CostCompareCard />
        </div>
      )}

      {/* ── Navigation tab ── */}
      {mainTab === "navigation" && <CareNavigationTab onShowCoverage={() => setMainTab("coverage")} />}

      {/* ── AI chat FAB (all tabs) ── */}
      <AssistantFab />
    </div>
  );
}
