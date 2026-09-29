import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatThreadView } from "./ChatThreadView";
import { AssistantSheetHeader } from "./AssistantSheetHeader";
import { NEW_CONVERSATION_ID, type ChatThreadNavigation } from "../hooks/useChatThread";
import { RESUMABLE_CONVERSATION_ID } from "../placeholder";

/**
 * Form-sheet host for the AI Benefits Advisor (`app/chat/assistant.tsx`,
 * ADR-173), opened from the Benefits tab's FAB.
 *
 * Wireframe default: with no `?conversationId=`, the sheet opens on the
 * resumable sample conversation — what the FAB passes when a conversation is
 * under 30 minutes old. `?conversationId=new` shows a fresh conversation.
 */
export function AssistantSheetScreen() {
  const [params] = useSearchParams();
  const conversationId = params.get("conversationId") ?? RESUMABLE_CONVERSATION_ID;
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState(conversationId || NEW_CONVERSATION_ID);
  const [resetNonce, setResetNonce] = useState(0);

  const handleNewChat = () => {
    if (activeId === NEW_CONVERSATION_ID) return;
    setActiveId(NEW_CONVERSATION_ID);
    setResetNonce((n) => n + 1);
  };

  const dismiss = () => navigate(-1);

  const navigation: ChatThreadNavigation = {
    onConversationStarted: (id) => setActiveId(id),
    // The sheet closes and the Member Services thread opens as a pushed screen.
    onHandoffCreated: (threadId) => navigate(`/messages/${threadId}`, { replace: true }),
    // Citations land on the Coverage page beneath the sheet (ADR-174 §3).
    onOpenCitation: (href) => navigate(href, { replace: true }),
    showError: (message) => window.alert(message),
  };

  return (
    <ChatThreadView
      key={resetNonce}
      conversationId={activeId}
      host="sheet"
      navigation={navigation}
      renderHeader={(ctx) => <AssistantSheetHeader {...ctx} onNewChat={handleNewChat} onClose={dismiss} />}
    />
  );
}
