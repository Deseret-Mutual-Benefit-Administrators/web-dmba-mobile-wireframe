/** Local stand-in for the app's `spending-claims/services/receiptCompression.ts` (size label only). */
export function formatReceiptSize(bytes: number): { unit: "kb" | "mb"; value: string } {
  if (bytes >= 1024 * 1024) return { unit: "mb", value: (bytes / (1024 * 1024)).toFixed(1) };
  return { unit: "kb", value: String(Math.max(1, Math.round(bytes / 1024))) };
}
