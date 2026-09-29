/**
 * Web stand-in for the app's `amountInput.ts` (not in the extract). Money is
 * integer cents: "$1,234.5" → 123450; anything unparseable → null.
 */
export function parseAmountInput(text: string): { cents: number | null } {
  const cleaned = text.replace(/[$,\s]/g, "");
  if (cleaned === "" || !/^\d*(\.\d{0,2})?$/.test(cleaned) || cleaned === ".") return { cents: null };
  const [whole, fraction = ""] = cleaned.split(".");
  const cents = Number.parseInt(whole || "0", 10) * 100 + Number.parseInt((fraction + "00").slice(0, 2), 10);
  return { cents };
}

export function formatAmountInput(cents: number): string {
  return (cents / 100).toFixed(2);
}
