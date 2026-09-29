import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { InfoRow } from "@/src/shared/components/InfoRow";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { financialCardGradient, gradientCss } from "@/src/shared/theme/gradients";
import { colors } from "@/src/shared/theme/colors";
import { FinancialCardShell } from "./FinancialCardShell";
import { GuardrailBanner } from "./GuardrailBanner";
import { PlanYearStatusBanner } from "./PlanYearStatusBanner";
import { PlanYearBadge } from "./PlanYearBadge";
import { useLpfsaAccount } from "./cardData";
import {
  accountDisplayName,
  formatCurrency,
  formatTransactionDate,
  localToday,
  planYearBadgeKey,
  planYearStatus,
} from "./cardServices";

/** The plan year this card is rendered for — `0` is the current (default) year. */
const DASHBOARD_PLAN_YEAR = 0;

/**
 * Dashboard card for the Limited Purpose FSA (dental & vision expenses only).
 * Mirrors FsaCard with a prominent eligibility line (FA-1/FA-2, ADR-099).
 */
interface LpfsaCardProps {
  /** Set when the account is a contract holder's, read on behalf (ADR-156). */
  onBehalfOfName?: string;
}

export function LpfsaCard({ onBehalfOfName }: LpfsaCardProps = {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError, refetch } = useLpfsaAccount();

  // One "today" for the whole card, so the badge and the banner cannot disagree.
  const today = useMemo(() => localToday(), []);

  const baseTitle = t("financialAccounts.lpfsa.title");
  const status = data ? planYearStatus(data, today) : null;
  const badgeKey = status ? planYearBadgeKey(status) : null;
  const badgeLabel = badgeKey ? t(badgeKey) : null;
  const badge = status && badgeKey ? <PlanYearBadge status={status} /> : null;
  const title = data ? accountDisplayName(baseTitle, data) : baseTitle;

  const progressPercent =
    data && data.annualElection > 0
      ? Math.min(((data.annualElection - data.remainingBalance) / data.annualElection) * 100, 100)
      : 0;

  return (
    <FinancialCardShell
      icon="glasses-outline"
      title={title}
      badge={badge}
      accessibilityLabel={isExpanded ? t("financialAccounts.lpfsa.collapse") : t("financialAccounts.lpfsa.expand")}
      pressAccessibilityLabel={badgeLabel ? `${title}, ${badgeLabel}` : title}
      onPress={() => navigate(`/account/lpfsa?planYear=${DASHBOARD_PLAN_YEAR}`)}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      isLoading={isExpanded && isLoading}
      isError={isError}
      onRetry={() => refetch()}
      caption={onBehalfOfName ? t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName }) : undefined}
    >
      {data && (
        <div>
          {/* Eligibility line — dental & vision only */}
          <p className="text-sm text-brand-secondary font-medium mb-1">{t("financialAccounts.lpfsa.eligibility")}</p>

          {/* Card charge order note (P7) */}
          <p className="text-xs text-gray-500 mb-3">{t("financialAccounts.lpfsa.cardOrder")}</p>

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.lpfsa.annualElection")} value={formatCurrency(data.annualElection)} emphasize />
          </div>

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.lpfsa.used")} value={formatCurrency(data.annualElection - data.remainingBalance)} emphasize />
          </div>

          {/* Value stays literal text-green-600, passed as a custom value node. */}
          <div className="bg-gray-50 rounded-xl px-4 mb-3">
            <KeyValueRow
              label={t("financialAccounts.lpfsa.remainingBalance")}
              value={<span className="text-sm font-bold text-green-600">{formatCurrency(data.remainingBalance)}</span>}
            />
          </div>

          {/* Where this plan year sits in time. */}
          <PlanYearStatusBanner dates={data} today={today} />

          {/* Progress bar */}
          <div>
            <div className="flex-row justify-between mb-1.5">
              <span className="text-xs text-brand-secondary">
                {formatCurrency(data.annualElection - data.remainingBalance)} {t("financialAccounts.lpfsa.used").toLowerCase()}
              </span>
              <span className="text-xs text-brand-secondary">
                {formatCurrency(data.remainingBalance)} {t("financialAccounts.lpfsa.remaining").toLowerCase()}
              </span>
            </div>
            <div
              className="w-full h-4 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.financial.track }}
              role="progressbar"
              aria-label={t("financialAccounts.lpfsa.progressBar", {
                used: formatCurrency(data.annualElection - data.remainingBalance),
                total: formatCurrency(data.annualElection),
              })}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              {progressPercent > 0 && (
                <div style={{ width: `${progressPercent}%`, height: "100%", background: gradientCss(financialCardGradient, 90) }} />
              )}
            </div>
          </div>

          {/* Use-it-or-lose-it warning */}
          <GuardrailBanner message={t("financialAccounts.lpfsa.useItOrLoseIt")} />

          {/* Plan-year depth — only when the vendor reports these values */}
          {data.planStartDate && data.planEndDate && (
            <InfoRow
              icon="calendar-outline"
              label={t("financialAccounts.details.planYearRange")}
              value={`${formatTransactionDate(data.planStartDate)} – ${formatTransactionDate(data.planEndDate)}`}
            />
          )}
          {data.submitClaimsLastDate && (
            <InfoRow
              icon="alert-circle-outline"
              label={t("financialAccounts.details.submitClaimsBy")}
              value={formatTransactionDate(data.submitClaimsLastDate)}
            />
          )}
          {data.ytdContributions > 0 && (
            <InfoRow
              icon="trending-up-outline"
              label={t("financialAccounts.details.contributions")}
              value={formatCurrency(data.ytdContributions)}
            />
          )}
          {data.additionalDeposits > 0 && (
            <InfoRow
              icon="add-circle-outline"
              label={t("financialAccounts.details.additionalDeposits")}
              value={formatCurrency(data.additionalDeposits)}
            />
          )}
        </div>
      )}
    </FinancialCardShell>
  );
}
