import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { colors } from "@/src/shared/theme/colors";
import {
  useBenefitCards,
  useBenefitCardDetail,
  useCardStatusAction,
  useRequestReplacementCard,
} from "../api/accountsQueries";
import {
  getCardStatusColors,
  getCardStatusLabelKey,
  formatTransactionDate,
  getAvailableCardActions,
  deriveCardActionErrorKind,
} from "../services/accountTransforms";
import { CoveredDependents } from "./CoveredDependents";
import type { BenefitCard, CardActionKind } from "../types";

/**
 * Benefit (debit) card list. Each row expands in place to show card detail and,
 * for cards not already inactive, the FA-5 status actions (ADR-106).
 *
 * Web: the app's native confirm alerts are `window.confirm` / `window.alert`,
 * and pull-to-refresh is not ported.
 */
export function BenefitCardsList() {
  const { t } = useTranslation();
  const { data: cards, isLoading, isError, refetch } = useBenefitCards();

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background h-full">
        <Spinner size="large" tone="accent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background px-6 h-full">
        <EmptyState
          icon={<Icon name="alert-circle-outline" size={48} color={colors.error} />}
          title={t("financialAccounts.cards.loadError")}
          action={{ label: t("common.retry"), onPress: () => refetch() }}
        />
      </div>
    );
  }

  const list = cards ?? [];

  return (
    <div className="flex-1 bg-brand-background">
      <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 24 }}>
        {list.length > 0 ? (
          <span className="text-lg font-semibold text-brand-primary mb-3">{t("financialAccounts.cards.title")}</span>
        ) : null}
        {list.length === 0 ? (
          <div className="items-center justify-center py-16 px-6">
            <span aria-hidden="true" style={{ display: "flex" }}>
              <Icon name="card-outline" size={48} color={colors.neutral[500]} />
            </span>
            <span className="text-gray-500 mt-4 text-center">{t("financialAccounts.cards.empty")}</span>
          </div>
        ) : (
          list.map((item) => <BenefitCardRow key={item.cardId} card={item} />)
        )}
        <CoveredDependents />
      </div>
    </div>
  );
}

interface BenefitCardRowProps {
  card: BenefitCard;
}

