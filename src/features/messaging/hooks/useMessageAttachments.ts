/**
 * Web stand-in for `useMessageAttachments` — draft chips only; "uploads" settle
 * after a short timer, no bytes are read. `initial` seeds the drafts (used by
 * compose's `?state=attachments`).
 */
import { useState } from "react";
import { MAX_ATTACHMENTS } from "../services/rules";
import type { MessageAttachmentDraft } from "../types";

let nextLocal = 1;

function draft(fileName: string, contentType: string, sizeBytes: number, status: MessageAttachmentDraft["status"]): MessageAttachmentDraft {
  return {
    localId: `draft-${nextLocal++}`,
    fileName,
    contentType,
    sizeBytes,
    encryptedPath: null,
    uploadedId: status === "uploaded" ? `uploaded-${nextLocal}` : null,
    scanStatus: status === "uploaded" ? "pending" : null,
    status,
  };
}

export function sampleDrafts(): MessageAttachmentDraft[] {
  return [
    draft("photo-of-letter.jpg", "image/jpeg", 1_258_291, "uploaded"),
    draft("statement.pdf", "application/pdf", 245_760, "uploading"),
    draft("second-page.jpg", "image/jpeg", 998_400, "error"),
  ];
}

export function useMessageAttachments(initial: MessageAttachmentDraft[] = []) {
  const [drafts, setDrafts] = useState<MessageAttachmentDraft[]>(initial);

  const settle = (localId: string) =>
    window.setTimeout(() => {
      setDrafts((prev) =>
        prev.map((d) => (d.localId === localId ? { ...d, status: "uploaded", uploadedId: `uploaded-${localId}`, scanStatus: "pending" } : d))
      );
    }, 900);

  const add = (fileName: string, contentType: string, sizeBytes: number) => {
    const next = draft(fileName, contentType, sizeBytes, "uploading");
    setDrafts((prev) => (prev.length >= MAX_ATTACHMENTS ? prev : [...prev, next]));
    settle(next.localId);
  };

  const count = drafts.length;
  return {
    drafts,
    error: null as null | "captureFailed" | "unsupportedFormat" | "tooLarge" | "tooManyAttachments" | "uploadFailed",
    canAddMore: count < MAX_ATTACHMENTS,
    isBusy: false,
    captureFromCamera: async () => add(`photo-${count + 1}.jpg`, "image/jpeg", 1_153_434),
    addFromLibrary: async () => add(`image-${count + 1}.jpg`, "image/jpeg", 734_003),
    addDocument: async () => add(`document-${count + 1}.pdf`, "application/pdf", 312_320),
    retryUpload: async (localId: string) => {
      setDrafts((prev) => prev.map((d) => (d.localId === localId ? { ...d, status: "uploading" } : d)));
      settle(localId);
    },
    removeAttachment: async (localId: string) => setDrafts((prev) => prev.filter((d) => d.localId !== localId)),
    clear: () => setDrafts([]),
  };
}
