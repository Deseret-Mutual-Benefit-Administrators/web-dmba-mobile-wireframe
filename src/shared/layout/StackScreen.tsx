import type { ReactNode } from "react";

/**
 * Container for a pushed (or bare) route: fills the screen area, scrolls if the
 * screen does not scroll itself. Screens that pin a ScreenHeader should put
 * their content in a ScreenScrollView so the header stays put.
 */
export function StackScreen({ children }: { children: ReactNode }) {
  return <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none bg-brand-background">{children}</div>;
}
