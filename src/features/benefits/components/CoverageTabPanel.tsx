import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { Spinner } from "@/src/shared/components/Spinner";
import { Label, Caption } from "@/src/shared/components/Typography";
import { Button } from "@/src/shared/components/Button";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { useToast } from "@/src/shared/components/Toast";
import { colors } from "@/src/shared/theme/colors";
import { useMedicationSearch } from "@/src/features/medications/hooks/useMedicationSearch";
import { MedicationResultsList } from "@/src/features/medications/components/MedicationResultsList";
import { BenefitCategorySection } from "./BenefitCategorySection";
import { PlanBasicsSection } from "./PlanBasicsSection";
import {
  filterBasicsBySearch,
  filterBenefitsByPreauth,
  filterBenefitsBySearch,
  hasAnyPreauthBenefit,
} from "../services/benefitsTransforms";
import { findGroupForTopic } from "../services/benefitsTarget";
import type { CoverageSearchMode } from "../services/coverageSearchMode";
import type { BenefitCategoryGroup, BenefitTopicSummary } from "../types";

export interface CoverageTabPanelProps {
  planHeader: { planName: string; planId?: string; rows: { label: string; value: string }[] } | null;
  categories: BenefitCategoryGroup[];
  /** Concept and prose-only topics for the "Plan basics" section at the top. */
  basics: BenefitTopicSummary[];
  /** The standing SPD disclaimer — rendered on the Overall Coverage card. */
  disclaimer: string | undefined;
  /** Null/undefined hides the "Governing document" button. */
  governingDocumentId: string | null | undefined;
  /** The plan the rows belong to — passed to every lazy topic read. */
  planId: string | undefined;
  isLoading: boolean;
  isError: boolean;
  /** A citation/deep-link target: the panel force-expands its group and card. */
  targetTopicKey: string | undefined;
  onTargetConsumed: () => void;
  /** What this sub-tab's one search box searches — topics, or medications on Pharmacy. */
  searchMode?: CoverageSearchMode;
}

/**
 * Content for one coverage sub-tab: search bar + "Needs prior approval"
 * chip, the Overall Coverage card, the Plan basics section, and the
 * scrollable benefit groups. On Pharmacy the same box searches the drug
 * reference, and from two typed characters its results replace the topics.
 */
