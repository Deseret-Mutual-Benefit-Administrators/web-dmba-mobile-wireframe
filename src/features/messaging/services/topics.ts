/** Stand-in for the app's `messaging/services/topics.ts` (not in the extract). */
import type { MessageTopic } from "../types";

export const TOPICS: ReadonlyArray<{ key: MessageTopic; labelKey: string }> = [
  { key: "claims", labelKey: "messaging.topics.claims" },
  { key: "benefitsCoverage", labelKey: "messaging.topics.benefitsCoverage" },
  { key: "idCard", labelKey: "messaging.topics.idCard" },
  { key: "spendingAccounts", labelKey: "messaging.topics.spendingAccounts" },
  { key: "retirement", labelKey: "messaging.topics.retirement" },
  { key: "priorAuthorization", labelKey: "messaging.topics.priorAuthorization" },
  { key: "other", labelKey: "messaging.topics.other" },
];

export function topicLabelKey(topic: MessageTopic): string {
  return `messaging.topics.${topic}`;
}
