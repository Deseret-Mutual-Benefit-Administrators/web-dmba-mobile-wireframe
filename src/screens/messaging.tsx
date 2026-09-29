/**
 * Screen registry for the "messaging" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { MessagesIndexRoute } from "@/src/features/messaging/screens/MessagesIndexRoute";
import { MessagesComposeRoute } from "@/src/features/messaging/screens/MessagesComposeRoute";
import { MessageThreadRoute } from "@/src/features/messaging/screens/MessageThreadRoute";
import { MessageAttachmentViewerRoute } from "@/src/features/messaging/screens/MessageAttachmentViewerRoute";
import { ChatAssistantRoute } from "@/src/features/chat/screens/ChatAssistantRoute";
import { ChatConversationRoute } from "@/src/features/chat/screens/ChatConversationRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/messages": <MessagesIndexRoute />,
  "/messages/compose": <MessagesComposeRoute />,
  "/messages/:threadId": <MessageThreadRoute />,
  "/messages/:threadId/attachment/:attachmentId": <MessageAttachmentViewerRoute />,
  "/chat/assistant": <ChatAssistantRoute />,
  "/chat/:conversationId": <ChatConversationRoute />,
};
