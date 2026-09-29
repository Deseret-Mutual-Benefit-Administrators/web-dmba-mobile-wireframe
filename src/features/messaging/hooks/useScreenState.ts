import { useSearchParams } from "react-router-dom";

/**
 * Reads `?state=` so the wireframe can show a screen's loading / empty / error
 * (and similar) branches. Unknown or absent → "ready".
 */
export function useScreenState<S extends string>(allowed: readonly S[]): S | "ready" {
  const [params] = useSearchParams();
  const value = params.get("state");
  return value && (allowed as readonly string[]).includes(value) ? (value as S) : "ready";
}
