/**
 * Local stand-in for the app's `spending-claims/services/receiptViewMode.ts`.
 * Images render; PDFs are acknowledged, never rendered; anything else is unsupported.
 *
 * Wireframe-only: `image/svg+xml` counts as an image so the placeholder receipt
 * (a drawn grey receipt) can render. The app accepts JPEG and PNG only.
 */
export type ReceiptViewMode = "image" | "acknowledged" | "unsupported";

export function receiptViewMode(contentType: string): ReceiptViewMode {
  const type = contentType.toLowerCase();
  if (type === "image/jpeg" || type === "image/png" || type === "image/svg+xml") return "image";
  if (type === "application/pdf") return "acknowledged";
  return "unsupported";
}

export function buildReceiptDataUri(contentType: string, base64: string): string | null {
  return receiptViewMode(contentType) === "image" ? `data:${contentType};base64,${base64}` : null;
}

export function getReceiptViewModeMessageKey(mode: ReceiptViewMode): string | null {
  return mode === "acknowledged" ? "spendingClaims.viewer.acknowledgedNotice" : null;
}
