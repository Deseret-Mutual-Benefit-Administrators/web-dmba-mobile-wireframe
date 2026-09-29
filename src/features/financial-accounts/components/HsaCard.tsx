import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { FinancialCardShell } from "./FinancialCardShell";
import { useHsaAccount } from "./cardData";
import { formatCurrency, hsaContributionDisplay } from "./cardServices";

/**
 * The vendor plan-year index this card's data came from — `0`, the default.
 * Travels with the tap so the detail screen opens the same data the card showed.
 */
const DASHBOARD_PLAN_YEAR = 0;

/**
 * Dashboard card for the HSA (Health Savings Account). Deliberately unyeared:
 * an HSA has no plan year, so it carries a note that the account does not reset
 * (ADR-107/116).
 */
interface HsaCardProps {
  /** Set when the account is a contract holder's, read on behalf (ADR-156). */
  onBehalfOfName?: string;
}

export function HsaCard({ onBehalfOfName }: HsaCardProps = {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError, refetch } = useHsaAccount({ enabled: isExpanded });

  const isActive = !data || data.status === "Active";

  const labels = hsaContributionDisplay(
    data ?? { annualLimit: null, taxYear: null, coverageTier: null, catchUpContribution: null },
    formatCurrency
  );

  return (
    <FinancialCardShell
      icon="wallet-outline"
      title={t("financialAccounts.hsa.title")}
      accessibilityLabel={isExpanded ? t("financialAccounts.hsa.collapse") : t("financialAccounts.hsa.expand")}
      pressAccessibilityLabel={t("financialAccounts.hsa.title")}
      onPress={() => navigate(`/account/hsa?planYear=${DASHBOARD_PLAN_YEAR}`)}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      isLoading={isExpanded && isLoading}
      isError={isError}
      onRetry={() => refetch()}
      caption={onBehalfOfName ? t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName }) : undefined}
    >
      {data && (
        <div>
          {/* Status badge when not active */}
          {!isActive && (
            <div className="bg-amber-100 rounded-lg px-3 py-2 mb-3 self-start">
              <span className="text-amber-800 text-xs font-semibold">{data.status}</span>
            </div>
          )}

          {/* Available to Spend (cash balance) */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-2">
            <div className="flex-row justify-between items-center">
              <span className="text-gray-700 text-sm font-semibold">{t("financialAccounts.hsa.availableToSpend")}</span>
              <span className="text-green-600 font-bold text-base">{formatCurrency(data.cashBalance)}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">{t("financialAccounts.planYear.lifetimeNote")}</p>
          </div>

          {/* Investment Balance — omitted when the vendor reported none */}
          {data.investmentBalance !== null && (
            <div className="bg-gray-50 rounded-xl px-4 mb-2">
              <KeyValueRow label={t("financialAccounts.hsa.investmentBalance")} value={formatCurrency(data.investmentBalance)} emphasize />
              <p className="text-gray-500 text-xs pb-3 -mt-1">{t("financialAccounts.hsa.investmentNote")}</p>
            </div>
          )}

          {/* Contributions row — labelled with the vendor's tax year */}
          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t(labels.contributions.key, labels.contributions.params)} value={formatCurrency(data.ytdContributions)} emphasize />
          </div>

          {/* Employer Contributions row */}
          {data.employerContributions > 0 && (
            <div className="bg-gray-50 rounded-xl px-4 mb-2">
              <KeyValueRow label={t("financialAccounts.hsa.employerContributions")} value={formatCurrency(data.employerContributions)} emphasize />
            </div>
          )}

          {/* IRS limit — "Unavailable" when the limits read failed (ADR-139) */}
          {data.limitsUnavailable && (
            <div className="bg-gray-50 rounded-xl px-4 mb-2">
              <KeyValueRow
                label={t("financialAccounts.hsa.annualLimit")}
                value={<span className="text-sm text-gray-500 italic">{t("common.unavailableValue")}</span>}
              />
            </div>
          )}
          {labels.limit !== null && data.annualLimit !== null && (
            <div className="bg-gray-50 rounded-xl px-4 mb-2">
              <KeyValueRow label={t(labels.limit.key, labels.limit.params)} value={formatCurrency(data.annualLimit)} emphasize />
              {labels.coverageTier !== null && <p className="text-gray-500 text-xs pb-3 -mt-1">{t(labels.coverageTier.key)}</p>}
              {labels.catchUp !== null && <p className="text-gray-500 text-xs pb-3 -mt-1">{t(labels.catchUp.key, labels.catchUp.params)}</p>}
            </div>
          )}

          {/* Divider + Total Balance */}
          <div className="h-px bg-gray-200 mb-3 mt-1" />
          <div className="bg-gray-50 rounded-xl px-4">
            <KeyValueRow label={t("financialAccounts.hsa.totalBalance")} value={formatCurrency(data.totalHsaBalance ?? data.totalBalance)} emphasize />
          </div>
        </div>
      )}
    </FinancialCardShell>
  );
}
