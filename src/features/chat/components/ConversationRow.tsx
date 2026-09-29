import { useTranslation } from "@/src/shared/i18n";
import { Badge } from "@/src/shared/components/Badge";
import { SwipeableRow, type SwipeRowAction } from "@/src/shared/components/SwipeableRow";
import { relativeTimeToken } from "@/src/features/messaging/services/threads";
import { formatTransactionDate, oneLine } from "@/src/features/messaging/services/format";
import { conversationStatusBadgeTone } from "../services/chatCore";
import {
  chatRowActions,
  chatRowActionKeys,
  swipeRowActionIcons,
  swipeRowActionTones,
  type ChatSwipeRowActionKind,
} from "@/src/shared/components/swipeRowActions";
import type { ConversationSummary } from "../types";

interface ConversationRowProps {
  conversation: ConversationSummary;
  onPress: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
  onUnarchive: (conversationId: string) => void;
}

/** One conversation-list row; swipe left archives or unarchives (ADR-208). */
export function ConversationRow({ conversation, onPress, onArchive, onUnarchive }: ConversationRowProps) {
  const { t } = useTranslation();

  const timeToken = relativeTimeToken(conversation.lastMessageAtUtc);
  const timeLabel =
    timeToken.unit === "date" && timeToken.isoTimestamp
      ? formatTransactionDate(timeToken.isoTimestamp)
      : t(`messaging.relativeTime.${timeToken.unit}`, { count: timeToken.count ?? 0 });

  const title = conversation.title.trim() || t("chat.newConversation");
  const isHandedOff = conversation.status === "handedOff";
  const rowLabel = isHandedOff ? `${title}, ${t("chat.status.handedOff")}` : title;

  const { trailing } = chatRowActions(conversation);

  const buildAction = (kind: ChatSwipeRowActionKind): SwipeRowAction => {
    const handlers: Record<ChatSwipeRowActionKind, () => void> = {
      archive: () => onArchive(conversation.id),
      unarchive: () => onUnarchive(conversation.id),
    };
    return {
      key: kind,
      label: t(chatRowActionKeys[kind].label),
      hint: t(chatRowActionKeys[kind].hint),
      icon: swipeRowActionIcons[kind],
      tone: swipeRowActionTones[kind],
      onPress: handlers[kind],
    };
  };

  return (
    <SwipeableRow trailing={buildAction(trailing)} className="mb-2">
      {() => (
        <button
          type="button"
          onClick={() => onPress(conversation.id)}
          className="flex-row items-start px-4 py-3.5 bg-brand-surface rounded-xl active:opacity-80"
          aria-label={rowLabel}
          style={{ textAlign: "left", paddingRight: 36 }}
        >
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="flex-row items-center justify-between mb-1">
              <span className="flex-1 text-sm font-medium text-brand-primary mr-2" style={{ ...oneLine, minWidth: 0 }}>
                {title}
              </span>
              <span className="text-xs text-gray-500">{timeLabel}</span>
            </div>
            {isHandedOff && (
              <Badge label={t("chat.status.handedOff")} tone={conversationStatusBadgeTone(conversation.status)} />
            )}
          </div>
        </button>
      )}
    </SwipeableRow>
  );
}
