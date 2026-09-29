import { useCallback, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { Label } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import { placeholderDisplayPreferences } from "../placeholder";
import { DEFAULT_CARD_ORDER, reconcileOrderWithDefaults } from "../services/reconcileCardOrder";

// Re-export so callers that previously imported from here keep working.
export { DEFAULT_CARD_ORDER };

/** Home indicator inset — the app pads the footer by `insets.bottom + 8`. */
const INSETS_BOTTOM = 34;

/**
 * Dashboard Customization screen. The app reorders with a long-press drag
 * (react-native-draggable-flatlist); here the handle is an HTML drag source,
 * and ArrowUp / ArrowDown on the focused handle move the row, standing in for
 * the app's VoiceOver increment / decrement actions.
 *
 * `?state=loading` shows the preferences-loading state. Save always succeeds
 * and goes back; the app's save-error toast is not reachable.
 */
export function DashboardCustomization() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoading = new URLSearchParams(useLocation().search).get("state") === "loading";

  const serverOrder = reconcileOrderWithDefaults(placeholderDisplayPreferences.cardOrder);
  const serverHidden = placeholderDisplayPreferences.hiddenCards;

  const [localOrder, setLocalOrder] = useState<string[]>(serverOrder);
  const [localHidden, setLocalHidden] = useState<string[]>(serverHidden);
  const [isDirty, setIsDirty] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const cardLabel = useCallback((cardId: string) => t(`dashboard.customization.cards.${cardId}`), [t]);

  const moveCard = useCallback((fromIndex: number, direction: -1 | 1) => {
    setLocalOrder((prev) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setIsDirty(true);
  }, []);

  const toggleVisibility = useCallback((cardId: string) => {
    setLocalHidden((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]));
    setIsDirty(true);
  }, []);

  function dragOver(targetId: string) {
    if (!dragging || dragging === targetId) return;
    setLocalOrder((prev) => {
      const next = prev.filter((id) => id !== dragging);
      next.splice(prev.indexOf(targetId), 0, dragging);
      return next;
    });
    setIsDirty(true);
  }

  /** Stand-in for the app's `useDiscardGuard`: confirm before leaving with edits. */
  function handleBack() {
    if (isDirty && !window.confirm(`${t("dashboard.customization.discardGuard.title")}\n\n${t("dashboard.customization.discardGuard.message")}`)) {
      return;
    }
    navigate(-1);
  }

  function handleSave() {
    setIsDirty(false);
    navigate(-1);
  }

  function handleDiscard() {
    setLocalOrder(serverOrder);
    setLocalHidden(serverHidden);
    setIsDirty(false);
    navigate(-1);
  }

  function handleReset() {
    setLocalOrder(DEFAULT_CARD_ORDER);
    setLocalHidden([]);
    setIsDirty(true);
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={t("dashboard.customization.title")} />
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
          <Label className="mt-2">{t("common.loading")}</Label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      <ScreenHeader title={t("dashboard.customization.title")} onBack={handleBack} />

      <div className="px-4 pt-4 pb-2">
        <Label>{t("dashboard.customization.dragHint")}</Label>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0, paddingBottom: 16, paddingTop: 4 }}>
        {localOrder.map((cardId, index) => {
          const label = cardLabel(cardId);
          const isHidden = localHidden.includes(cardId);
          const isActive = dragging === cardId;
          const total = localOrder.length;

          function handleKey(event: KeyboardEvent) {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              moveCard(index, -1);
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              moveCard(index, 1);
            }
          }

          return (
            <div
              key={cardId}
              className="rounded-xl p-3 mb-2 mx-4 flex-row items-center"
              onDragOver={(e) => {
                e.preventDefault();
                dragOver(cardId);
              }}
              style={{
                backgroundColor: colors.brand.surface,
                opacity: isHidden ? 0.5 : 1,
                boxShadow: isActive ? "0 4px 6px rgba(0,0,0,0.18)" : "none",
              }}
            >
              {/* Drag handle — three-bar reorder icon. */}
              <button
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  setDragging(cardId);
                }}
                onDragEnd={() => setDragging(null)}
                onKeyDown={handleKey}
                className="p-2 mr-1"
                style={{ cursor: "grab" }}
                role="slider"
                aria-label={t("dashboard.customization.dragHandle", { card: label })}
                aria-description={t("dashboard.customization.dragHint")}
                aria-valuetext={t("dashboard.customization.positionOf", { position: index + 1, total })}
                aria-valuenow={index + 1}
                aria-valuemin={1}
                aria-valuemax={total}
              >
                <Icon name="reorder-three-outline" size={24} color={colors.neutral[500]} />
              </button>

              {/* Card label */}
              <span className="flex-1 text-[15px] font-medium text-brand-primary">{label}</span>

              {/* Visibility toggle — iOS switch geometry */}
              <button
                type="button"
                role="switch"
                aria-checked={!isHidden}
                aria-label={t("dashboard.customization.toggleCardVisibility", { card: label })}
                onClick={() => toggleVisibility(cardId)}
                style={{
                  width: 51,
                  height: 31,
                  borderRadius: 999,
                  backgroundColor: !isHidden ? colors.brand.accent : colors.neutral[300],
                  transition: "background-color 150ms",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: !isHidden ? 22 : 2,
                    width: 27,
                    height: 27,
                    borderRadius: 999,
                    backgroundColor: colors.brand.surface,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "left 150ms",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer action bar — in normal flow so the list shrinks above it. */}
      <div className="bg-brand-surface border-t border-gray-200 px-4 pt-4 gap-2.5" style={{ paddingBottom: INSETS_BOTTOM + 8 }}>
        <Button label={t("dashboard.customization.saveChanges")} onPress={handleSave} disabled={!isDirty} fullWidth />

        <Button label={t("dashboard.customization.discardChanges")} onPress={handleDiscard} variant="secondary" fullWidth />

        <button type="button" onClick={handleReset} className="py-2.5 items-center" aria-label={t("dashboard.customization.resetDefault")}>
          <Label>{t("dashboard.customization.resetDefault")}</Label>
        </button>
      </div>
    </div>
  );
}
