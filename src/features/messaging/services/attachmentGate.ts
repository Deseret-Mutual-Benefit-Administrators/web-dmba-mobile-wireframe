/**
 * Stand-in for the app's `messaging/services/attachmentGate.ts` (ADR-202, not
 * in the extract). Only a `clean` file is pressable; `pending` is a disabled
 * chip with a status badge; `malicious` is not a button and is struck through.
 * Badge tones are a guess.
 */
import type { BadgeTone } from "@/src/shared/components/Badge";
import type { AttachmentScanStatus, MessageAttachment } from "../types";

export type AttachmentGate = "pending" | "blocked";

export const ATTACHMENT_GATE_MESSAGE_KEYS: Record<AttachmentGate, string> = {
  pending: "messaging.thread.attachmentScanPending",
  blocked: "messaging.thread.attachmentBlocked",
};

export function attachmentGateAllowsRetry(gate: AttachmentGate): boolean {
  return gate === "pending";
}

export interface AttachmentChipPresentation {
  scanStatus: AttachmentScanStatus;
  pressable: boolean;
  disabled: boolean;
  strikethrough: boolean;
  labelKey: string | null;
  tone: BadgeTone | null;
}

export function attachmentChipPresentation(attachment: MessageAttachment): AttachmentChipPresentation {
  switch (attachment.scanStatus) {
    case "clean":
      return { scanStatus: "clean", pressable: true, disabled: false, strikethrough: false, labelKey: null, tone: null };
    case "malicious":
      return {
        scanStatus: "malicious",
        pressable: false,
        disabled: true,
        strikethrough: true,
        labelKey: ATTACHMENT_GATE_MESSAGE_KEYS.blocked,
        tone: "error",
      };
    default:
      return {
        scanStatus: "pending",
        pressable: false,
        disabled: true,
        strikethrough: false,
        labelKey: ATTACHMENT_GATE_MESSAGE_KEYS.pending,
        tone: "neutral",
      };
  }
}
