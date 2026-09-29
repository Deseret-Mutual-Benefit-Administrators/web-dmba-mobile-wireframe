/**
 * Port of `app/account/[type].tsx` — one spending account and its plan year,
 * `/account/fsa?planYear=1`. `type` is `hsa` | `fsa` | `lpfsa` | `depc`; any
 * other slug (the source handles no 401(k), MRP or life-insurance detail)
 * renders the not-found state.
 */
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { AccountDetailScreen, toSpendingAccountType } from "./AccountDetailScreen";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { colors } from "@/src/shared/theme/colors";

export function AccountRoute() {
  const { type } = useParams<{ type?: string }>();
  const [params] = useSearchParams();
  const planYear = params.get("planYear");
  const { t } = useTranslation();

  const accountType = toSpendingAccountType(type);

  if (accountType === null) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <ScreenHeader title={t("financialAccounts.accountDetail.notFoundTitle")} />
        <div className="flex-1 items-center justify-center px-6">
          <span aria-hidden="true" style={{ display: "flex" }}>
            <Icon name="help-circle-outline" size={48} color={colors.neutral[500]} />
          </span>
          <span className="text-gray-500 mt-3 text-center">{t("financialAccounts.accountDetail.notFound")}</span>
        </div>
      </div>
    );
  }

  const parsedPlanYear = Number.parseInt(planYear ?? "", 10);
  const resolvedPlanYear = Number.isFinite(parsedPlanYear) && parsedPlanYear > 0 ? parsedPlanYear : 0;

  // Keyed so a push from one account to another resets search and filters.
  return <AccountDetailScreen key={`${accountType}-${resolvedPlanYear}`} type={accountType} planYear={resolvedPlanYear} />;
}
