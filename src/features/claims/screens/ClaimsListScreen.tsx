import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { useClaimsListScreen } from "../hooks/useClaimsList";
import { ClaimCard } from "../components/ClaimCard";
import { ClaimTypeFilter } from "../components/ClaimTypeFilter";
import { ClaimSearchBar } from "../components/ClaimSearchBar";
import { CostComparisonChart } from "../components/CostComparisonChart";
import { CoverageJourneyCard } from "../components/CoverageJourneyCard";
import { FamilyMemberDropdown } from "../components/FamilyMemberDropdown";
import { placeholderCostComparison, placeholderFamilyMembers, placeholderUser } from "../placeholder";
import { Spinner } from "@/src/shared/components/Spinner";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Label } from "@/src/shared/components/Typography";
import { FloatingActionButton } from "@/src/shared/components/FloatingActionButton";
import { colors } from "@/src/shared/theme/colors";

/**
 * Claims List Screen — UI only.
 * All data and logic comes from useClaimsListScreen hook.
 */
export function ClaimsListScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    claims,
    totalCount,
    isLoading,
    isError,
    refetch,
    isFetchingNextPage,
    claimType,
    setClaimType,
    searchInput,
    setSearchInput,
    sortBy,
    sortOrder,
    toggleSortOrder,
    toggleSortField,
    selectedMemberId,
    setSelectedMemberId,
  } = useClaimsListScreen();

  const { thisYear: costThisYear, lastYear: costLastYear, currentYear, lastYearNum } = placeholderCostComparison;
  const familyMembers = placeholderFamilyMembers;
  const user = placeholderUser;
  const selfName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || t("dashboard.self");

  const handleClaimPress = (claimId: string) => {
    navigate(`/claim/${claimId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background">
        <Spinner size="large" />
        <Label className="mt-2">{t("common.loading")}</Label>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background">
        <EmptyState
          icon={<Icon name="alert-circle-outline" size={48} color={colors.error} />}
          title={t("common.error")}
          message={t("claims.loadError")}
          action={{ label: t("common.retry"), onPress: refetch }}
        />
      </div>
    );
  }

  const sortIcon = sortOrder === "desc" ? "arrow-down-outline" : "arrow-up-outline";
  const sortLabel = sortBy === "date" ? t("claims.sortByDate") : t("claims.sortByAmount");

  return (
    <div className="flex-1 bg-brand-background min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div style={{ paddingBottom: 96 }}>
          <div className="pt-4">
            {/* Your Coverage Journey — deductible/OOP status, default collapsed */}
            <div className="px-4">
              <CoverageJourneyCard selectedMember={selectedMemberId} />
            </div>

            {/* Cost Comparison Chart */}
            <div className="px-4 mb-3">
              <CostComparisonChart
                thisYear={costThisYear}
                lastYear={costLastYear}
                currentYear={currentYear}
                lastYearNum={lastYearNum}
              />
            </div>

            <ClaimSearchBar value={searchInput} onChangeText={setSearchInput} />

            {/* Family member filter — only rendered when the member has dependents */}
            {familyMembers.length > 0 && (
              <div className="px-4 mb-1">
                <FamilyMemberDropdown
                  familyMembers={familyMembers}
                  selectedMemberId={selectedMemberId}
                  onSelect={setSelectedMemberId}
                  selfName={selfName}
                />
              </div>
            )}

            <ClaimTypeFilter selected={claimType} onSelect={setClaimType} />

            {/* Sort controls + count */}
            <div className="flex-row items-center justify-between px-4 mb-3">
              <Label>{t("claims.countLabel", { count: claims.length, total: totalCount })}</Label>
              <div className="flex-row items-center">
                <button
                  type="button"
                  onClick={toggleSortField}
                  style={{ marginRight: 8 }}
                  aria-label={t("claims.changeSortField")}
                >
                  <span className="text-sm font-medium text-brand-accent">{sortLabel}</span>
                </button>
                <button type="button" onClick={toggleSortOrder} aria-label={t("claims.changeSortOrder")}>
                  <Icon name={sortIcon} size={18} color={colors.brand.accent} />
                </button>
              </div>
            </div>
          </div>

          {claims.map((item) => (
            <ClaimCard key={item.id} claim={item} onPress={handleClaimPress} />
          ))}

          {claims.length === 0 && (
            <div className="py-4">
              <EmptyState
                icon={<Icon name="document-text-outline" size={48} color={colors.neutral[500]} />}
                title={t("common.noResults")}
              />
            </div>
          )}

          {isFetchingNextPage ? (
            <div className="py-4 items-center">
              <Spinner size="small" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Floating "submit a claim" action — shared `FloatingActionButton`. */}
      <FloatingActionButton
        icon="add"
        iconSize={28}
        onPress={() => navigate("/submit-claim")}
        accessibilityLabel={t("claims.submitClaim")}
        accessibilityHint={t("claims.submitClaimHint")}
      />
    </div>
  );
}
