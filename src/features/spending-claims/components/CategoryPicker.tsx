/**
 * Service-category chips — the most consequential choice in the flow: the vendor
 * routes the claim to a funding account from this code. No account picker exists
 * (ADR-108). Categories come from the template, never a hardcoded list.
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import {
  getCategoryExamplesKey,
  getCategoryHelperKey,
  getCategoryIconName,
  getCategoryLabelKey,
  isPayrollFundedCategory,
} from "../services/categoryGuidance";
import type { ClaimServiceCategory } from "../types";

interface CategoryPickerProps {
  categories: ClaimServiceCategory[];
  selected: string;
  onSelect: (code: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  const { t } = useTranslation();

  return (
    <div className="px-4 pt-2" role="radiogroup">
      <span className="text-lg font-semibold text-brand-primary mb-1">{t("spendingClaims.category.question")}</span>
      <span className="text-sm text-gray-600 mb-4">{t("spendingClaims.category.subtitle")}</span>

      {categories.map((category) => {
        const isSelected = selected === category.code;
        const labelKey = getCategoryLabelKey(category.code);
        const label = labelKey ? t(labelKey) : category.description?.trim() || category.code;
        const helperKey = getCategoryHelperKey(category.code);
        const examplesKey = getCategoryExamplesKey(category.code);

        return (
          <button
            type="button"
            key={category.code}
            onClick={() => onSelect(category.code)}
            className="active:opacity-70"
            style={{
              backgroundColor: colors.brand.surface,
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? colors.brand.accent : colors.border,
              borderRadius: 14,
              padding: 14,
              marginBottom: 10,
            }}
            role="radio"
            aria-label={examplesKey ? `${label}. ${t(examplesKey)}` : label}
            aria-checked={isSelected}
          >
            <div className="flex-row items-center">
              <span aria-hidden="true" style={{ display: "flex" }}>
                <Icon name={getCategoryIconName(category.code)} size={20} color={isSelected ? colors.brand.accent : colors.brand.secondary} />
              </span>
              <span className="text-base font-semibold text-brand-primary ml-2.5 flex-1">{label}</span>
              {isSelected && (
                <span aria-hidden="true" style={{ display: "flex" }}>
                  <Icon name="checkmark-circle" size={20} color={colors.brand.accent} />
                </span>
              )}
            </div>

            {examplesKey && <span className="text-xs text-gray-600 mt-1.5 ml-[30px]">{t(examplesKey)}</span>}

            {helperKey && (
              <span className="text-xs mt-1 ml-[30px]" style={{ color: colors.brand.secondary }}>
                {t(helperKey)}
              </span>
            )}

            {isSelected && isPayrollFundedCategory(category.code) && (
              <div className="flex-row items-start rounded-lg px-2.5 py-2 mt-2.5 bg-warning-tint">
                <span aria-hidden="true" style={{ marginTop: 1, display: "flex" }}>
                  <Icon name="alert-circle-outline" size={14} color={colors.tone.warning.icon} />
                </span>
                <span className="text-xs ml-2 flex-1" style={{ color: colors.tone.warning.icon }}>
                  {t("spendingClaims.category.payrollFundedNote")}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
