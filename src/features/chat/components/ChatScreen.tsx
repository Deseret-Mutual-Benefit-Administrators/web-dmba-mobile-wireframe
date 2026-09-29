import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { colors } from "@/src/shared/theme/colors";
import { ChatThreadView } from "./ChatThreadView";
import type { ChatThreadNavigation } from "../hooks/useChatThread";

/**
 * Full-screen route host for the advisor thread (`app/chat/[conversationId].tsx`)
 * — owns the route param and how each navigation callback maps to a route change.
 */
export function ChatScreen() {
  const { conversationId = "" } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigation: ChatThreadNavigation = {
    // The app replaces the route with the server id; the wireframe has no server,
    // so the thread keeps its local state under the `new` sentinel.
    onConversationStarted: () => undefined,
    onHandoffCreated: (threadId) => navigate(`/messages/${threadId}`),
    onOpenCitation: (href) => navigate(href),
  };

  return (
    <ChatThreadView
      conversationId={conversationId}
      host="screen"
      navigation={navigation}
      renderHeader={({ title, canOpenMenu, openMenu }) => (
        <ScreenHeader
          title={title}
          rightElement={
            canOpenMenu ? (
              <button
                type="button"
                onClick={openMenu}
                style={{ padding: 8 }}
                aria-label={t("chat.menu.label")}
                title={t("chat.menu.hint")}
              >
                <Icon name="ellipsis-horizontal" size={22} color={colors.brand.accent} />
              </button>
            ) : undefined
          }
        />
      )}
    />
  );
}
