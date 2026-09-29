/** Web stand-in for `useChatList` — local state; `?state=loading|error|unavailable|empty`. */
import { useMemo, useState } from "react";
import { useScreenState } from "@/src/features/messaging/hooks/useScreenState";
import { CONVERSATION_SUMMARIES } from "../placeholder";
import type { ConversationSummary } from "../types";
import type { ChatErrorKind } from "../services/chatCore";

export type ChatListFilter = "active" | "archived";

export function useChatList() {
  const state = useScreenState(["loading", "error", "unavailable", "empty"] as const);
  const [filter, setFilter] = useState<ChatListFilter>("active");
  const [all, setAll] = useState<ConversationSummary[]>(CONVERSATION_SUMMARIES);

  const conversations = useMemo(
    () => (state === "empty" ? [] : all.filter((c) => (filter === "archived" ? c.isArchived : !c.isArchived))),
    [all, filter, state]
  );
  const patch = (id: string, isArchived: boolean) => setAll((prev) => prev.map((c) => (c.id === id ? { ...c, isArchived } : c)));

  return {
    filter,
    setFilter,
    conversations,
    isLoading: state === "loading",
    isError: state === "error" || state === "unavailable",
    errorKind: (state === "unavailable" ? "notAvailable" : "error") as ChatErrorKind,
    refetch: async () => undefined,
    isEmpty: conversations.length === 0,
    archive: (id: string) => patch(id, true),
    unarchive: (id: string) => patch(id, false),
  };
}
