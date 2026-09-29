import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors } from "@/src/shared/theme/colors";
import {
  useHsaAccount,
  useFsaAccount,
  useLpfsaAccount,
  useDepcAccount,
  useFinancialSummary,
  usePlanYears,
  useBalanceDue,
} from "../api/accountsQueries";
import { formatCurrency, formatTransactionDate, shouldShowBalanceDueBanner } from "../services/accountTransforms";
import {
  accountRowStatus,
  accountRowStatusKey,
  buildAccountRows,
  type SpendingAccountRow,
  type SpendingAccountType,
} from "../services/accountList";
import { accountDisplayName, isOpenEndedWindow, type PlanYearDates, type PlanYearStatus } from "../services/planYearStatus";
import { localToday } from "../services/today";
import { GuardrailBanner } from "../components/GuardrailBanner";
import { BalanceDueBanner } from "../components/BalanceDueBanner";
import { PlanYearBadge } from "../components/PlanYearBadge";
import { EntryPointRow } from "../components/EntryPointRow";
import { oneLine } from "../components/textStyles";
import type { BalanceDueItem } from "../types";

const ACCOUNT_NAME_KEY: Record<SpendingAccountType, string> = {
  hsa: "financialAccounts.hsa.title",
  fsa: "financialAccounts.fsa.title",
  lpfsa: "financialAccounts.lpfsa.title",
  depc: "financialAccounts.depc.title",
};

const ACCOUNT_ICON: Record<SpendingAccountType, string> = {
  hsa: "medkit-outline",
  fsa: "wallet-outline",
  lpfsa: "eye-outline",
  depc: "people-outline",
};

interface ResolvedRow extends SpendingAccountRow {
  dates: PlanYearDates | null;
  status: PlanYearStatus;
  /** Name with the plan year in it — "FSA Account 2024". */
  title: string;
  balance: number | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Activity → HSA/FSA: the member's spending accounts, one row per account per
 * plan year. Past plan years are other accounts in the list, not a filter over
 * one list (ADR-112). Only the default year's balances are fetched.
 */
export function SpendingAccountsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const summaryQuery = useFinancialSummary();
  const planYearsQuery = usePlanYears();

  const isOnBehalfOfSpendingAccounts = Boolean(summaryQuery.data?.onBehalf?.spendingAccounts);

  const balanceDueQuery = useBalanceDue({ enabled: !isOnBehalfOfSpendingAccounts });

  const hsaQuery = useHsaAccount({ enabled: Boolean(summaryQuery.data?.hsa) });
  const fsaQuery = useFsaAccount({ enabled: Boolean(summaryQuery.data?.fsa) });
  const lpfsaQuery = useLpfsaAccount({ enabled: Boolean(summaryQuery.data?.lpfsa) });
  const depcQuery = useDepcAccount({ enabled: Boolean(summaryQuery.data?.depc) });

  const rows = useMemo(
    () => buildAccountRows(summaryQuery.data, planYearsQuery.data ?? []),
    [summaryQuery.data, planYearsQuery.data]
  );

  const today = localToday();

  const resolved = useMemo<ResolvedRow[]>(() => {
    const defaultYear: Record<
      SpendingAccountType,
      { dates: PlanYearDates | null; balance: number | null; isLoading: boolean; isError: boolean }
    > = {
      hsa: { dates: hsaQuery.data ?? null, balance: hsaQuery.data?.cashBalance ?? null, isLoading: hsaQuery.isLoading, isError: hsaQuery.isError },
      fsa: { dates: fsaQuery.data ?? null, balance: fsaQuery.data?.balance ?? null, isLoading: fsaQuery.isLoading, isError: fsaQuery.isError },
      lpfsa: { dates: lpfsaQuery.data ?? null, balance: lpfsaQuery.data?.balance ?? null, isLoading: lpfsaQuery.isLoading, isError: lpfsaQuery.isError },
      depc: { dates: depcQuery.data ?? null, balance: depcQuery.data?.remainingBalance ?? null, isLoading: depcQuery.isLoading, isError: depcQuery.isError },
    };

    return rows.map((row) => {
      const live = row.isDefaultYear ? defaultYear[row.type] : null;
      const dates = live?.dates ?? row.dates;
      const status = accountRowStatus({ ...row, dates }, today);
      const baseName = t(ACCOUNT_NAME_KEY[row.type]);

      return {
        ...row,
        dates,
        status,
        title: dates ? accountDisplayName(baseName, dates) : baseName,
        balance: live?.balance ?? null,
        isLoading: live?.isLoading ?? false,
        isError: live?.isError ?? false,
      };
    });
  }, [rows, today, t, hsaQuery, fsaQuery, lpfsaQuery, depcQuery]);

