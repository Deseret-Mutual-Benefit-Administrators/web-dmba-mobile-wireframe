/**
 * The first screen: which of two different things happened? Framed by outcome —
 * "no money moves" versus "money moves". The card option stays visible, disabled
 * with a reason, when no card is eligible.
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { IconChip } from "@/src/shared/components/IconChip";
import type { ClaimPath } from "../services/claimFlowSteps";

interface ClaimPathForkProps {
  selected: ClaimPath | null;
  onSelect: (path: ClaimPath) => void;
  /** Whether any account has a card that could have been charged. */
  cardEligible: boolean;
}

interface PathOption {
  path: ClaimPath;
  icon: string;
  titleKey: string;
  bodyKey: string;
  outcomeKey: string;
  disabled: boolean;
  disabledReasonKey: string | null;
}

export function ClaimPathFork({ selected, onSelect, cardEligible }: ClaimPathForkProps) {
  const { t } = useTranslation();

  const options: PathOption[] = [
    {
      path: "cardCharge",
      icon: "card-outline",
      titleKey: "spendingClaims.fork.cardCharge.title",
      bodyKey: "spendingClaims.fork.cardCharge.body",
      outcomeKey: "spendingClaims.fork.cardCharge.outcome",
      disabled: !cardEligible,
      disabledReasonKey: cardEligible ? null : "spendingClaims.fork.cardCharge.noCard",
    },
    {
      path: "reimbursement",
      icon: "cash-outline",
      titleKey: "spendingClaims.fork.reimbursement.title",
      bodyKey: "spendingClaims.fork.reimbursement.body",
      outcomeKey: "spendingClaims.fork.reimbursement.outcome",
      disabled: false,
      disabledReasonKey: null,
    },
  ];

  return (
    <div className="px-4 pt-2" role="radiogroup">
      <span className="text-lg font-semibold text-brand-primary mb-1">{t("spendingClaims.fork.question")}</span>
      <span className="text-sm text-gray-600 mb-4">{t("spendingClaims.fork.subtitle")}</span>

      {options.map((option) => {
        const isSelected = selected === option.path;
        return (
          <button
            type="button"
            key={option.path}
            onClick={() => onSelect(option.path)}
            disabled={option.disabled}
            className="active:opacity-70"
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: option.disabled ? colors.neutral[50] : colors.brand.surface,
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? colors.brand.accent : colors.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              opacity: option.disabled ? 0.7 : 1,
            }}
            role="radio"
            aria-label={`${t(option.titleKey)}. ${t(option.outcomeKey)}`}
            aria-checked={isSelected}
            aria-disabled={option.disabled}
          >
            <div className="mr-3" aria-hidden="true">
              <IconChip icon={<Icon name={option.icon} size={20} color={colors.brand.accent} />} />
            </div>

            <div style={{ flex: 1 }}>
              <span className="text-base font-semibold text-brand-primary">{t(option.titleKey)}</span>
              <span className="text-sm text-gray-600 mt-0.5">{t(option.bodyKey)}</span>
              <span className="text-xs mt-1.5 font-medium" style={{ color: colors.brand.secondary }}>
                {t(option.outcomeKey)}
              </span>
              {option.disabledReasonKey && (
                <span className="text-xs mt-1.5" style={{ color: colors.error }}>
                  {t(option.disabledReasonKey)}
                </span>
              )}
            </div>

            {isSelected && (
              <span aria-hidden="true" style={{ display: "flex" }}>
                <Icon name="checkmark-circle" size={22} color={colors.brand.accent} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
