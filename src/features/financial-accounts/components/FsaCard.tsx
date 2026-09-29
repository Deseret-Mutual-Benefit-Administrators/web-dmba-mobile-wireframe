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
import { useFsaAccount, useFinancialSummary } from "./cardData";
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
 * Dashboard card for the FSA (Flexible Spending Account). The plan year is part of
 * the account's name — "FSA Account 2026" (ADR-107). When the member also has an
 * HSA, an informational guardrail explains the IRS conflict rules (ADR-099).
 */
interface FsaCardProps {
  /** Set when the account is a contract holder's, read on behalf (ADR-156). */
  onBehalfOfName?: string;
}

export function FsaCard({ onBehalfOfName }: FsaCardProps = {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError, refetch } = useFsaAccount();
  const { data: summary } = useFinancialSummary();
  const hasHsaFsaConflict = Boolean(summary?.hsa && summary?.fsa?.fsaType === "healthcare");

  // One "today" for the whole card, so the badge and the banner cannot disagree.
  const today = useMemo(() => localToday(), []);

  const baseTitle = t("financialAccounts.fsa.title");
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
      icon="card-outline"
      title={title}
      badge={badge}
      accessibilityLabel={isExpanded ? t("financialAccounts.fsa.collapse") : t("financialAccounts.fsa.expand")}
      pressAccessibilityLabel={badgeLabel ? `${title}, ${badgeLabel}` : title}
      onPress={() => navigate(`/account/fsa?planYear=${DASHBOARD_PLAN_YEAR}`)}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      isLoading={isExpanded && isLoading}
      isError={isError}
      onRetry={() => refetch()}
      caption={onBehalfOfName ? t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName }) : undefined}
    >
      {data && (
        <div>
          {/* HSA + FSA conflict guardrail — informational, not alarming */}
          {hasHsaFsaConflict && (
            <div className="mb-3 -mt-1">
              <GuardrailBanner message={t("financialAccounts.guardrails.hsaFsaConflict")} />
            </div>
          )}

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.fsa.annualElection")} value={formatCurrency(data.annualElection)} emphasize />
          </div>

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.fsa.used")} value={formatCurrency(data.annualElection - data.remainingBalance)} emphasize />
          </div>

          {/* Value stays literal text-green-600, passed as a custom value node. */}
          <div className="bg-gray-50 rounded-xl px-4 mb-3">
            <KeyValueRow
              label={t("financialAccounts.fsa.remainingBalance")}
              value={<span className="text-sm font-bold text-green-600">{formatCurrency(data.remainingBalance)}</span>}
            />
          </div>

          {/* Where this plan year sits in time. */}
          <PlanYearStatusBanner dates={data} today={today} />

          {/* Progress bar */}
          <div>
            <div className="flex-row justify-between mb-1.5">
              <span className="text-xs text-brand-secondary">
                {formatCurrency(data.annualElection - data.remainingBalance)} {t("financialAccounts.fsa.used").toLowerCase()}
              </span>
              <span className="text-xs text-brand-secondary">
                {formatCurrency(data.remainingBalance)} {t("financialAccounts.fsa.remaining").toLowerCase()}
              </span>
            </div>
            <div
              className="w-full h-4 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.financial.track }}
              role="progressbar"
              aria-label={t("financialAccounts.fsa.progressBar", {
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
          <GuardrailBanner message={t("financialAccounts.fsa.useItOrLoseIt")} />

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
