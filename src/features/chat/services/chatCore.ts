/** Stand-in for the app's `chat/services/chatCore.ts` (not in the extract). */
import type { BadgeTone } from "@/src/shared/components/Badge";
import type { ConversationStatus } from "../types";

export type ChatErrorKind = "notAvailable" | "rateLimited" | "error";

/** Guess — the app's constant is not in the extract. */
export const MAX_MESSAGE_LENGTH = 1000;

export function conversationStatusBadgeTone(status: ConversationStatus): BadgeTone {
  return status === "handedOff" ? "info" : "neutral";
}
