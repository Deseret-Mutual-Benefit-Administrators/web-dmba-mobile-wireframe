import { useTranslation } from "@/src/shared/i18n";
import {
  formatCurrency,
  getBalanceDueAccountLabelKey,
  shouldShowBalanceDueBanner,
} from "../services/accountTransforms";
import type { BalanceDueItem } from "../types";

interface BalanceDueBannerProps {
  totalBalanceDue: number;
  items: BalanceDueItem[];
}

/** Red-toned balance-due callout — an amount actually owed, so not the amber guardrail tone. */
export function BalanceDueBanner({ totalBalanceDue, items }: BalanceDueBannerProps) {
  const { t } = useTranslation();

  if (!shouldShowBalanceDueBanner(totalBalanceDue, items)) return null;

  const bannerLabel = t("financialAccounts.balanceDue.bannerTitle", {
    amount: formatCurrency(totalBalanceDue),
  });

  return (
    <div className="bg-red-50 rounded-xl px-4 py-3 mt-3" role="alert" aria-label={bannerLabel}>
      <span className="text-sm font-semibold text-red-800 mb-1">{bannerLabel}</span>
      {items.map((item, index) => (
        <span key={`${item.accountType}-${index}`} className="text-xs text-red-700 mt-0.5">
          {t("financialAccounts.balanceDue.lineItem", {
            plan: item.planDescription || t(getBalanceDueAccountLabelKey(item.accountType)),
            amount: formatCurrency(item.amount),
          })}
        </span>
      ))}
    </div>
  );
}
