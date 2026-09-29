/**
 * Web stand-in for `useThread` — the placeholder thread in local state; a reply
 * appends a member message. `?state=loading|error` forces those branches.
 */
import { useState } from "react";
import { MEMBER_NAME, findThread } from "../placeholder";
import type { MessageThreadDetail } from "../types";
import { useMessageAttachments } from "./useMessageAttachments";
import { useScreenState } from "./useScreenState";

export function useThread(threadId: string | undefined) {
  const state = useScreenState(["loading", "error"] as const);
  const [thread, setThread] = useState<MessageThreadDetail>(() => findThread(threadId));
  const [replyBody, setReplyBody] = useState("");
  const attachments = useMessageAttachments();

  const uploading = attachments.drafts.some((d) => d.status === "uploading");
  const canReply = replyBody.trim() !== "" && !uploading;

  const sendReply = async () => {
    if (!canReply) return;
    const now = new Date().toISOString();
    setThread((prev) => ({
      ...prev,
      isArchived: false,
      lastMessageAtUtc: now,
      messages: [
        ...prev.messages,
        {
          id: `reply-${prev.messages.length + 1}`,
          senderKind: "member",
          senderDisplayName: MEMBER_NAME,
          body: replyBody.trim(),
          createdAtUtc: now,
          attachments: attachments.drafts.map((d) => ({
            id: d.uploadedId ?? d.localId,
            fileName: d.fileName,
            contentType: d.contentType,
            sizeBytes: d.sizeBytes,
            scanStatus: "pending",
          })),
        },
      ],
    }));
    setReplyBody("");
    attachments.clear();
  };

  return {
    thread: state === "error" ? undefined : thread,
    isLoading: state === "loading",
    isError: state === "error",
    refetch: async () => undefined,
    replyBody,
    setReplyBody,
    replyError: null as string | null,
    attachments,
    canReply,
    isSendingReply: false,
    sendReply,
  };
}