  const handleOpenAccount = useCallback(
    (row: SpendingAccountRow) => {
      navigate(`/account/${row.type}?planYear=${String(row.planYear)}`);
    },
    [navigate]
  );

  const handleBenefitCardsPress = useCallback(() => navigate("/benefit-cards"), [navigate]);
  const handleScannerPress = useCallback(() => navigate("/eligibility-scanner"), [navigate]);
  // Spending-account claim submission (FA-4). Not "/claim" — that's medical.
  const handleSubmitClaimPress = useCallback(() => navigate("/spending-claim"), [navigate]);
  const handleAllActivityPress = useCallback(() => navigate("/spending-activity"), [navigate]);

  const showSpendOrderTip = resolved.filter((row) => row.isDefaultYear).length >= 2;

  const accountsLoading = summaryQuery.isLoading || planYearsQuery.isLoading;

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      <div className="flex-1 scrollbar-none" style={{ minHeight: 0, overflowY: "auto" }}>
        <div style={{ paddingBottom: 24 }}>
          <ListHeader
            onBenefitCardsPress={handleBenefitCardsPress}
            onScannerPress={handleScannerPress}
            onSubmitClaimPress={handleSubmitClaimPress}
            balanceDueTotal={balanceDueQuery.data?.totalBalanceDue ?? 0}
            balanceDueItems={balanceDueQuery.data?.items ?? []}
            showSpendOrderTip={showSpendOrderTip}
            hasAccounts={resolved.length > 0}
            showSubmitClaim={!isOnBehalfOfSpendingAccounts}
            showBenefitCards={!isOnBehalfOfSpendingAccounts}
            showBalanceDue={!isOnBehalfOfSpendingAccounts}
          />
          {resolved.length === 0 ? (
            <AccountsEmptyState
              isLoading={accountsLoading}
              isError={summaryQuery.isError}
              onRetry={() => {
                summaryQuery.refetch();
                planYearsQuery.refetch();
              }}
            />
          ) : (
            resolved.map((item) => <AccountRow key={item.key} row={item} onPress={handleOpenAccount} />)
          )}
          <ListFooter onAllActivityPress={handleAllActivityPress} showAllActivity={!isOnBehalfOfSpendingAccounts} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// List header — entry points, guardrail, balance due
// ---------------------------------------------------------------------------

interface ListHeaderProps {
  onBenefitCardsPress: () => void;
  onScannerPress: () => void;
  onSubmitClaimPress: () => void;
  balanceDueTotal: number;
  balanceDueItems: BalanceDueItem[];
  showSpendOrderTip: boolean;
  hasAccounts: boolean;
  showSubmitClaim: boolean;
  showBenefitCards: boolean;
  showBalanceDue: boolean;
}

function ListHeader({
  onBenefitCardsPress,
  onScannerPress,
  onSubmitClaimPress,
  balanceDueTotal,
  balanceDueItems,
  showSpendOrderTip,
  hasAccounts,
  showSubmitClaim,
  showBenefitCards,
  showBalanceDue,
}: ListHeaderProps) {
  const { t } = useTranslation();

  return (
    <div>
      {showSubmitClaim && (
        <EntryPointRow
          icon="receipt-outline"
          label={t("spendingClaims.entryPoint")}
          hint={t("spendingClaims.entryPointHint")}
          onPress={onSubmitClaimPress}
          spacedAbove
        />
      )}

      {showBenefitCards && (
        <EntryPointRow
          icon="card-outline"
          label={t("financialAccounts.cards.entryPoint")}
          hint={t("financialAccounts.cards.entryPointHint")}
          onPress={onBenefitCardsPress}
        />
      )}

      {/* OTC product eligibility scanner (FA-7) */}
      <EntryPointRow
        icon="barcode-outline"
        label={t("financialAccounts.scanner.entryPoint")}
        hint={t("financialAccounts.scanner.entryPointHint")}
        onPress={onScannerPress}
      />

      {showBalanceDue && shouldShowBalanceDueBanner(balanceDueTotal, balanceDueItems) && (
        <div className="mx-4 mt-3">
          <BalanceDueBanner totalBalanceDue={balanceDueTotal} items={balanceDueItems} />
        </div>
      )}

      {showSpendOrderTip && (
        <div className="mx-4">
          <GuardrailBanner message={t("financialAccounts.guardrails.spendOrderTip")} />
        </div>
      )}

      {hasAccounts && (
        <h2 className="mx-4 mt-5 mb-2 text-sm font-semibold text-brand-primary">{t("financialAccounts.accountsList.heading")}</h2>
      )}
    </div>
  );
}

/** Everything, across every account, unfiltered — load-bearing for unmapped vendor codes. */
function ListFooter({ onAllActivityPress, showAllActivity }: { onAllActivityPress: () => void; showAllActivity: boolean }) {
  const { t } = useTranslation();

  if (!showAllActivity) return null;

  return (
    <EntryPointRow
      icon="list-outline"
      label={t("financialAccounts.activity.allEntryPoint")}
      hint={t("financialAccounts.activity.allEntryPointHint")}
      onPress={onAllActivityPress}
      spacedAbove
    />
  );
}

// ---------------------------------------------------------------------------
// Account row
// ---------------------------------------------------------------------------

interface AccountRowProps {
  row: ResolvedRow;
  onPress: (row: SpendingAccountRow) => void;
}

/** One account, in one plan year, as a thing you open. */
function AccountRow({ row, onPress }: AccountRowProps) {
  const { t } = useTranslation();

  const statusText = t(accountRowStatusKey(row.status));
  const window =
    row.dates && !isOpenEndedWindow(row.dates)
      ? `${formatTransactionDate(row.dates.planStartDate!)} – ${formatTransactionDate(row.dates.planEndDate!)}`
      : null;

  const label =
    row.balance !== null
      ? t("financialAccounts.accountsList.rowLabelWithBalance", { name: row.title, status: statusText, balance: formatCurrency(row.balance) })
      : t("financialAccounts.accountsList.rowLabel", { name: row.title, status: statusText });

  return (
    <button
      type="button"
      onClick={() => onPress(row)}
      className="mx-4 mb-2 bg-brand-surface rounded-2xl px-4 py-4 shadow-sm flex-row items-center"
      aria-label={label}
      title={t("financialAccounts.accountDetail.openHint")}
    >
      <div className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3" aria-hidden="true">
        <Icon name={ACCOUNT_ICON[row.type]} size={20} color={colors.financial.gradientStart} />
      </div>

      <div className="flex-1 mr-2">
        <div className="flex-row items-center">
          <span className="text-sm font-semibold text-brand-primary flex-1 mr-2" style={oneLine}>
            {row.title}
          </span>
          <PlanYearBadge status={row.status} />
        </div>

        {window !== null && <span className="text-xs text-gray-500 mt-0.5">{window}</span>}

        {row.isDefaultYear && <AccountRowBalance row={row} />}
      </div>

      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name="chevron-forward" size={18} color={colors.neutral[500]} />
      </span>
    </button>
  );
}

function AccountRowBalance({ row }: { row: ResolvedRow }) {
  const { t } = useTranslation();

  if (row.isError) {
    return <span className="text-xs text-gray-500 mt-1">{t("financialAccounts.accountsList.balanceUnavailable")}</span>;
  }

  if (row.isLoading || row.balance === null) {
    return (
      <div style={{ alignSelf: "flex-start", marginTop: 4 }}>
        <Spinner size="small" tone="accent" />
      </div>
    );
  }

  return (
    <span className="text-base font-bold text-brand-primary mt-1">
      {t("financialAccounts.accountsList.available", { amount: formatCurrency(row.balance) })}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Empty / error state
// ---------------------------------------------------------------------------

interface AccountsEmptyStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function AccountsEmptyState({ isLoading, isError, onRetry }: AccountsEmptyStateProps) {
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
          <Icon name="alert-circle-outline" size={40} color={colors.neutral[500]} />
        </span>
        <span className="text-gray-600 mt-3 mb-4 text-center">{t("financialAccounts.accountsList.loadError")}</span>
        <button
          type="button"
          onClick={onRetry}
          className="active:opacity-80"
          style={{ backgroundColor: colors.brand.accent, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, borderRadius: 12 }}
          aria-label={t("common.retry")}
        >
          <span style={{ color: colors.brand.surface, fontWeight: "600" }}>{t("common.retry")}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="items-center justify-center py-12 px-6">
      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name="wallet-outline" size={48} color={colors.neutral[500]} />
      </span>
      <span className="text-gray-500 mt-4 text-center">{t("financialAccounts.accountsList.empty")}</span>
    </div>
  );
}
