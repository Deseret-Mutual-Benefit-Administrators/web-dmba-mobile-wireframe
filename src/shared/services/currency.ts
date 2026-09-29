/** Web stand-in for the app's currency formatter (not in the extract). */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
