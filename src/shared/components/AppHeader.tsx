import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

/** Placeholder unread count — the app reads it live from the messaging API. */
const PLACEHOLDER_UNREAD_COUNT = 2;

/** Badge text rule: nothing at 0, "99+" above 99 (the app's `formatUnreadBadge`). */
function formatUnreadBadge(count: number): string | null {
  if (count <= 0) return null;
  return count > 99 ? "99+" : String(count);
}

/**
 * Persistent header on every tab screen: logo left (the Home affordance),
 * messages + ID card icon buttons right. Frosted `bg-white/90`.
 * The top safe-area inset is drawn by PhoneFrame's status bar, so none here.
 */
export function AppHeader({ unreadCount = PLACEHOLDER_UNREAD_COUNT }: { unreadCount?: number }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const badgeText = formatUnreadBadge(unreadCount);

  return (
    <div className="bg-white/90 border-b border-gray-100 backdrop-blur">
      <div className="flex-row items-center justify-between px-4 py-3">
        <button type="button" onClick={() => navigate("/")} className="rounded-lg active:opacity-70" aria-label={t("appHeader.homeLabel")}>
          <img src="/images/dmba-logo.png" alt="" style={{ width: 100, height: 41, objectFit: "contain" }} />
        </button>

        <div className="flex-row items-center gap-1">
          <button
            type="button"
            onClick={() => navigate("/messages")}
            className="relative p-2.5 rounded-full active:bg-gray-100"
            aria-label={badgeText !== null ? t("appHeader.messagesUnreadLabel", { count: unreadCount }) : t("appHeader.messagesLabel")}
          >
            <Icon name="mail-outline" size={22} color={colors.brand.primary} />
            {badgeText !== null && (
              <div
                className="absolute -top-0.5 -right-0.5 bg-error rounded-full min-w-[20px] h-5 items-center justify-center px-1"
                aria-hidden="true"
              >
                <span className="text-white text-xs font-bold">{badgeText}</span>
              </div>
            )}
          </button>

          <button type="button" onClick={() => navigate("/id-card")} className="p-2.5 rounded-full active:bg-gray-100" aria-label={t("appHeader.idCardLabel")}>
            <Icon name="card-outline" size={22} color={colors.brand.primary} />
          </button>
        </div>
      </div>
    </div>
  );
}
