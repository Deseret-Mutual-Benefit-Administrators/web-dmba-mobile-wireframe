/**
 * Web stand-in for `useInbox` — local state over the placeholder threads.
 * `?state=loading|error|empty` forces those branches.
 */
import { useMemo, useState } from "react";
import { THREAD_SUMMARIES } from "../placeholder";
import type { InboxFilter, MessageThreadSummary } from "../types";
import { useScreenState } from "./useScreenState";

export function useInbox() {
  const state = useScreenState(["loading", "error", "empty"] as const);
  const [filter, setFilter] = useState<InboxFilter>("open");
  const [all, setAll] = useState<MessageThreadSummary[]>(THREAD_SUMMARIES);

  const threads = useMemo(
    () => (state === "empty" ? [] : all.filter((t) => (filter === "archived" ? t.isArchived : !t.isArchived))),
    [all, filter, state]
  );

  const patch = (id: string, change: Partial<MessageThreadSummary>) =>
    setAll((prev) => prev.map((t) => (t.id === id ? { ...t, ...change } : t)));

  return {
    filter,
    setFilter,
    threads,
    isLoading: state === "loading",
    isError: state === "error",
    refetch: async () => undefined,
    isEmpty: threads.length === 0,
    archive: (id: string) => patch(id, { isArchived: true }),
    unarchive: (id: string) => patch(id, { isArchived: false }),
    markUnread: (id: string) => patch(id, { hasUnread: true }),
    markRead: (id: string) => patch(id, { hasUnread: false }),
  };
}
