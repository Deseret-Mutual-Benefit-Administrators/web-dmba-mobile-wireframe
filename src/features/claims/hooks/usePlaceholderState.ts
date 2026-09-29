import { useSearchParams } from "react-router-dom";

export type PlaceholderState = "ready" | "loading" | "empty" | "error";

/** `?state=loading|empty|error` makes a screen's non-happy states reachable in the wireframe. */
export function usePlaceholderState(): PlaceholderState {
  const [params] = useSearchParams();
  const value = params.get("state");
  return value === "loading" || value === "empty" || value === "error" ? value : "ready";
}
