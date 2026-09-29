import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { colors } from "@/src/shared/theme/colors";
import { useChatList, type ChatListFilter } from "../hooks/useChatList";
import { ConversationRow } from "./ConversationRow";

interface ConversationListPanelProps {
  onOpenConversation: (conversationId: string) => void;
}

const FILTERS: ChatListFilter[] = ["active", "archived"];

/**
 * The AI Advisor's conversation list, as a body panel hosted by the Messages
 * inbox's "AI Advisor" segment (ADR-173). Active/Archived filter chips with the
 * same markup as the inbox's own.
 */
export function ConversationListPanel({ onOpenConversation }: ConversationListPanelProps) {
  const { t } = useTranslation();

  const { filter, setFilter, conversations, isLoading, isError, errorKind, refetch, isEmpty, archive, unarchive } = useChatList();

  return (
    <div className="flex-1" style={{ minHeight: 0 }}>
      <div className="flex-row px-4 pt-2 pb-1 gap-2" role="tablist" aria-label={t("chat.filterLabel")}>
        {FILTERS.map((option) => {
          const isActive = filter === option;
          return (
            <button
              type="button"
              key={option}
              onClick={() => setFilter(option)}
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 999,
                backgroundColor: isActive ? colors.brand.accent : colors.brand.surface,
                border: isActive ? "none" : `1px solid ${colors.border}`,
              }}
              role="tab"
              aria-label={t(`chat.filter.${option}`)}
              aria-selected={isActive}
            >
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>{t(`chat.filter.${option}`)}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : isError ? (
        <div className="flex-1 items-center justify-center px-8">
          <InlineErrorState
            message={errorKind === "notAvailable" ? t("chat.unavailable") : t("chat.loadError")}
            onRetry={errorKind === "notAvailable" ? undefined : () => void refetch()}
          />
        </div>
      ) : isEmpty ? (
        <div className="flex-1 items-center justify-center px-8">
          <EmptyState
            icon={<Icon name="chatbubble-ellipses-outline" size={48} color={colors.neutral[500]} />}
            title={t(filter === "archived" ? "chat.emptyArchived.title" : "chat.empty.title")}
            message={t(filter === "archived" ? "chat.emptyArchived.message" : "chat.empty.message")}
          />
        </div>
      ) : (
        <div className="scrollbar-none" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, paddingBottom: 96 }}>
          {conversations.map((item) => (
            <ConversationRow key={item.id} conversation={item} onPress={onOpenConversation} onArchive={archive} onUnarchive={unarchive} />
          ))}
        </div>
      )}
    </div>
  );
}