function BenefitCardRow({ card }: BenefitCardRowProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { data: detail, isLoading, isError } = useBenefitCardDetail(card.cardId, { enabled: expanded });

  const statusAction = useCardStatusAction();
  const replacementAction = useRequestReplacementCard();
  const [actingOn, setActingOn] = useState<CardActionKind | "replace" | null>(null);
  const isActionPending = actingOn !== null;

  const statusColors = getCardStatusColors(card.status);
  const statusLabel = t(getCardStatusLabelKey(card.status));

  const rowLabel = t("financialAccounts.cards.cardEnding", { last4: card.last4 });

  const availableStatusActions = getAvailableCardActions(card.status);
  // Replacement is member-level, offered from the participant's own card row only.
  const showReplacement = !card.isDependent;

  function handleActionError(error: unknown) {
    const kind = deriveCardActionErrorKind(error);
    window.alert(
      `${t("financialAccounts.cards.actions.errorTitle")}\n\n${t(
        kind === "serviceUnavailable" ? "financialAccounts.cards.actions.serviceUnavailable" : "financialAccounts.cards.actions.errorBody"
      )}`
    );
  }

  function confirmStatusAction(action: CardActionKind) {
    const copy =
      action === "reportLostStolen"
        ? {
            title: "financialAccounts.cards.actions.reportLostStolenConfirmTitle",
            body: "financialAccounts.cards.actions.reportLostStolenConfirmBody",
            success: "financialAccounts.cards.actions.reportLostStolenSuccess",
          }
        : {
            title: "financialAccounts.cards.actions.deactivateConfirmTitle",
            body: "financialAccounts.cards.actions.deactivateConfirmBody",
            success: "financialAccounts.cards.actions.deactivateSuccess",
          };

    if (!window.confirm(`${t(copy.title)}\n\n${t(copy.body)}`)) return;
    setActingOn(action);
    statusAction.mutate(
      { cardId: card.cardId, action },
      {
        onSuccess: () => window.alert(t(copy.success)),
        onError: handleActionError,
        onSettled: () => setActingOn(null),
      }
    );
  }

  function confirmReplacement() {
    if (
      !window.confirm(
        `${t("financialAccounts.cards.actions.requestReplacementConfirmTitle")}\n\n${t("financialAccounts.cards.actions.requestReplacementConfirmBody")}`
      )
    )
      return;
    setActingOn("replace");
    replacementAction.mutate(
      {},
      {
        onSuccess: () => window.alert(t("financialAccounts.cards.actions.requestReplacementSuccess")),
        onSettled: () => setActingOn(null),
      }
    );
  }

  return (
    // A div with role="button": the row contains the action buttons, and a
    // button inside a button is invalid HTML.
    <div
      onClick={() => setExpanded((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) setExpanded((prev) => !prev);
      }}
      tabIndex={0}
      className="bg-brand-surface rounded-2xl mb-3 overflow-hidden shadow-sm"
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={rowLabel}
      aria-expanded={expanded}
    >
      <div className="p-4 flex-row items-center justify-between">
        <div className="flex-1 mr-3">
          <div className="flex-row items-center flex-wrap">
            <span className="text-base font-semibold text-brand-primary mr-2">{rowLabel}</span>
            {card.isDependent && (
              <div className="bg-blue-100 rounded-md px-2 py-0.5 mr-2 mb-1" role="text" aria-label={t("financialAccounts.cards.dependent")}>
                <span className="text-xs font-medium text-blue-800">{t("financialAccounts.cards.dependent")}</span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500 mt-0.5">{card.holderName}</span>
          {card.issueDate && (
            <span className="text-xs text-gray-500 mt-1">
              {t("financialAccounts.cards.issued", { date: formatTransactionDate(card.issueDate) })}
            </span>
          )}
        </div>

        <div className="items-end">
          <div className={`px-2 py-0.5 rounded-full mb-2 ${statusColors.bg}`} role="text" aria-label={statusLabel}>
            <span className={`text-xs font-medium ${statusColors.text}`}>{statusLabel}</span>
          </div>
          <span aria-hidden="true" style={{ display: "flex" }}>
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.neutral[500]} />
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          {isLoading ? (
            <div className="items-center py-4">
              <Spinner size="small" tone="accent" />
            </div>
          ) : isError || !detail ? (
            <span className="text-xs text-error py-2">{t("financialAccounts.cards.loadError")}</span>
          ) : (
            <div>
              {detail.isPrimary && (
                <div className="flex-row justify-between py-1.5">
                  <span className="text-xs text-gray-500">{t("financialAccounts.cards.primary")}</span>
                  <Icon name="checkmark-circle" size={16} color={colors.tone.success.icon} />
                </div>
              )}
              {detail.effectiveDate && (
                <div className="flex-row justify-between py-1.5">
                  <span className="text-xs text-gray-500">{t("financialAccounts.cards.effective")}</span>
                  <span className="text-xs text-brand-primary font-medium">{formatTransactionDate(detail.effectiveDate)}</span>
                </div>
              )}
              {detail.expireDate && (
                <div className="flex-row justify-between py-1.5">
                  <span className="text-xs text-gray-500">{t("financialAccounts.cards.expires")}</span>
                  <span className="text-xs text-brand-primary font-medium">{formatTransactionDate(detail.expireDate)}</span>
                </div>
              )}
              {detail.activationDate && (
                <div className="flex-row justify-between py-1.5">
                  <span className="text-xs text-gray-500">{t("financialAccounts.cards.activated")}</span>
                  <span className="text-xs text-brand-primary font-medium">{formatTransactionDate(detail.activationDate)}</span>
                </div>
              )}
            </div>
          )}

          {(availableStatusActions.length > 0 || showReplacement) && (
            <div className="mt-2 pt-3 border-t border-gray-100">
              {availableStatusActions.includes("reportLostStolen") && (
                <CardActionButton
                  label={t("financialAccounts.cards.actions.reportLostStolen")}
                  iconName="alert-circle-outline"
                  destructive
                  pending={actingOn === "reportLostStolen"}
                  disabled={isActionPending}
                  onPress={() => confirmStatusAction("reportLostStolen")}
                />
              )}
              {availableStatusActions.includes("deactivate") && (
                <CardActionButton
                  label={t("financialAccounts.cards.actions.deactivate")}
                  iconName="close-circle-outline"
                  destructive
                  pending={actingOn === "deactivate"}
                  disabled={isActionPending}
                  onPress={() => confirmStatusAction("deactivate")}
                />
              )}
              {showReplacement && (
                <CardActionButton
                  label={t("financialAccounts.cards.actions.requestReplacement")}
                  iconName="refresh-outline"
                  pending={actingOn === "replace"}
                  disabled={isActionPending}
                  onPress={confirmReplacement}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CardActionButtonProps {
  label: string;
  iconName: string;
  onPress: () => void;
  pending: boolean;
  disabled: boolean;
  destructive?: boolean;
}

function CardActionButton({ label, iconName, onPress, pending, disabled, destructive = false }: CardActionButtonProps) {
  const isDisabled = disabled || pending;
  const bgClass = destructive ? "bg-red-50" : "bg-blue-50";
  const textClass = destructive ? "text-red-700" : "text-blue-700";
  const iconColor = destructive ? colors.tone.error.icon : colors.tone.info.icon;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      disabled={isDisabled}
      className={`flex-row items-center justify-center py-2.5 rounded-xl mb-2 active:opacity-80 ${bgClass}`}
      style={isDisabled ? { opacity: 0.5 } : undefined}
      aria-label={label}
      aria-disabled={isDisabled}
    >
      {pending ? (
        <Spinner size="small" tone="accent" />
      ) : (
        <>
          <span aria-hidden="true" style={{ marginRight: 6, display: "flex" }}>
            <Icon name={iconName} size={16} color={iconColor} />
          </span>
          <span className={`text-sm font-semibold ${textClass}`}>{label}</span>
        </>
      )}
    </button>
  );
}
