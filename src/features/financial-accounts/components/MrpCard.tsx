import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { FinancialCardShell } from "./FinancialCardShell";
import { useMrpAccount } from "./cardData";
import { formatCurrency } from "./cardServices";

/**
 * Dashboard card for the Master Retirement Plan (MRP / pension). Expanded view
 * shows years of benefit credit and estimated monthly payment at the retirement
 * age, in large centered gray-50 boxes.
 */
interface MrpCardProps {
  /** Set when the account is a contract holder's, read on behalf (ADR-156). */
  onBehalfOfName?: string;
}

export function MrpCard({ onBehalfOfName }: MrpCardProps = {}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError, refetch } = useMrpAccount({ enabled: isExpanded });

  const asOfDate = data
    ? new Date(data.asOfDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <FinancialCardShell
      icon="time-outline"
      title={t("financialAccounts.mrp.title")}
      accessibilityLabel={isExpanded ? t("financialAccounts.mrp.collapse") : t("financialAccounts.mrp.expand")}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      isLoading={isExpanded && isLoading}
      isError={isError}
      onRetry={() => refetch()}
      caption={onBehalfOfName ? t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName }) : undefined}
    >
      {data && (
        <div>
          {/* Years of Benefit Credit — centered large display */}
          <div className="bg-gray-50 rounded-xl px-4 py-4 mb-3 items-center">
            <p className="text-gray-500 text-xs mb-1">{t("financialAccounts.mrp.yearsOfCredit")}</p>
            <p className="text-brand-primary font-bold text-2xl">
              {data.yearsOfCredit.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{" "}
              <span className="text-base font-semibold">{t("financialAccounts.mrp.years")}</span>
            </p>
          </div>

          {/* Estimated Monthly Payment — centered large display */}
          <div className="bg-gray-50 rounded-xl px-4 py-4 mb-3 items-center">
            <p className="text-gray-500 text-xs mb-1">{t("financialAccounts.mrp.estimatedMonthlyPayment")}</p>
            <p className="text-brand-primary font-bold text-2xl">{formatCurrency(data.estimatedMonthlyPayment)}</p>
            <p className="text-gray-500 text-xs mt-0.5">{t("financialAccounts.mrp.atAge", { age: data.estimatedPaymentAge })}</p>
          </div>

          {/* Estimate disclaimer */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 mb-2">
            <p className="text-xs text-blue-700">{t("financialAccounts.mrp.estimateDisclaimer")}</p>
          </div>

          {/* As-of date */}
          {asOfDate && <p className="text-xs text-gray-500 text-center mt-1">{t("financialAccounts.mrp.asOf", { date: asOfDate })}</p>}
        </div>
      )}
    </FinancialCardShell>
  );
}
