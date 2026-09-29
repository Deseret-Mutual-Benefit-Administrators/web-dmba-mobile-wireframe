import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { Spinner } from "@/src/shared/components/Spinner";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { FloatingActionButton } from "@/src/shared/components/FloatingActionButton";
import { SegmentedControl } from "@/src/shared/components/SegmentedControl";
import { colors } from "@/src/shared/theme/colors";
import { ConversationListPanel } from "@/src/features/chat/components/ConversationListPanel";
import { NEW_CONVERSATION_ID } from "@/src/features/chat/hooks/useChatThread";
import { useInbox } from "../hooks/useInbox";
import { ThreadRow } from "./ThreadRow";
import { INBOX_FILTERS, type MessagesTab } from "../types";

interface InboxScreenProps {
  /** Deep-linked initial segment (`?tab=`). Defaults to "messages". */
  initialTab?: MessagesTab;
}

/** The app's `useSafeAreaInsets().bottom` inside the phone frame. */
const INSETS_BOTTOM = 34;

/**
 * The Messages inbox — a `SegmentedControl` ("Messages" / "AI Advisor")
 * switches its body between the member's secure-message threads and their AI
 * Advisor conversation history (ADR-173).
 */
export function InboxScreen({ initialTab }: InboxScreenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const insets = { bottom: INSETS_BOTTOM };

  const [tab, setTab] = useState<MessagesTab>(initialTab ?? "messages");

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  const { filter, setFilter, threads, isLoading, isError, refetch, isEmpty, archive, unarchive, markUnread, markRead } = useInbox();

  const openThread = (threadId: string) => navigate(`/messages/${threadId}`);
  const openCompose = () => navigate("/messages/compose");
  const openConversation = (conversationId: string) => navigate(`/chat/${conversationId}`);
  const openNewConversation = () => navigate(`/chat/${NEW_CONVERSATION_ID}`);

  return (
    <div className="flex-1 bg-brand-background" style={{ height: "100%", minHeight: 0 }}>
      <ScreenHeader title={t("messaging.inbox.title")} />

      <div className="px-4 pt-3 pb-1">
        <SegmentedControl
          segments={[
            { key: "messages", label: t("messaging.inbox.segments.messages") },
            { key: "advisor", label: t("messaging.inbox.segments.advisor") },
          ]}
          value={tab}
          onChange={setTab}
          accessibilityLabel={t("messaging.inbox.segmentsLabel")}
        />
      </div>

      {tab === "messages" ? (
        <>
          <div className="flex-row px-4 pt-2 pb-1 gap-2" role="tablist" aria-label={t("messaging.inbox.filterLabel")}>
            {INBOX_FILTERS.map((option) => {
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
                  aria-label={t(`messaging.inbox.filter.${option}`)}
                  aria-selected={isActive}
                >
                  <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                    {t(`messaging.inbox.filter.${option}`)}
                  </span>
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
              <InlineErrorState message={t("messaging.inbox.loadError")} onRetry={() => void refetch()} />
            </div>
          ) : isEmpty ? (
            <div className="flex-1 items-center justify-center px-8">
              <EmptyState
                icon={<Icon name="mail-outline" size={48} color={colors.neutral[500]} />}
                title={t(`messaging.inbox.empty.${filter}.title`)}
                message={t(`messaging.inbox.empty.${filter}.message`)}
              />
            </div>
          ) : (
            <div className="scrollbar-none" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, paddingBottom: 96 }}>
              {threads.map((item) => (
                <ThreadRow
                  key={item.id}
                  thread={item}
                  onPress={openThread}
                  onArchive={archive}
                  onUnarchive={unarchive}
                  onMarkUnread={markUnread}
                  onMarkRead={markRead}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <ConversationListPanel onOpenConversation={openConversation} />
      )}

      {/* Floating action — shared `FloatingActionButton`, swaps behavior by segment. */}
      <FloatingActionButton
        bottomInset={insets.bottom}
        icon={tab === "messages" ? "create-outline" : "chatbubble-ellipses-outline"}
        onPress={tab === "messages" ? openCompose : openNewConversation}
        accessibilityLabel={t(tab === "messages" ? "messaging.inbox.newMessage" : "chat.newConversation")}
        accessibilityHint={tab === "messages" ? t("common.hints.opensNewMessage") : t("chat.history.newChatHint")}
      />
    </div>
  );
}
