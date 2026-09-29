/**
 * Web stand-ins for two pure helpers the messaging screens import from other
 * features (`financial-accounts/services/accountTransforms.formatTransactionDate`,
 * `spending-claims/services/receiptCompression.formatReceiptSize`). Neither is in
 * the UI extract, so the output format here is an approximation.
 */
export function formatTransactionDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatReceiptSize(bytes: number): { unit: "kb" | "mb"; value: string } {
  if (bytes >= 1024 * 1024) return { unit: "mb", value: (bytes / (1024 * 1024)).toFixed(1) };
  return { unit: "kb", value: String(Math.max(1, Math.round(bytes / 1024))) };
}

/** `numberOfLines={1}` / `{2}` on a React Native `<Text>`. */
export const oneLine = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;
export const twoLines = {
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
} as const;
