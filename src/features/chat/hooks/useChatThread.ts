/**
 * Web stand-in for `useChatThread`. Holds the placeholder conversation in
 * local state; a send appends the member turn, shows the typing indicator,
 * then appends a canned illustrative reply. `?state=` forces
 * loading | error | unavailable | rateLimited | sendError | handedOff.
 */
import { useEffect, useRef, useState } from "react";
import { useScreenState } from "@/src/features/messaging/hooks/useScreenState";
import { HANDOFF_THREAD_ID, findConversation, sampleReply } from "../placeholder";
import { MAX_MESSAGE_LENGTH, type ChatErrorKind } from "../services/chatCore";
import type { ChatTurn, ConversationStatus } from "../types";

/** Sentinel conversation id for a not-yet-started conversation. */
export const NEW_CONVERSATION_ID = "new";

/** How each host maps the thread's navigation events. */
export interface ChatThreadNavigation {
  onConversationStarted: (id: string) => void;
  onHandoffCreated: (threadId: string) => void;
  onOpenCitation: (href: string) => void;
  showError?: (message: string) => void;
}

export function useChatThread(conversationId: string, navigation: ChatThreadNavigation) {
  const state = useScreenState(["loading", "error", "unavailable", "rateLimited", "sendError", "handedOff"] as const);
  const isNewConversation = conversationId === NEW_CONVERSATION_ID;
  const source = isNewConversation ? null : findConversation(conversationId);

  const [turns, setTurns] = useState<ChatTurn[]>(source?.turns ?? []);
  const [title, setTitle] = useState(source?.title ?? "");
  const [status, setStatus] = useState<ConversationStatus>(state === "handedOff" ? "handedOff" : (source?.status ?? "active"));
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSendingHandoff, setIsSendingHandoff] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const loadError: ChatErrorKind | null =
    state === "error" ? "error" : state === "unavailable" ? "notAvailable" : state === "rateLimited" ? "rateLimited" : null;

  const send = async () => {
    const text = draft.trim();
    if (text === "" || isTyping) return;
    if (!title) setTitle(text.length > 40 ? `${text.slice(0, 40)}…` : text);
    setTurns((prev) => [
      ...prev,
      { id: `local-${prev.length + 1}`, role: "member", content: text, createdAtUtc: new Date().toISOString(), citations: [], outcome: "answered", handoffOffered: false },
    ]);
    setDraft("");
    setIsTyping(true);
    timer.current = window.setTimeout(() => {
      setIsTyping(false);
      setTurns((prev) => [...prev, sampleReply(`local-${prev.length + 1}`)]);
    }, 1200);
  };

  const sendHandoff = async () => {
    setIsSendingHandoff(true);
    timer.current = window.setTimeout(() => {
      setIsSendingHandoff(false);
      setStatus("handedOff");
      navigation.onHandoffCreated(HANDOFF_THREAD_ID);
    }, 500);
  };

  return {
    isNewConversation: isNewConversation && turns.length === 0,
    conversationTitle: title,
    conversationStatus: status,
    turns,
    pendingMemberText: null as string | null,
    isTyping,
    isLoading: state === "loading",
    loadError,
    refetch: async () => undefined,
    draft,
    setDraft: (value: string) => setDraft(value.slice(0, MAX_MESSAGE_LENGTH)),
    canSend: draft.trim() !== "" && !isTyping,
    isSending: isTyping,
    sendError: (state === "sendError" ? "error" : null) as ChatErrorKind | null,
    send,
    sendHandoff,
    isSendingHandoff,
  };
}
