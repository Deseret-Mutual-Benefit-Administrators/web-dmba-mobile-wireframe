import { useParams } from "react-router-dom";
import { ChatScreen } from "../components/ChatScreen";

/** Port of `app/chat/[conversationId].tsx`. Keyed so a new id (or `new`) remounts the thread. */
export function ChatConversationRoute() {
  const { conversationId } = useParams<{ conversationId: string }>();
  return <ChatScreen key={conversationId} />;
}
