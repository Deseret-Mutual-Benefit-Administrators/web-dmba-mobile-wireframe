import type { CSSProperties } from "react";

/** `numberOfLines={1}` on a React Native Text. */
export const oneLine: CSSProperties = {
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