export function CoverageTabPanel({
  planHeader,
  categories,
  basics,
  disclaimer,
  governingDocumentId,
  planId,
  isLoading,
  isError,
  targetTopicKey,
  onTargetConsumed,
  searchMode = "topics",
}: CoverageTabPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  // The app debounces this (useDebouncedSearch); the wireframe filters on every keystroke.
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = searchInput;
  const clear = useCallback(() => setSearchInput(""), []);
  const medicationSearch = useMedicationSearch();
  const isMedicationMode = searchMode === "medications";
  const showMedicationResults = isMedicationMode && medicationSearch.showResults;
  const [preauthOnly, setPreauthOnly] = useState(false);
  const [isDownloadingDocument, setIsDownloadingDocument] = useState(false);

  const [activeTarget, setActiveTarget] = useState<string | undefined>(undefined);
  const [targetSeq, setTargetSeq] = useState(0);

  const location = useMemo(
    () => findGroupForTopic(categories, basics, activeTarget),
    [categories, basics, activeTarget]
  );

  const resetMedicationSearch = medicationSearch.handleReset;
  useEffect(() => {
    if (!targetTopicKey) return;
    clear();
    resetMedicationSearch();
    setPreauthOnly(false);
    setActiveTarget(targetTopicKey);
    setTargetSeq((seq) => seq + 1);
    onTargetConsumed();
  }, [targetTopicKey, clear, resetMedicationSearch, onTargetConsumed]);

  const topicSearchQuery = isMedicationMode ? "" : searchQuery;

  const filteredCategories = useMemo(
    () => filterBenefitsByPreauth(filterBenefitsBySearch(categories, topicSearchQuery), preauthOnly),
    [categories, topicSearchQuery, preauthOnly]
  );
  const filteredBasics = useMemo(
    () => (preauthOnly ? [] : filterBasicsBySearch(basics, topicSearchQuery)),
    [basics, topicSearchQuery, preauthOnly]
  );

  // The app downloads the SPD PDF and opens the share sheet; the wireframe
  // has no document store, so it shows a toast after a short spinner.
  const handleDownloadGoverningDocument = useCallback(() => {
    if (!governingDocumentId || !planHeader || isDownloadingDocument) return;
    setIsDownloadingDocument(true);
    setTimeout(() => {
      setIsDownloadingDocument(false);
      toast.show(t("common.hints.opensShareSheet"));
    }, 600);
  }, [governingDocumentId, planHeader, isDownloadingDocument, t, toast]);

  const canFilterByPreauth = useMemo(() => hasAnyPreauthBenefit(categories), [categories]);

  const hasResults = filteredCategories.length > 0 || filteredBasics.length > 0;

  return (
    <div className="flex-1" style={{ minHeight: 0 }}>
      {/* Search row */}
      <div className="mx-4 mt-2 mb-2">
        <SearchBar
          value={isMedicationMode ? medicationSearch.searchInput : searchInput}
          onChangeText={isMedicationMode ? medicationSearch.handleSearchInput : setSearchInput}
          placeholder={isMedicationMode ? t("search.medications.searchPlaceholder") : t("benefits.searchBenefits")}
          onClear={isMedicationMode ? medicationSearch.handleReset : clear}
        />
        {/* The way back to the medicine cabinet (on Profile) from where a member looks a drug up. */}
        {isMedicationMode && (
          <button
            type="button"
            onClick={() => navigate("/profile?tab=medicine-cabinet")}
            style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: 10 }}
            aria-label={t("search.myMedicineCabinet")}
          >
            <Icon name="medkit-outline" size={16} color={colors.brand.accent} />
            <span style={{ marginLeft: 6, color: colors.brand.accent, fontSize: 14, fontWeight: 600 }}>
              {t("search.myMedicineCabinet")}
            </span>
          </button>
        )}
        {canFilterByPreauth && !showMedicationResults && (
          <div className="flex-row mt-2">
            <button
              type="button"
              onClick={() => setPreauthOnly((prev) => !prev)}
              className={`flex-row items-center px-4 py-2 rounded-full min-h-11 ${
                preauthOnly ? "bg-brand-accent" : "bg-brand-surface border border-gray-200"
              }`}
              aria-label={t("benefits.needsPriorApproval")}
              aria-pressed={preauthOnly}
            >
              <Icon
                name={preauthOnly ? "checkmark-circle" : "shield-checkmark-outline"}
                size={16}
                color={preauthOnly ? colors.brand.surface : colors.brand.secondary}
              />
              <span className={`ml-1.5 text-sm font-medium ${preauthOnly ? "text-white" : "text-gray-700"}`}>
                {t("benefits.needsPriorApproval")}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Medication results */}
      {showMedicationResults && (
        <MedicationResultsList
          medications={medicationSearch.medications}
          hasNextPage={medicationSearch.hasNextPage}
          fetchNextPage={medicationSearch.fetchNextPage}
          isLoading={medicationSearch.isLoading}
          isFetching={medicationSearch.isFetching}
          isError={medicationSearch.isError}
        />
      )}

      {/* Loading state */}
      {!showMedicationResults && isLoading && (
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" tone="accent" />
          <Label className="mt-2">{t("common.loading")}</Label>
        </div>
      )}

      {/* Error state */}
      {!showMedicationResults && isError && !isLoading && (
        <div className="flex-1 items-center justify-center px-6">
          <InlineErrorState message={t("common.error")} />
        </div>
      )}

      {/* Overall Coverage card + Plan basics + benefit groups */}
      {!showMedicationResults && !isLoading && !isError && (
        <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0 }}>
          <div style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 80 }}>
            {planHeader && (
              <div className="mb-3 bg-info-tint rounded-xl px-4 py-3">
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wide mb-2">
                  {t("benefits.overallCoverage")}
                </span>
                <OverallCoverageRows planName={planHeader.planName} rows={planHeader.rows} />
                {disclaimer ? <Caption className="mt-2">{disclaimer}</Caption> : null}
                {governingDocumentId && (
                  <Button
                    variant="secondary"
                    size="sm"
                    label={t("benefits.governingDocument")}
                    onPress={() => void handleDownloadGoverningDocument()}
                    loading={isDownloadingDocument}
                    accessibilityHint={t("common.hints.opensShareSheet")}
                    className="self-start mt-2"
                  />
                )}
              </div>
            )}

            {hasResults ? (
              <>
                <PlanBasicsSection
                  basics={filteredBasics}
                  planId={planId}
                  forceExpanded={location?.kind === "basic"}
                  targetTopicKey={activeTarget}
                  targetSeq={targetSeq}
                />
                {filteredCategories.map((cat) => (
                  <BenefitCategorySection
                    key={cat.category}
                    data={cat}
                    planId={planId}
                    forceExpanded={location?.kind === "benefit" && location.group === cat.category}
                    targetTopicKey={activeTarget}
                    targetSeq={targetSeq}
                  />
                ))}
              </>
            ) : (
              <div className="items-center justify-center py-16">
                <EmptyState
                  icon={<Icon name="search-outline" size={48} color={colors.neutral[500]} />}
                  title={t("benefits.noResults")}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Plan name and label/value rows; a row with an empty value is omitted. */
function OverallCoverageRows({ planName, rows }: { planName: string; rows: { label: string; value: string }[] }) {
  return (
    <>
      <span className="text-sm font-semibold text-brand-primary mb-1">{planName}</span>
      {rows.map((row) =>
        row.value ? (
          <div key={row.label} className="flex-row justify-between mb-0.5">
            <span className="text-xs text-gray-500 flex-1">{row.label}</span>
            <span className="text-xs text-brand-primary font-medium ml-2 text-right">{row.value}</span>
          </div>
        ) : null
      )}
    </>
  );
}
