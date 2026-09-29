import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { oneLine } from "@/src/features/messaging/services/format";
import type { ChatThreadHeaderContext } from "./ChatThreadView";

export interface AssistantSheetHeaderProps extends ChatThreadHeaderContext {
  onNewChat: () => void;
  onClose: () => void;
}

/**
 * The assistant sheet's own title bar (ADR-173) — not `ScreenHeader`: no back
 * chevron inside a sheet. Overflow menu (once a conversation exists), new
 * chat, close.
 *
 * Web note: `position: relative; z-index: 2` lets this opaque bar sit over the
 * wireframe's `ModalSheet` formSheet "Close" text button, which would
 * otherwise overlap the ✕ below. The ✕ here is the sheet's close control, as
 * in the app.
 */
export function AssistantSheetHeader({ title, canOpenMenu, openMenu, onNewChat, onClose }: AssistantSheetHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-brand-surface border-b border-gray-100" style={{ zIndex: 2 }}>
      {/* Decorative Android-style grabber; the app renders it on every platform. */}
      <div className="self-center mt-2 h-1 w-9 rounded-full bg-gray-300" aria-hidden="true" />

      <div className="flex-row items-center px-4 pt-3 pb-3">
        <h2 className="flex-1 text-lg font-semibold text-brand-primary" style={{ ...oneLine, minWidth: 0 }}>
          {title}
        </h2>

        {canOpenMenu && (
          <button type="button" onClick={openMenu} style={{ padding: 8 }} aria-label={t("chat.menu.label")} title={t("chat.menu.hint")}>
            <Icon name="ellipsis-horizontal" size={22} color={colors.brand.accent} />
          </button>
        )}

        <button type="button" onClick={onNewChat} style={{ padding: 8 }} aria-label={t("chat.sheet.newChat")} title={t("chat.sheet.newChatHint")}>
          <Icon name="add-circle-outline" size={22} color={colors.brand.accent} />
        </button>

        <button type="button" onClick={onClose} style={{ padding: 8 }} aria-label={t("common.close")} title={t("chat.sheet.closeHint")}>
          <Icon name="close" size={22} color={colors.brand.accent} />
        </button>
      </div>
    </div>
  );
}
