import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { CollapsibleSection } from "@/src/shared/components/CollapsibleSection";
import { Spinner } from "@/src/shared/components/Spinner";
import { AccountEntryRow } from "./AccountEntryRow";
import { useAccountExtras } from "../hooks/useAccountExtras";
import type { RecentSelection } from "../services/expenseEntries";
import type { SpendingAccountType } from "../services/accountList";

interface AccountExtrasSectionProps {
  type: SpendingAccountType;
  /** Suppresses the attach-receipt write action on rows here too (ADR-156). */
  isOnBehalf?: boolean;
}

/**
 * Expenses, reimbursements and HSA payments (v0.8.9, ADR-120), collapsed by
 * default. Reads only.
 */
export function AccountExtrasSection({ type, isOnBehalf = false }: AccountExtrasSectionProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const extras = useAccountExtras(type);

  return (
    <div className="mx-4 mt-3">
      <CollapsibleSection
        icon="receipt-outline"
        title={extras.isHsa ? t("financialAccounts.extras.hsaSectionTitle") : t("financialAccounts.extras.sectionTitle")}
        subtitle={
          extras.isHsa ? t("financialAccounts.extras.hsaSectionSubtitle") : t("financialAccounts.extras.sectionSubtitle")
        }
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      >
        {extras.isLoading ? (
          <div className="py-4 items-center">
            <Spinner size="small" tone="accent" />
          </div>
        ) : extras.isError ? (
          <div className="py-4 items-center">
            <span className="text-sm text-gray-500 mb-2">{t("financialAccounts.extras.loadError")}</span>
            <button
              type="button"
              onClick={extras.onRetry}
              className="active:opacity-70"
              style={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8 }}
              aria-label={t("common.retry")}
            >
              <span style={{ fontSize: 14, fontWeight: "600", color: colors.brand.accent }}>{t("common.retry")}</span>
            </button>
          </div>
        ) : extras.isHsa ? (
          <>
            <ExtrasGroup heading={t("financialAccounts.extras.hsaFailedHeading")} selection={extras.hsaFailed} isOnBehalf={isOnBehalf} />
            <ExtrasGroup heading={t("financialAccounts.extras.hsaPendingHeading")} selection={extras.hsaPending} isOnBehalf={isOnBehalf} />
          </>
        ) : (
          <>
            <ExtrasGroup heading={t("financialAccounts.extras.itemsHeading")} selection={extras.items} isOnBehalf={isOnBehalf} />
            <ExtrasGroup heading={t("financialAccounts.extras.paybackHeading")} selection={extras.payback} isOnBehalf={isOnBehalf} />
          </>
        )}
      </CollapsibleSection>
    </div>
  );
}

interface ExtrasGroupProps {
  heading: string;
  selection: RecentSelection;
  isOnBehalf?: boolean;
}

/** One labeled group of rows, capped at a recent selection with an in-place "See all". */
function ExtrasGroup({ heading, selection, isOnBehalf = false }: ExtrasGroupProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const rows = expanded ? selection.all : selection.shown;

  return (
    <div className="mb-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{heading}</h3>
      {rows.length === 0 ? (
        <span className="text-sm text-gray-500 px-1 py-1">{t("financialAccounts.extras.empty")}</span>
      ) : (
        <>
          {rows.map((entry) => (
            <div key={entry.key} className="mb-2 last:mb-0">
              <AccountEntryRow entry={entry} accountLabel={null} isOnBehalf={isOnBehalf} />
            </div>
          ))}
          {selection.hasMore && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="active:opacity-70"
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 8, paddingBottom: 8 }}
              aria-label={t("financialAccounts.extras.seeAll")}
              title={t("financialAccounts.extras.seeAllHint")}
            >
              <span style={{ fontSize: 14, fontWeight: "600", marginRight: 4, color: colors.brand.accent }}>
                {t("financialAccounts.extras.seeAll")}
              </span>
              <span aria-hidden="true" style={{ display: "flex" }}>
                <Icon name="chevron-down" size={14} color={colors.brand.accent} />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
