import { useCallback, useEffect, useMemo, type ReactElement } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors } from "@/src/shared/theme/colors";
import { useAccountActivity } from "../api/accountsQueries";
import {
  activityToEntry,
  entriesForAccountFeed,
  unresolvedAccountCodes,
  type AccountEntry,
} from "../services/accountEntries";
import type { SpendingAccountType } from "../services/accountList";
import { AccountEntryRow } from "./AccountEntryRow";

/** Account → the shortest member-facing name that still tells two accounts apart. */
const ACCOUNT_SHORT_NAME_KEY: Record<SpendingAccountType, string> = {
  hsa: "financialAccounts.shortName.hsa",
  fsa: "financialAccounts.shortName.fsa",
  lpfsa: "financialAccounts.shortName.lpfsa",
  depc: "financialAccounts.shortName.depc",
};

interface ActivityFeedProps {
  /** The account to narrow to, or **null for every account** — the unfiltered surface. */
  accountType: SpendingAccountType | null;
  /** Plan-year index — 0 (the default) is the current plan year. */
  planYear: number;
  /** The year these rows belong to — "2024", or "" when it isn't known. */
  planYearLabel: string;
  /** A header to scroll with the rows. */
  listHeader?: ReactElement;
  /** Suppresses the attach-receipt write action on every row (ADR-156). */
  isOnBehalf?: boolean;
}

/**
 * Claims, deposits and card transactions with adjudication detail. Unfiltered
 * (`accountType` null), it is the one place a row whose vendor account code
 * resolves to no known account still lands.
 */
export function ActivityFeed({ accountType, planYear, planYearLabel, listHeader, isOnBehalf = false }: ActivityFeedProps) {
  const { t } = useTranslation();

  const {
    data: activityPages,
    isLoading: activityLoading,
    isError: activityError,
    refetch,
  } = useAccountActivity({ planYear });

  const allEntries = useMemo(
    () => (activityPages?.pages.flatMap((page) => page.items) ?? []).map((item, index) => activityToEntry(item, index)),
    [activityPages]
  );

  const entries = useMemo(() => entriesForAccountFeed(allEntries, accountType), [allEntries, accountType]);

  // Codes only — never a row, which is PHI.
  const unresolved = useMemo(() => unresolvedAccountCodes(allEntries).join(","), [allEntries]);
  useEffect(() => {
    if (unresolved !== "") {
      console.warn(
        `[financial-accounts] activity rows carry account-type codes that map to no known account: ${unresolved}. ` +
          "They appear only on the unfiltered surface, not inside any account."
      );
    }
  }, [unresolved]);

  const receiptsUnavailable = activityPages?.pages.some((page) => page.unavailable?.includes("receipts")) ?? false;

  const renderItem = useCallback(
    (item: AccountEntry) => (
      <AccountEntryRow
        key={item.key}
        entry={item}
        accountLabel={accountType !== null ? null : buildAccountLabel(item, planYearLabel, t)}
        isOnBehalf={isOnBehalf}
      />
    ),
    [accountType, planYearLabel, t, isOnBehalf]
  );

  return (
    <div className="flex-1 scrollbar-none" style={{ minHeight: 0, overflowY: "auto" }}>
      <div style={{ paddingBottom: 24 }}>
        {listHeader}
        {entries.length === 0 ? (
          <ActivityEmptyState
            isLoading={activityLoading}
            isError={activityError}
            isScoped={accountType !== null}
            onRetry={() => {
              refetch();
            }}
          />
        ) : (
          entries.map(renderItem)
        )}
        {receiptsUnavailable && (
          <span className="text-gray-500 text-xs text-center px-6 py-3">
            {t("financialAccounts.activity.receiptsUnavailable")}
          </span>
        )}
      </div>
    </div>
  );
}

/** "FSA 2024" — which account and year a row belongs to. The HSA never takes a year. */
function buildAccountLabel(entry: AccountEntry, planYearLabel: string, t: (key: string) => string): string | null {
  const name = entry.accountType !== null ? t(ACCOUNT_SHORT_NAME_KEY[entry.accountType]) : entry.accountTypeCode ?? "";

  if (name === "") return null;
  if (planYearLabel === "" || entry.accountType === "hsa") return name;
  return `${name} ${planYearLabel}`;
}

interface ActivityEmptyStateProps {
  isLoading: boolean;
  isError: boolean;
  isScoped: boolean;
  onRetry: () => void;
}

function ActivityEmptyState({ isLoading, isError, isScoped, onRetry }: ActivityEmptyStateProps) {
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
        <span className="text-gray-600 mt-3 mb-4 text-center">{t("financialAccounts.activity.loadError")}</span>
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
    <div className="items-center justify-center py-16 px-6">
      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name="document-text-outline" size={48} color={colors.neutral[500]} />
      </span>
      <span className="text-gray-500 mt-4 text-center">
        {isScoped ? t("financialAccounts.activity.emptyForAccount") : t("financialAccounts.activity.empty")}
      </span>
    </div>
  );
}
