/**
 * Stand-in for the app's `chat/services/chatBubbleClasses.ts`, which is not in
 * the extract. These class strings are modelled on the messaging thread's own
 * bubbles (`ThreadScreen.MessageBubble`), which the chat thread's doc comment
 * says it mirrors "line for line". They are NOT copied from the app.
 */
export function chatBubbleClasses(role: "member" | "assistant") {
  return role === "member"
    ? {
        wrapper: "mb-3 items-end",
        bubble: "rounded-2xl px-3.5 py-2.5 max-w-[85%] bg-brand-accent",
        text: "text-sm text-white",
      }
    : {
        wrapper: "mb-3 items-start",
        bubble: "rounded-2xl px-3.5 py-2.5 max-w-[85%] bg-brand-surface border border-gray-100",
        text: "text-sm text-brand-primary",
      };
}

export const citationChipClasses = {
  row: "flex-row flex-wrap gap-2 mt-1",
  chip: "rounded-full border border-gray-200 bg-brand-background px-3 py-1.5 active:opacity-80",
  label: "text-xs font-medium text-brand-accent",
} as const;
