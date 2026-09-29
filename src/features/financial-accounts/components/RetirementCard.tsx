import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { colors } from "@/src/shared/theme/colors";
import { lines } from "@/src/features/dashboard/webText";
import { FinancialCardShell } from "./FinancialCardShell";
import { useRetirementAccount } from "./cardData";
import { formatCurrency, formatPercent } from "./cardServices";

/**
 * The app opens the vendor's app through a universal link, falling back to the
 * store. The wireframe links nowhere: it shows the app's failure alert text so
 * the tap is visible without leaving the page.
 */
function openEmpowerApp(t: (key: string) => string) {
  window.alert(`${t("common.error")}\n\n${t("financialAccounts.retirement.openEmpowerFailed")}`);
}

/**
 * Dashboard card for the 401(k) retirement account. Expanded view shows plan
 * name (if reported), current balance, vested balance, fund holdings, and loans
 * — the full extent of what the vendor's balance grant reports (ADR-137).
 */
interface RetirementCardProps {
  /** Set when the account is a contract holder's, read on behalf (ADR-156). */
  onBehalfOfName?: string;
}

export function RetirementCard({ onBehalfOfName }: RetirementCardProps = {}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError, refetch } = useRetirementAccount({ enabled: isExpanded });

  const hasLoans = data && data.loans.length > 0;
  const hasInvestments = data && data.investments.length > 0;

  return (
    <FinancialCardShell
      icon="trending-up-outline"
      title={t("financialAccounts.retirement.title")}
      accessibilityLabel={isExpanded ? t("financialAccounts.retirement.collapse") : t("financialAccounts.retirement.expand")}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      isLoading={isExpanded && isLoading}
      isError={isError}
      onRetry={() => refetch()}
      caption={onBehalfOfName ? t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName }) : undefined}
    >
      {data && (
        <div>
          {/* Plan name — only when the vendor reported one */}
          {data.planName != null && <p className="text-gray-500 text-xs mb-2">{data.planName}</p>}

          {/* Current Balance — primary value */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-2 flex-row justify-between items-center">
            <span className="text-gray-700 text-sm font-semibold">{t("financialAccounts.retirement.currentBalance")}</span>
            <span className="text-brand-primary font-bold text-base">{formatCurrency(data.totalBalance)}</span>
          </div>

          {/* Vested Balance row with explanation */}
          <div className="bg-gray-50 rounded-xl px-4 mb-3">
            <KeyValueRow label={t("financialAccounts.retirement.vestedBalance")} value={formatCurrency(data.vestedBalance)} emphasize />
            <p className="text-gray-500 text-xs pb-3 -mt-1">{t("financialAccounts.retirement.vestedNote")}</p>
          </div>

          {/* Fund holdings — balance + server-computed allocation share */}
          {hasInvestments && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-brand-secondary uppercase mb-2">{t("financialAccounts.retirement.investments")}</p>
              {data.investments.map((investment, index) => (
                <div
                  key={`${investment.ticker ?? "fund"}-${index}`}
                  className="bg-gray-50 rounded-xl px-4 py-3 mb-2 flex-row justify-between items-center"
                >
                  <div className="flex-1 pr-2">
                    <p className="text-gray-700 text-sm font-semibold" style={lines(1)}>
                      {investment.fundName ?? t("financialAccounts.retirement.unnamedFund")}
                    </p>
                    {investment.ticker != null && <p className="text-gray-500 text-xs mt-0.5">{investment.ticker}</p>}
                  </div>
                  <div className="items-end">
                    <span className="text-brand-primary font-semibold text-sm">{formatCurrency(investment.balance)}</span>
                    <p className="text-gray-500 text-xs mt-0.5">{formatPercent(investment.allocationPercent)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Open the vendor's app — universal-link CTA in the app. */}
          <button
            type="button"
            onClick={() => openEmpowerApp(t)}
            aria-label={t("financialAccounts.retirement.openEmpower")}
            title={t("financialAccounts.retirement.openEmpowerHint")}
            className="flex-row items-center justify-center mt-1 mb-3 rounded-lg py-3 px-4"
            style={{ backgroundColor: colors.financial.retirementAccent }}
          >
            <Icon name="open-outline" size={18} color={colors.brand.surface} />
            <span className="ml-2 text-sm font-semibold text-white">{t("financialAccounts.retirement.openEmpower")}</span>
          </button>

          {/* Loan section — only shown when loans exist. */}
          {hasLoans && (
            <div>
              <div className="h-px bg-gray-200 mb-3" />
              <div className="flex-row justify-between items-center mb-2">
                <span className="text-xs font-semibold text-brand-secondary uppercase">{t("financialAccounts.retirement.loans")}</span>
                <span className="text-xs font-semibold text-brand-secondary">{formatCurrency(data.totalLoanBalance)}</span>
              </div>
              {data.loans.map((loan, index) => (
                <div key={`${loan.effectiveDate ?? "loan"}-${index}`} className="bg-gray-50 rounded-xl px-4 py-3 mb-2">
                  <div className="flex-row justify-between mb-1">
                    <span className="text-gray-500 text-sm">{t("financialAccounts.retirement.loanBalance")}</span>
                    <span className="text-brand-primary font-semibold text-sm">{formatCurrency(loan.balance)}</span>
                  </div>
                  {loan.effectiveDate != null && (
                    <div className="flex-row justify-between">
                      <span className="text-gray-500 text-sm">{t("financialAccounts.retirement.effectiveDate")}</span>
                      <span className="text-brand-primary font-semibold text-sm">
                        {new Date(`${loan.effectiveDate}T00:00:00`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </FinancialCardShell>
  );
}
