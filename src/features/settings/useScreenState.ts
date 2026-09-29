import { useSearchParams } from "react-router-dom";

/** Wireframe-only: `?state=loading|empty|error` makes a screen's non-happy states reachable. */
export type ScreenState = "ready" | "loading" | "empty" | "error";

export function useScreenState(): ScreenState {
  const [params] = useSearchParams();
  const state = params.get("state");
  return state === "loading" || state === "empty" || state === "error" ? state : "ready";
}
