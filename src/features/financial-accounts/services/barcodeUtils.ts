/** Local stand-in for the app's `financial-accounts/services/barcodeUtils.ts`. */
export type VerdictErrorKind = "invalid" | "unavailable" | "other";

/** Digits only; a UPC-A (12), UPC-E (8), EAN-13 (13) or GTIN-14 (14). Else null. */
export function normalizeProductCode(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  return [8, 12, 13, 14].includes(digits.length) ? digits : null;
}

export function deriveVerdictErrorKind(error: unknown): VerdictErrorKind {
  return error === "unavailable" ? "unavailable" : error === "invalid" ? "invalid" : "other";
}
