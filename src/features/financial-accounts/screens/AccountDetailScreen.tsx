import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { InfoRow } from "@/src/shared/components/InfoRow";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import {
  useHsaAccount,
  useFsaAccount,
  useLpfsaAccount,
  useDepcAccount,
  useAccountTransactions,
  useAccountActivity,
} from "../api/accountsQueries";
import { formatCurrency, formatTransactionDate } from "../services/accountTransforms";
import {
  accountDisplayName,
  claimFilingDeadline,
  isOpenEndedWindow,
  planYearStatus,
  planYearStatusMessageKey,
  type PlanYearDates,
  type PlanYearStatus,
} from "../services/planYearStatus";
import { type SpendingAccountType } from "../services/accountList";
import { hsaContributionDisplay } from "../components/cardServices";
import { localToday } from "../services/today";
import { PlanYearStatusBanner } from "../components/PlanYearStatusBanner";
import { PlanYearBadge } from "../components/PlanYearBadge";
import { AccountEntryRow } from "../components/AccountEntryRow";
import { AccountExtrasSection } from "../components/AccountExtrasSection";
import { EntryPointRow } from "../components/EntryPointRow";
import {
  activityToEntry,
  entriesForAccountFeed,
  filterEntries,
  mergeAccountEntries,
  transactionToEntry,
  type AccountEntry,
  type EntryStatusTone,
} from "../services/accountEntries";
import type { TransactionStatus, HsaAccount, FsaAccount } from "../types";

export { toSpendingAccountType, type SpendingAccountType } from "../services/accountList";

const ACCOUNT_NAME_KEY: Record<SpendingAccountType, string> = {
  hsa: "financialAccounts.hsa.title",
  fsa: "financialAccounts.fsa.title",
  lpfsa: "financialAccounts.lpfsa.title",
  depc: "financialAccounts.depc.title",
};

type StatusFilter = TransactionStatus | "all";

const STATUS_FILTERS: StatusFilter[] = ["all", "Approved", "Pending", "Denied"];

const STATUS_FILTER_TONE: Record<TransactionStatus, EntryStatusTone> = {
  Approved: "approved",
  Pending: "pending",
  Denied: "denied",
};

const EMPTY_TRANSACTION_FILTERS = {};

const STATUS_FILTER_LABEL_KEY: Record<StatusFilter, string> = {
  all: "financialAccounts.transactions.all",
  Approved: "financialAccounts.transactions.approved",
  Pending: "financialAccounts.transactions.pending",
  Denied: "financialAccounts.transactions.denied",
};

type LoadedAccount = { kind: "hsa"; account: HsaAccount } | { kind: "fsa"; account: FsaAccount };

interface AccountDetailScreenProps {
  type: SpendingAccountType;
  /** Plan-year index — 0 (the default) is the current plan year. */
  planYear: number;
}

/**
 * One account, as a container: the plan year is part of the account's identity
 * ("FSA Account 2024" in the header), and everything below belongs to it —
 * balances, dates, search, filters and the merged claims-and-payments list.
 */
