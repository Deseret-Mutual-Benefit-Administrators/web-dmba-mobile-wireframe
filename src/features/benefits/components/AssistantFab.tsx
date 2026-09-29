import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { FloatingActionButton } from "@/src/shared/components/FloatingActionButton";

/**
 * Local copy of the app's `chat/components/AssistantFab` (the chat feature
 * belongs to another slice). Opens the AI Benefits Advisor sheet. The app
 * resumes a conversation under 30 minutes old and shows a dot; the wireframe
 * has no conversation state, so it always opens a fresh sheet.
 */
export function AssistantFab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <FloatingActionButton
      icon="chatbubble-ellipses-outline"
      iconSize={24}
      onPress={() => navigate("/chat/assistant")}
      accessibilityLabel={t("benefits.aiChatTitle")}
      accessibilityHint={t("chat.fab.hint")}
    />
  );
}
