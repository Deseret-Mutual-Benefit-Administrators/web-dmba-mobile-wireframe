/** Stand-in for spending-claims' `formatReceiptSize` (another slice's service). */
export function formatReceiptSize(bytes: number): { unit: "kb" | "mb"; value: string } {
  if (bytes >= 1024 * 1024) return { unit: "mb", value: (bytes / (1024 * 1024)).toFixed(1) };
  return { unit: "kb", value: String(Math.max(1, Math.round(bytes / 1024))) };
}

/** Stand-in for financial-accounts' `formatTransactionDate`: "Mar 24, 2026". */
export function formatTransactionDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
