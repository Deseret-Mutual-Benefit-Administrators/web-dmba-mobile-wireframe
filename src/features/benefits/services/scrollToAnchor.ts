/**
 * Stand-in for the app's `useScrollToAnchor`: scrolls the nearest scrolling
 * ancestor so `el` sits at its top, without moving anything outside it.
 */
export function scrollToAnchor(el: HTMLElement | null): void {
  if (!el) return;
  let parent = el.parentElement;
  while (parent && !(parent.scrollHeight > parent.clientHeight && getComputedStyle(parent).overflowY === "auto")) {
    parent = parent.parentElement;
  }
  if (!parent) return;
  const offset = el.getBoundingClientRect().top - parent.getBoundingClientRect().top;
  parent.scrollTo({ top: parent.scrollTop + offset - 8, behavior: "smooth" });
}
