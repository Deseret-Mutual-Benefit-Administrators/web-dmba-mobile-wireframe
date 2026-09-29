import type { CSSProperties } from "react";

/**
 * Web stand-in for React Native's `numberOfLines`. Kept as a style (not extra
 * classes) so each ported `className` string stays exactly the app's.
 */
export function lines(n: number): CSSProperties {
  if (n === 1) return { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  return { overflow: "hidden", display: "-webkit-box", WebkitLineClamp: n, WebkitBoxOrient: "vertical" };
}

/** Reads `?state=` from the current URL; used by placeholder hooks. */
export function useWireframeState(search: string, key = "state"): string | null {
  return new URLSearchParams(search).get(key);
}
