import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { Spinner } from "@/src/shared/components/Spinner";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { colors } from "@/src/shared/theme/colors";
import { ActionSheetAlert } from "@/src/features/messaging/components/ActionSheetAlert";
import { useChatThread } from "../hooks/useChatThread";
import type { ChatThreadNavigation } from "../hooks/useChatThread";
import { MAX_MESSAGE_LENGTH, type ChatErrorKind } from "../services/chatCore";
import { MemberBubble } from "./MemberBubble";
import { AssistantBubble } from "./AssistantBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { DisclaimerLine } from "./DisclaimerLine";
import { ChatUnavailableState } from "./ChatUnavailableState";

/** i18n key for an inline (composer-area) send failure. */
function sendErrorKey(kind: ChatErrorKind): string {
  if (kind === "notAvailable") return "chat.unavailable";
  if (kind === "rateLimited") return "chat.rateLimited";
  return "chat.sendFailed";
}

/** `useSafeAreaInsets().bottom` inside the phone frame. */
const INSETS_BOTTOM = 34;

/** Context handed to `renderHeader` so each host can render its own header chrome. */
export interface ChatThreadHeaderContext {
  title: string;
  isNewConversation: boolean;
  canOpenMenu: boolean;
  openMenu: () => void;
}

export interface ChatThreadViewProps {
  /** Real conversation id, or `NEW_CONVERSATION_ID`. */
  conversationId: string;
  host: "screen" | "sheet";
  /** Sheet host only in the app (Android detent arithmetic); unused on the web. */
  sheetDetentIndex?: number;
  navigation: ChatThreadNavigation;
  renderHeader: (ctx: ChatThreadHeaderContext) => ReactNode;
}

/**
 * The AI Benefits Advisor thread body, shared by the full-screen route and the
 * form sheet: host header → message list → pinned composer.
 *
 * Web note: in the app the sheet host puts the list first and the header and
 * composer in an absolutely positioned overlay, purely so iOS/Android sheet
 * drag arbitration finds the scroll view. There is no sheet pan on the web, so
 * both hosts use the full-screen host's header → list → composer stack, which
 * the app's own comments describe as visually identical.
 */
export function ChatThreadView({ conversationId, navigation, renderHeader }: ChatThreadViewProps) {
  const { t } = useTranslation();
  const insets = { bottom: INSETS_BOTTOM };
  const keyboardVisible = false;
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    isNewConversation,
    conversationTitle,
    conversationStatus,
    turns,
    pendingMemberText,
    isTyping,
    isLoading,
    loadError,
    refetch,
    draft,
    setDraft,
    canSend,
    isSending,
    sendError,
    send,
    sendHandoff,
    isSendingHandoff,
  } = useChatThread(conversationId, navigation);

  // Bottom-anchor: once per new row, as the app does.
  const scrollTrigger = turns.length + (pendingMemberText ? 1 : 0) + (isTyping ? 1 : 0);
  useEffect(() => {
    const el = scrollViewRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [scrollTrigger]);

  const isHandedOff = conversationStatus === "handedOff";

  const openMenu = () => setMenuOpen(true);

  const headerCtx: ChatThreadHeaderContext = {
    title: isNewConversation ? t("benefits.aiChatTitle") : conversationTitle || t("benefits.aiChatTitle"),
    isNewConversation,
    canOpenMenu: !isNewConversation && !isHandedOff,
    openMenu,
  };

  const menu = menuOpen ? (
    <ActionSheetAlert
      title={t("chat.menu.title")}
      message={conversationTitle || t("benefits.aiChatTitle")}
      onDismiss={() => setMenuOpen(false)}
      buttons={[
        { text: t("chat.menu.talkToPerson"), onPress: () => void sendHandoff() },
        { text: t("common.cancel"), style: "cancel" },
      ]}
    />
  ) : null;

  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-background" style={{ height: "100%" }}>
        {renderHeader(headerCtx)}
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </div>
      </div>
    );
  }

  if (loadError === "notAvailable" || loadError === "rateLimited") {
    return (
      <div className="flex-1 bg-brand-background" style={{ height: "100%" }}>
        {renderHeader(headerCtx)}
        <ChatUnavailableState kind={loadError} />
      </div>
    );
  }

  if (loadError === "error") {
    return (
      <div className="flex-1 bg-brand-background" style={{ height: "100%" }}>
        {renderHeader(headerCtx)}
        <div className="flex-1 items-center justify-center px-8">
          <InlineErrorState message={t("chat.loadError")} onRetry={() => void refetch()} />
        </div>
      </div>
    );
  }

  const messages = (
    <>
      <DisclaimerLine />

      {turns.length === 0 && !pendingMemberText && (
        <SuggestedQuestions serverQuestions={undefined} onSelect={(question) => setDraft(question)} disabled={isSending} />
      )}

      {turns.map((turn) =>
        turn.role === "member" ? (
          <MemberBubble key={turn.id} content={turn.content} />
        ) : (
          <AssistantBubble
            key={turn.id}
            content={turn.content}
            citations={turn.citations}
            outcome={turn.outcome}
            handoffOffered={turn.handoffOffered}
            onHandoff={() => void sendHandoff()}
            isSendingHandoff={isSendingHandoff}
            onOpenCitation={navigation.onOpenCitation}
          />
        )
      )}

      {pendingMemberText && <MemberBubble content={pendingMemberText} />}
      {isTyping && <TypingIndicator />}
    </>
  );

  const list = (
    <ScreenScrollView ref={scrollViewRef} bottomExtra={8} contentContainerStyle={{ paddingTop: 16 }}>
      {messages}
    </ScreenScrollView>
  );

  const composer = isHandedOff ? (
    <div className="px-4 pt-3 border-t border-gray-100 bg-brand-surface" style={{ paddingBottom: insets.bottom + 12 }}>
      <span className="text-sm text-gray-600">{t("chat.handedOffNotice")}</span>
    </div>
  ) : (
    <div className="px-4 pt-2 border-t border-gray-100 bg-brand-surface" style={{ paddingBottom: keyboardVisible ? 8 : insets.bottom + 8 }}>
      {sendError && (
        <span className="text-xs mb-1" style={{ color: colors.error }} role="alert">
          {t(sendErrorKey(sendError))}
        </span>
      )}

      <div className="flex-row items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) void send();
            }
          }}
          placeholder={t("chat.placeholder")}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={1}
          className="flex-1 rounded-2xl px-3 py-2.5 bg-brand-background text-base text-brand-primary"
          style={{ maxHeight: 120, resize: "none", outline: "none" }}
          aria-label={t("chat.placeholder")}
        />

        <button
          type="button"
          onClick={() => void send()}
          disabled={!canSend}
          style={{ padding: 8, opacity: canSend ? 1 : 0.4 }}
          aria-label={t("chat.send")}
        >
          {isSending ? <Spinner size="small" /> : <Icon name="send" size={22} color={colors.brand.accent} />}
        </button>
      </div>
    </div>
  );

  return (
    <KeyboardAvoidingScreen style={{ height: "100%" }}>
      {renderHeader(headerCtx)}
      {list}
      {composer}
      {menu}
    </KeyboardAvoidingScreen>
  );
}
