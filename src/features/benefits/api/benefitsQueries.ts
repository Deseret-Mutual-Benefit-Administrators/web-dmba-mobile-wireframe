/**
 * Stand-in for the app's `useBenefitTopic` TanStack query: the same fields the
 * ported components read (`isPending`, `isError`, `data`, `refetch`), backed by
 * sample data. `?state=error` makes every topic read fail.
 */
import { usePlaceholderState, topicDetailFor } from "../placeholder";
import type { BenefitTopicDetail } from "../types";

export type TopicQuery =
  | { isPending: true; isError: false; data: undefined; refetch: () => void }
  | { isPending: false; isError: true; data: undefined; refetch: () => void }
  | { isPending: false; isError: false; data: BenefitTopicDetail; refetch: () => void };

export function useBenefitTopic(
  topicKey: string,
  planId: string | undefined,
  options: { enabled: boolean; title?: string }
): TopicQuery {
  const state = usePlaceholderState();
  const refetch = () => undefined;
  if (!options.enabled || state === "loading") return { isPending: true, isError: false, data: undefined, refetch };
  if (state === "error") return { isPending: false, isError: true, data: undefined, refetch };
  return { isPending: false, isError: false, data: topicDetailFor(topicKey, options.title ?? topicKey, planId), refetch };
}
