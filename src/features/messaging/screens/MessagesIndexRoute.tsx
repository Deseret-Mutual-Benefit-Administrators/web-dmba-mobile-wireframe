import { useSearchParams } from "react-router-dom";
import { InboxScreen } from "../components/InboxScreen";
import { MESSAGES_TABS, type MessagesTab } from "../types";

/** Port of `app/messages/index.tsx` — supports `?tab=messages|advisor`. */
export function MessagesIndexRoute() {
  const [params] = useSearchParams();
  const tabParam = params.get("tab");
  const initialTab = (MESSAGES_TABS as readonly string[]).includes(tabParam ?? "") ? (tabParam as MessagesTab) : undefined;
  return <InboxScreen initialTab={initialTab} />;
}
