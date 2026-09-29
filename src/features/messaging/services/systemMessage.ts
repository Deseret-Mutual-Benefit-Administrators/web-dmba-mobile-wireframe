/** Stand-in for the app's `messaging/services/systemMessage.ts` (ADR-197). */
import type { MessageThreadKind } from "../types";

export function systemMessageTextKey(kind: MessageThreadKind): string {
  return kind === "claimSubmission" ? "messaging.thread.systemAck.claimSubmission" : "messaging.thread.systemAck.general";
}
