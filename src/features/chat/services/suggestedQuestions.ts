/** Stand-in for `chat/services/suggestedQuestions.ts`: server list, else the static i18n keys. */
export type ResolvedSuggestedQuestions =
  | { source: "server"; questions: string[] }
  | { source: "static"; questionKeys: string[] };

export function resolveSuggestedQuestions(serverQuestions: string[] | undefined): ResolvedSuggestedQuestions {
  if (serverQuestions && serverQuestions.length > 0) return { source: "server", questions: serverQuestions };
  return { source: "static", questionKeys: ["chat.suggested.q1", "chat.suggested.q2", "chat.suggested.q3", "chat.suggested.q4"] };
}
