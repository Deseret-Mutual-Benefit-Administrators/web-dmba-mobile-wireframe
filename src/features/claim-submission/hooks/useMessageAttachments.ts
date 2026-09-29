/**
 * Stand-in for messaging's `useMessageAttachments()` — the same fields
 * `AttachmentsStep` reads. The capture buttons add a fictitious draft that
 * "uploads" for a moment; nothing is read from the device.
 */
import { useState } from "react";
import { placeholderAttachmentFiles } from "../placeholder";

export const MAX_ATTACHMENTS = 5;

export interface AttachmentDraft {
  localId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  status: "uploading" | "uploaded" | "error";
}

let nextId = 1;

export function useMessageAttachments() {
  const [drafts, setDrafts] = useState<AttachmentDraft[]>([]);

  const add = (kind: keyof typeof placeholderAttachmentFiles) => {
    const file = placeholderAttachmentFiles[kind];
    const localId = `draft-${nextId++}`;
    setDrafts((prev) => [...prev, { localId, ...file, status: "uploading" }]);
    window.setTimeout(() => {
      setDrafts((prev) => prev.map((d) => (d.localId === localId ? { ...d, status: "uploaded" } : d)));
    }, 700);
  };

  return {
    drafts,
    uploadedAttachmentIds: drafts.filter((d) => d.status === "uploaded").map((d) => d.localId),
    canAddMore: drafts.length < MAX_ATTACHMENTS,
    isBusy: drafts.some((d) => d.status === "uploading"),
    error: null as string | null,
    captureFromCamera: async () => add("camera"),
    addFromLibrary: async () => add("library"),
    addDocument: async () => add("pdf"),
    retryUpload: async (localId: string) =>
      setDrafts((prev) => prev.map((d) => (d.localId === localId ? { ...d, status: "uploaded" } : d))),
    removeAttachment: async (localId: string) => setDrafts((prev) => prev.filter((d) => d.localId !== localId)),
    discardAll: () => setDrafts([]),
  };
}