export function AccountDetailScreen({ type, planYear }: AccountDetailScreenProps) {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    []
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchInput(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 300);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const hsaQuery = useHsaAccount({ enabled: type === "hsa", planYear });
  const fsaQuery = useFsaAccount({ enabled: type === "fsa", planYear });
  const lpfsaQuery = useLpfsaAccount({ enabled: type === "lpfsa", planYear });
  const depcQuery = useDepcAccount({ enabled: type === "depc", planYear });

  const accountQuery = type === "hsa" ? hsaQuery : type === "fsa" ? fsaQuery : type === "lpfsa" ? lpfsaQuery : depcQuery;

  const fsaFamilyData = type === "fsa" ? fsaQuery.data : type === "lpfsa" ? lpfsaQuery.data : depcQuery.data;

  const loaded: LoadedAccount | null =
    type === "hsa"
      ? hsaQuery.data
        ? { kind: "hsa", account: hsaQuery.data }
        : null
      : fsaFamilyData
        ? { kind: "fsa", account: fsaFamilyData }
        : null;

  const dates: PlanYearDates | null = loaded?.account ?? null;

  const today = localToday();
  const status: PlanYearStatus = dates ? planYearStatus(dates, today) : "lifetime";
  const baseName = t(ACCOUNT_NAME_KEY[type]);
  const title = dates ? accountDisplayName(baseName, dates) : baseName;

  const onBehalfOfName = loaded?.account.onBehalfOfName;
  const isOnBehalf = Boolean(onBehalfOfName);

  const {
    data: transactionPages,
    isLoading: transactionsLoading,
    isError: transactionsError,
    refetch: refetchTransactions,
    hasNextPage: hasMoreTransactions,
    isFetchingNextPage: fetchingMoreTransactions,
  } = useAccountTransactions(type, EMPTY_TRANSACTION_FILTERS, { planYear, enabled: !isOnBehalf });

  const {
    data: activityPages,
    isLoading: activityLoading,
    isError: activityError,
    refetch: refetchActivity,
    hasNextPage: hasMoreActivity,
    isFetchingNextPage: fetchingMoreActivity,
  } = useAccountActivity({ planYear, enabled: !isOnBehalf });

  const transactionEntries = useMemo(
    () => (transactionPages?.pages.flatMap((page) => page.items) ?? []).map((tx, index) => transactionToEntry(tx, type, index)),
    [transactionPages, type]
  );

  const receiptsUnavailable = activityPages?.pages.some((page) => page.unavailable?.includes("receipts")) ?? false;

  const activityEntries = useMemo(
    () =>
      entriesForAccountFeed(
        (activityPages?.pages.flatMap((page) => page.items) ?? []).map((item, index) => activityToEntry(item, index)),
        type
      ),
    [activityPages, type]
  );

  const merged = useMemo(
    () =>
      mergeAccountEntries(
        { entries: transactionEntries, hasMore: hasMoreTransactions ?? false },
        { entries: activityEntries, hasMore: hasMoreActivity ?? false }
      ),
    [transactionEntries, activityEntries, hasMoreTransactions, hasMoreActivity]
  );

  const entries = useMemo(
    () =>
      filterEntries(merged.entries, {
        search: debouncedSearch,
        tone: selectedStatus === "all" ? null : STATUS_FILTER_TONE[selectedStatus],
      }),
    [merged.entries, debouncedSearch, selectedStatus]
  );

  const fetchingMore = fetchingMoreTransactions || fetchingMoreActivity;

  const handleRetry = useCallback(() => {
    if (transactionsError) refetchTransactions();
    if (activityError) refetchActivity();
  }, [transactionsError, activityError, refetchTransactions, refetchActivity]);

  if (accountQuery.isLoading) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <ScreenHeader title={baseName} />
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" tone="accent" />
          <span className="mt-2 text-gray-500">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (accountQuery.isError || loaded === null) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <ScreenHeader title={baseName} />
        <div className="flex-1 items-center justify-center px-6">
          <span aria-hidden="true" style={{ display: "flex" }}>
            <Icon name="alert-circle-outline" size={48} color={colors.error} />
          </span>
          <span className="text-base text-center mt-3 mb-4" style={{ color: colors.error }}>
            {t("financialAccounts.accountDetail.loadError")}
          </span>
          <RetryButton
            onPress={() => {
              accountQuery.refetch();
            }}
          />
        </div>
      </div>
    );
  }

  const data = isOnBehalf ? [] : entries;

  return (
    <div className="flex-1 bg-brand-background h-full" style={{ minHeight: 0 }}>
      <ScreenHeader title={title} rightElement={<PlanYearBadge status={status} />} />

      <div className="flex-1 scrollbar-none" style={{ minHeight: 0, overflowY: "auto" }}>
        <div style={{ paddingBottom: 24 }}>
          <AccountHeader
            type={type}
            loaded={loaded}
            today={today}
            status={status}
            searchInput={searchInput}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onBehalfOfName={onBehalfOfName}
          />

          {data.length === 0 ? (
            isOnBehalf ? (
              <OnBehalfBalancesOnlyNote />
            ) : (
              <TransactionsEmptyState
                isLoading={transactionsLoading || activityLoading}
                isError={transactionsError || activityError}
                isFiltered={debouncedSearch.trim() !== "" || selectedStatus !== "all"}
                status={status}
                onRetry={handleRetry}
              />
            )
          ) : (
            data.map((item: AccountEntry) => (
              <AccountEntryRow key={item.key} entry={item} accountLabel={null} isOnBehalf={isOnBehalf} />
            ))
          )}

          {isOnBehalf ? null : (
            <>
              {receiptsUnavailable && (
                <span className="text-gray-500 text-xs text-center px-6 py-3">
                  {t("financialAccounts.activity.receiptsUnavailable")}
                </span>
              )}
              {fetchingMore ? (
                <div className="py-4 items-center">
                  <Spinner size="small" tone="accent" />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header — banner, balances, key dates, search and status filters
// ---------------------------------------------------------------------------

interface AccountHeaderProps {
  type: SpendingAccountType;
  loaded: LoadedAccount;
  today: string;
  status: PlanYearStatus;
  searchInput: string;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onBehalfOfName?: string;
}

function AccountHeader({
  type,
  loaded,
  today,
  status,
  searchInput,
  onSearchChange,
  onSearchClear,
  selectedStatus,
  onStatusChange,
  onBehalfOfName,
}: AccountHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Spending-account claim submission (FA-4). Not "/claim" — that route is medical claims.
  const handleSubmitClaimPress = useCallback(() => {
    navigate("/spending-claim");
  }, [navigate]);

  const hasBanner = planYearStatusMessageKey(status) !== null;

  return (
    <div>
      {onBehalfOfName && (
        <div className="mx-4 mt-4">
          <span className="text-xs text-gray-500">{t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName })}</span>
        </div>
      )}
      {hasBanner && (
        <div className="mx-4 mt-4">
          <PlanYearStatusBanner dates={loaded.account} today={today} />
        </div>
      )}

      {loaded.kind === "hsa" ? (
        <HsaBalanceSummary account={loaded.account} />
      ) : (
        <FsaBalanceSummary type={type} account={loaded.account} />
      )}

      <AccountDatesCard dates={loaded.account} />

      {/* FSA-family only — an HSA distribution is not a claim. Hidden on-behalf (ADR-156). */}
      {type !== "hsa" && !onBehalfOfName && (
        <EntryPointRow
          icon="receipt-outline"
          label={t("spendingClaims.entryPoint")}
          hint={t("spendingClaims.entryPointHint")}
          onPress={handleSubmitClaimPress}
        />
      )}

      {/* Expenses, reimbursements and HSA payments (v0.8.9, ADR-120) — read-only. */}
      <AccountExtrasSection type={type} isOnBehalf={Boolean(onBehalfOfName)} />

      {!onBehalfOfName && (
        <>
          <div className="mx-4 mt-3 mb-3 flex-row items-center bg-brand-surface rounded-2xl px-3 py-3.5 shadow-sm border border-gray-100">
            <span aria-hidden="true" style={{ display: "flex" }}>
              <Icon name="search-outline" size={20} color={colors.neutral[500]} />
            </span>
            <input
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("financialAccounts.transactions.searchPlaceholder")}
              className="flex-1 ml-2 text-base text-brand-primary"
              autoCapitalize="none"
              autoCorrect="off"
              enterKeyHint="search"
              type="search"
              aria-label={t("financialAccounts.transactions.searchPlaceholder")}
            />
            {searchInput.length > 0 && (
              <button
                type="button"
                onClick={onSearchClear}
                className="active:opacity-60"
                style={{ padding: 4 }}
                aria-label={t("search.clearSearch")}
              >
                <Icon name="close-circle" size={18} color={colors.neutral[500]} />
              </button>
            )}
          </div>

          <div
            className="flex-row scrollbar-none"
            style={{ overflowX: "auto", paddingLeft: 16, paddingRight: 16, paddingBottom: 12 }}
            role="tablist"
          >
            {STATUS_FILTERS.map((filter) => {
              const isActive = selectedStatus === filter;
              const label = t(STATUS_FILTER_LABEL_KEY[filter]);
              return (
                <button
                  type="button"
                  key={filter}
                  onClick={() => onStatusChange(filter)}
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
            })}
          </div>
        </>
      )}
    </div>
  );
}

function HsaBalanceSummary({ account }: { account: HsaAccount }) {
  const { t } = useTranslation();

  // Shared with `HsaCard` so the dashboard and this screen cannot state different limits.
  const labels = hsaContributionDisplay(account, formatCurrency);

  return (
    <>
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden bg-success">
        <div className="px-5 pt-5 pb-4">
          <span className="text-white text-sm font-medium mb-1">{t("financialAccounts.hsa.availableToSpend")}</span>
          <span className="text-white text-3xl font-bold mb-4">{formatCurrency(account.cashBalance)}</span>
          <div className="flex-row gap-3">
            {account.investmentBalance !== null && (
              <BalanceTile label={t("financialAccounts.hsa.investmentBalance")} value={formatCurrency(account.investmentBalance)} />
            )}
            <BalanceTile
              label={t("financialAccounts.hsa.totalBalance")}
              value={formatCurrency(account.totalHsaBalance ?? account.totalBalance)}
            />
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3 bg-brand-surface rounded-2xl px-4 shadow-sm">
        <SummaryRow label={t(labels.contributions.key, labels.contributions.params)} value={formatCurrency(account.ytdContributions)} />
        <SummaryRow divider label={t("financialAccounts.hsa.employerContributions")} value={formatCurrency(account.employerContributions)} />
        <SummaryRow divider label={t("financialAccounts.details.additionalDeposits")} value={formatCurrency(account.additionalDeposits)} />
        {account.limitsUnavailable && (
          <SummaryRow divider label={t("financialAccounts.hsa.annualLimit")} value={t("common.unavailableValue")} />
        )}
        {labels.limit !== null && account.annualLimit !== null && (
          <SummaryRow divider label={t(labels.limit.key, labels.limit.params)} value={formatCurrency(account.annualLimit)} />
        )}
      </div>

      {(labels.coverageTier !== null || labels.catchUp !== null) && (
        <div className="mx-4 mt-2">
          {labels.coverageTier !== null && <span className="text-xs text-gray-500">{t(labels.coverageTier.key)}</span>}
          {labels.catchUp !== null && (
            <span className="text-xs text-gray-500 mt-1">{t(labels.catchUp.key, labels.catchUp.params)}</span>
          )}
        </div>
      )}
    </>
  );
}

function FsaBalanceSummary({ type, account }: { type: SpendingAccountType; account: FsaAccount }) {
  const { t } = useTranslation();

  const isDepc = type === "depc";
  const headlineLabel = isDepc ? t("financialAccounts.depc.availableToSpend") : t("financialAccounts.fsa.balance");
  const headlineValue = isDepc ? account.remainingBalance : account.balance;
  const electionLabel = isDepc ? t("financialAccounts.depc.elected") : t("financialAccounts.fsa.annualElection");

  return (
    <>
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden bg-success">
        <div className="px-5 pt-5 pb-4">
          <span className="text-white text-sm font-medium mb-1">{headlineLabel}</span>
          <span className="text-white text-3xl font-bold mb-4">{formatCurrency(headlineValue)}</span>
          <div className="flex-row gap-3">
            <BalanceTile label={electionLabel} value={formatCurrency(account.annualElection)} />
            <BalanceTile label={t("financialAccounts.fsa.remaining")} value={formatCurrency(account.remainingBalance)} />
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3 bg-brand-surface rounded-2xl px-4 shadow-sm">
        <SummaryRow
          label={isDepc ? t("financialAccounts.depc.reimbursedToDate") : t("financialAccounts.fsa.ytdDisbursements")}
          value={formatCurrency(account.ytdDisbursements)}
        />
        <SummaryRow divider label={t("financialAccounts.details.contributions")} value={formatCurrency(account.ytdContributions)} />
        <SummaryRow divider label={t("financialAccounts.details.additionalDeposits")} value={formatCurrency(account.additionalDeposits)} />
      </div>
    </>
  );
}

function BalanceTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 bg-white/20 rounded-xl px-3 py-2">
      <span className="text-white text-xs mb-0.5">{label}</span>
      <span className="text-white font-semibold text-sm">{value}</span>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  divider?: boolean;
}

function SummaryRow({ label, value, divider = false }: SummaryRowProps) {
  return (
    <div className={`flex-row justify-between items-center py-3 ${divider ? "border-t border-gray-100" : ""}`}>
      <span className="text-xs text-gray-500 flex-1 mr-3">{label}</span>
      <span className="text-sm font-medium text-brand-primary">{value}</span>
    </div>
  );
}

/**
 * The account's dates. "Last day to spend" and "last day to submit claims" are
 * separate rows on purpose. An open-ended (HSA) window gets the lifetime note.
 */
function AccountDatesCard({ dates }: { dates: PlanYearDates }) {
  const { t } = useTranslation();

  const start = dates.planStartDate;
  const end = dates.planEndDate;

  if (isOpenEndedWindow(dates) || !start || !end) {
    return (
      <div className="mx-4 mt-3 bg-brand-surface rounded-2xl px-4 py-4 shadow-sm">
        <span className="text-sm text-gray-600">{t("financialAccounts.planYear.lifetimeNote")}</span>
      </div>
    );
  }

  const deadline = claimFilingDeadline(dates);

  return (
    <div className="mx-4 mt-3 bg-brand-surface rounded-2xl px-4 pb-2 shadow-sm">
      <InfoRow
        icon="calendar-outline"
        label={t("financialAccounts.details.planYearRange")}
        value={`${formatTransactionDate(start)} – ${formatTransactionDate(end)}`}
      />
      <InfoRow icon="card-outline" label={t("financialAccounts.details.lastDayToSpend")} value={formatTransactionDate(end)} />
      {deadline !== "" && (
        <InfoRow icon="document-text-outline" label={t("financialAccounts.details.submitClaimsBy")} value={formatTransactionDate(deadline)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty / error state for the transaction list
// ---------------------------------------------------------------------------

function OnBehalfBalancesOnlyNote() {
  const { t } = useTranslation();

  return (
    <div className="items-center justify-center py-12 px-6">
      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name="lock-closed-outline" size={40} color={colors.neutral[500]} />
      </span>
      <span className="text-gray-500 mt-4 text-center">{t("financialAccounts.onBehalfBalancesOnly")}</span>
    </div>
  );
}

interface TransactionsEmptyStateProps {
  isLoading: boolean;
  isError: boolean;
  isFiltered: boolean;
  status: PlanYearStatus;
  onRetry: () => void;
}

function TransactionsEmptyState({ isLoading, isError, isFiltered, status, onRetry }: TransactionsEmptyStateProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="py-12 items-center">
        <Spinner size="large" tone="accent" />
        <span className="mt-2 text-gray-500">{t("common.loading")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="items-center justify-center py-12 px-6">
        <span aria-hidden="true" style={{ display: "flex" }}>
          <Icon name="alert-circle-outline" size={40} color={colors.error} />
        </span>
        <span className="text-gray-600 mt-3 mb-4 text-center">{t("financialAccounts.accountDetail.transactionsLoadError")}</span>
        <RetryButton onPress={onRetry} />
      </div>
    );
  }

  const isEndedPlanYear = status === "runOut" || status === "closed";

  return (
    <div className="items-center justify-center py-12 px-6">
      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name="receipt-outline" size={48} color={colors.neutral[500]} />
      </span>
      <span className="text-gray-500 mt-4 text-center">
        {isFiltered
          ? t("financialAccounts.accountDetail.emptyForFilter")
          : isEndedPlanYear
            ? t("financialAccounts.accountDetail.emptyEndedPlanYear")
            : t("financialAccounts.accountDetail.empty")}
      </span>
    </div>
  );
}

function RetryButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onPress}
      className="active:opacity-80"
      style={{ backgroundColor: colors.brand.accent, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, borderRadius: 12 }}
      aria-label={t("common.retry")}
    >
      <span style={{ color: colors.brand.surface, fontWeight: "600" }}>{t("common.retry")}</span>
    </button>
  );
}
