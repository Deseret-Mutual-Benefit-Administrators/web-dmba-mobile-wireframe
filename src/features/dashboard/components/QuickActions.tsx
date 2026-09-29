import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

/**
 * Quick action grid — shortcut buttons on the dashboard.
 *
 * ADR-196: the Messages tile's unread badge reads the same count as the header
 * badge. The wireframe's header shows a fixed 2, so this does too.
 */

const PLACEHOLDER_UNREAD_COUNT = 2;

function formatUnreadBadge(count: number): string | null {
  if (count <= 0) return null;
  return count > 99 ? "99+" : String(count);
}

interface QuickAction {
  icon: string;
  label: string;
  route: string;
  /** Pre-formatted badge text, or undefined for no badge. */
  badge?: string;
  /** The unrounded number behind `badge`, for the a11y label. */
  badgeCount?: number;
  hint?: string;
}

export function QuickActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unreadCount = PLACEHOLDER_UNREAD_COUNT;
  const unreadBadge = formatUnreadBadge(unreadCount);

  const actions: QuickAction[] = [
    { icon: "card-outline", label: t("dashboard.viewIdCard"), route: "/id-card" },
    { icon: "search-outline", label: t("dashboard.findProvider"), route: "/search" },
    {
      icon: "document-text-outline",
      label: t("dashboard.submitClaim"),
      route: "/submit-claim",
      hint: t("claims.submitClaimHint"),
    },
    {
      icon: "mail-outline",
      label: t("dashboard.messages"),
      route: "/messages",
      badge: unreadBadge ?? undefined,
      badgeCount: unreadBadge ? unreadCount : undefined,
    },
    { icon: "headset-outline", label: t("dashboard.contactSupport"), route: "/contact" },
  ];

  return (
    <div className="flex-row flex-wrap gap-3">
      {actions.map((action) => (
        <button
          type="button"
          key={action.route}
          onClick={() => navigate(action.route)}
          className="flex-1 min-w-[45%] bg-brand-surface rounded-xl p-4 items-center shadow-sm active:opacity-80"
          aria-label={
            action.badgeCount !== undefined
              ? t("dashboard.quickActionUnread", { label: action.label, count: action.badgeCount })
              : action.label
          }
          title={action.hint}
        >
          <div className="relative mb-2">
            <div className="w-11 h-11 rounded-full bg-brand-accent/10 items-center justify-center">
              <Icon name={action.icon} size={22} color={colors.brand.accent} />
            </div>
            {action.badge !== undefined && (
              <div className="absolute -top-1 -right-1 bg-error rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <span className="text-white text-[10px] font-bold">{action.badge}</span>
              </div>
            )}
          </div>
          <span className="text-xs text-brand-primary text-center font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
