import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { FloatingActionButton } from "@/src/shared/components/FloatingActionButton";
import { RESUMABLE_CONVERSATION_ID } from "../placeholder";

/**
 * Floating action button that opens the AI Benefits Advisor sheet
 * (`/chat/assistant`), mounted on the Benefits screen only (ADR-173/174).
 * The wireframe always has a resumable conversation, so the dot shows and the
 * sheet opens on it.
 */
export function AssistantFab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resumableConversationId: string | null = RESUMABLE_CONVERSATION_ID;

  const open = () => {
    navigate(resumableConversationId ? `/chat/assistant?conversationId=${resumableConversationId}` : "/chat/assistant");
  };

  return (
    <FloatingActionButton
      icon="chatbubble-ellipses-outline"
      iconSize={24}
      onPress={open}
      showBadge={!!resumableConversationId}
      accessibilityLabel={resumableConversationId ? t("chat.fab.resumeLabel") : t("benefits.aiChatTitle")}
      accessibilityHint={resumableConversationId ? t("chat.fab.resumeHint") : t("chat.fab.hint")}
    />
  );
}
