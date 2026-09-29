/**
 * The charge picker for card-charge substantiation — radio rows carrying
 * merchant, date and amount, the three things matched against the receipt.
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Caption } from "@/src/shared/components/Typography";
import { Button } from "@/src/shared/components/Button";
import { formatCurrency, formatTransactionDate } from "@/src/features/financial-accounts/services/accountTransforms";
import { oneLine } from "@/src/features/financial-accounts/components/textStyles";
import type { SubstantiationCandidate } from "../services/cardSubstantiation";

interface UnsubstantiatedChargeListProps {
  charges: SubstantiationCandidate[];
  selectedTransactionId: string | null;
  onSelect: (transactionId: string) => void;
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  disabled: boolean;
}

export function UnsubstantiatedChargeList({
  charges,
  selectedTransactionId,
  onSelect,
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  disabled,
}: UnsubstantiatedChargeListProps) {
  const { t } = useTranslation();

  if (charges.length === 0) {
    return (
      <div className="items-center">
        <EmptyState
          icon={<Icon name="checkmark-done-circle-outline" size={48} color={colors.neutral[500]} />}
          title={t("spendingClaims.substantiate.empty.title")}
          message={t("spendingClaims.substantiate.empty.body")}
        />
        <Caption className="text-center px-8">{t("spendingClaims.substantiate.empty.reimbursementHint")}</Caption>
        {canLoadMore && <LoadMoreButton isLoading={isLoadingMore} onPress={onLoadMore} disabled={disabled} />}
      </div>
    );
  }

  return (
    <div className="px-4 pt-2" role="radiogroup">
      <h2 className="text-lg font-semibold text-brand-primary mb-1">{t("spendingClaims.substantiate.pick.question")}</h2>
      <span className="text-sm text-gray-600 mb-4">{t("spendingClaims.substantiate.pick.subtitle")}</span>

      {charges.map((charge) => {
        const isSelected = selectedTransactionId === charge.id;
        const merchant = charge.merchantName ?? charge.description;
        const amount = formatCurrency(Math.abs(charge.amount));
        const date = formatTransactionDate(charge.date);

        return (
          <button
            type="button"
            key={charge.id}
            onClick={() => onSelect(charge.id)}
            disabled={disabled}
            className="active:opacity-70"
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.brand.surface,
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? colors.brand.accent : colors.border,
              borderRadius: 16,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 14,
              paddingBottom: 14,
              marginBottom: 10,
              opacity: disabled ? 0.6 : 1,
            }}
            role="radio"
            aria-label={t("spendingClaims.substantiate.pick.chargeRow", { merchant, amount, date })}
            aria-checked={isSelected}
            aria-disabled={disabled}
          >
            <div style={{ flex: 1, paddingRight: 12 }}>
              <span className="text-sm font-semibold text-brand-primary" style={oneLine}>
                {merchant}
              </span>
              {charge.merchantName ? (
                <span className="text-xs text-gray-500 mt-0.5" style={oneLine}>
                  {charge.description}
                </span>
              ) : null}
              <Caption className="mt-0.5">{date}</Caption>
            </div>

            <span className="text-sm font-bold text-brand-primary">{amount}</span>

            {isSelected && (
              <span aria-hidden="true" style={{ marginLeft: 10, display: "flex" }}>
                <Icon name="checkmark-circle" size={22} color={colors.brand.accent} />
              </span>
            )}
          </button>
        );
      })}

      {canLoadMore && <LoadMoreButton isLoading={isLoadingMore} onPress={onLoadMore} disabled={disabled} />}
    </div>
  );
}

interface LoadMoreButtonProps {
  isLoading: boolean;
  onPress: () => void;
  disabled: boolean;
}

function LoadMoreButton({ isLoading, onPress, disabled }: LoadMoreButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      label={t("spendingClaims.substantiate.pick.showOlder")}
      onPress={onPress}
      disabled={disabled}
      loading={isLoading}
      className="self-center mt-2"
    />
  );
}
