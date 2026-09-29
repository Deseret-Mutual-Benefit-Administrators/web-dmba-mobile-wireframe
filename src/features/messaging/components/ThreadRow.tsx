import { useTranslation } from "@/src/shared/i18n";
import { Badge } from "@/src/shared/components/Badge";
import { SwipeableRow, type SwipeRowAction } from "@/src/shared/components/SwipeableRow";
import { colors } from "@/src/shared/theme/colors";
import { formatTransactionDate, oneLine, twoLines } from "../services/format";
import { previewLine, relativeTimeToken } from "../services/threads";
import { topicLabelKey } from "../services/topics";
import {
  messagingRowActions,
  messagingRowActionKeys,
  swipeRowActionIcons,
  swipeRowActionTones,
  type SwipeRowActionKind,
} from "@/src/shared/components/swipeRowActions";
import type { MessageThreadSummary } from "../types";

interface ThreadRowProps {
  thread: MessageThreadSummary;
  onPress: (threadId: string) => void;
  onArchive: (threadId: string) => void;
  onUnarchive: (threadId: string) => void;
  onMarkUnread: (threadId: string) => void;
  onMarkRead: (threadId: string) => void;
}

/**
 * One inbox row. Swipe left archives/unarchives; swipe right toggles read on
 * an Open thread staff have replied to (ADR-208). On the web the shared
 * `SwipeableRow` reveals both through its "⋯" toggle.
 */
export function ThreadRow({ thread, onPress, onArchive, onUnarchive, onMarkUnread, onMarkRead }: ThreadRowProps) {
  const { t } = useTranslation();

  const timeToken = relativeTimeToken(thread.lastMessageAtUtc);
  const timeLabel =
    timeToken.unit === "date" && timeToken.isoTimestamp
      ? formatTransactionDate(timeToken.isoTimestamp)
      : t(`messaging.relativeTime.${timeToken.unit}`, { count: timeToken.count ?? 0 });

  const subjectLine = thread.subject.trim() || t("messaging.inbox.noSubject");
  const preview = previewLine(thread.lastMessagePreview);

  const accessibilityLabel = t("messaging.inbox.threadRowLabel", {
    subject: subjectLine,
    unread: thread.hasUnread ? t("messaging.inbox.unreadSuffix") : "",
  });

  const buildAction = (kind: SwipeRowActionKind): SwipeRowAction => {
    const handlers: Record<SwipeRowActionKind, () => void> = {
      archive: () => onArchive(thread.id),
      unarchive: () => onUnarchive(thread.id),
      markUnread: () => onMarkUnread(thread.id),
      markRead: () => onMarkRead(thread.id),
    };
    return {
      key: kind,
      label: t(messagingRowActionKeys[kind].label),
      hint: t(messagingRowActionKeys[kind].hint),
      icon: swipeRowActionIcons[kind],
      tone: swipeRowActionTones[kind],
      onPress: handlers[kind],
    };
  };

  const { leading, trailing } = messagingRowActions({
    isArchived: thread.isArchived,
    isUnread: thread.hasUnread,
    hasStaffReply: thread.hasStaffReply,
  });

  return (
    <SwipeableRow leading={leading ? buildAction(leading) : undefined} trailing={buildAction(trailing)} className="mb-2">
      {() => (
        <button
          type="button"
          onClick={() => onPress(thread.id)}
          className="flex-row items-start px-4 py-3.5 bg-brand-surface rounded-xl active:opacity-80"
          aria-label={accessibilityLabel}
          style={{ textAlign: "left", paddingRight: 36 }}
        >
          {/* Unread dot — decorative; the row's own label already carries the unread state. */}
          <div
            className="w-2 h-2 rounded-full mt-2 mr-3"
            style={{ backgroundColor: thread.hasUnread ? colors.brand.accent : "transparent" }}
            aria-hidden="true"
          />

          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="flex-row items-center justify-between mb-1">
              <span
                className={`flex-1 text-sm mr-2 ${thread.hasUnread ? "font-bold text-brand-primary" : "font-medium text-brand-primary"}`}
                style={{ ...oneLine, minWidth: 0 }}
              >
                {subjectLine}
              </span>
              <span className="text-xs text-gray-500">{timeLabel}</span>
            </div>

            <div className="flex-row items-center gap-2 mb-1">
              <Badge label={t(topicLabelKey(thread.topic))} tone="info" />
              {thread.regardingDisplayName && (
                <span className="text-xs text-gray-500" style={oneLine}>
                  {t("messaging.inbox.regarding", { name: thread.regardingDisplayName })}
                </span>
              )}
            </div>

            {preview !== "" && (
              <span className="text-xs text-gray-500" style={twoLines}>
                {preview}
              </span>
            )}
          </div>
        </button>
      )}
    </SwipeableRow>
  );
}
