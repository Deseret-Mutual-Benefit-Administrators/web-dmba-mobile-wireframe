import { useParams } from "react-router-dom";
import { ThreadScreen } from "../components/ThreadScreen";

/** Port of `app/messages/[threadId]/index.tsx`. Keyed so a new id remounts the thread's local state. */
export function MessageThreadRoute() {
  const { threadId } = useParams<{ threadId: string }>();
  return <ThreadScreen key={threadId} />;
}
