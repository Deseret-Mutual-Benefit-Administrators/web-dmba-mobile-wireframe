/** "What you'll need" — shown before the form opens, to prevent mid-flow abandonment. */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { getCategoryRequirementKeys } from "../services/categoryGuidance";

interface WhatYouNeedChecklistProps {
  categoryCode?: string | null;
}

const BASE_REQUIREMENT_KEYS = [
  "spendingClaims.whatYouNeed.itemizedReceipt",
  "spendingClaims.whatYouNeed.serviceDate",
  "spendingClaims.whatYouNeed.amount",
  "spendingClaims.whatYouNeed.provider",
];

export function WhatYouNeedChecklist({ categoryCode = null }: WhatYouNeedChecklistProps) {
  const { t } = useTranslation();
  const extraKeys = categoryCode ? getCategoryRequirementKeys(categoryCode) : [];

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-1">{t("spendingClaims.whatYouNeed.title")}</span>
      <span className="text-sm text-gray-600 mb-4">{t("spendingClaims.whatYouNeed.subtitle")}</span>

      <div className="rounded-xl border p-4" style={{ borderColor: colors.border, backgroundColor: colors.brand.surface }}>
        {[...BASE_REQUIREMENT_KEYS, ...extraKeys].map((key) => (
          <div key={key} className="flex-row items-start mb-2.5">
            <span aria-hidden="true" style={{ marginTop: 2, display: "flex" }}>
              <Icon name="checkmark-circle-outline" size={16} color={colors.brand.accent} />
            </span>
            <span className="text-sm text-brand-primary ml-2.5 flex-1">{t(key)}</span>
          </div>
        ))}
      </div>

      <span className="text-xs text-gray-500 mt-3">{t("spendingClaims.whatYouNeed.footnote")}</span>
    </div>
  );
}
