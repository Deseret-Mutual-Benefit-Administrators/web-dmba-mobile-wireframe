/**
 * Pure tone → class-pair map behind `Badge.tsx` — see `buttonClasses.ts` for
 * why this lives in a React-Native-free sibling module.
 *
 * Chosen to match the app's dominant existing pairings rather than inventing
 * new ones (four existing badges surveyed before writing this):
 *   success → green-100 / green-800   (PriorAuthStatusBadge "Approved")
 *   warning → amber-100 / amber-800   (PlanYearBadge)
 *   error   → red-100 / red-800       (PriorAuthStatusBadge "Denied")
 *   info    → blue-100 / blue-800     (PriorAuthStatusBadge "In Progress")
 *   neutral → gray-100 / gray-700     (PlanYearBadge's neutral state)
 * `TierBadge`/`InNetworkBadge` formerly used inline hex/emerald one-offs;
 * the ADR-150 sweep rebuilt all four badges as thin wrappers over Badge.
 */

export type BadgeTone = "success" | "warning" | "error" | "info" | "neutral";

export interface BadgeToneClasses {
  container: string;
  text: string;
}

export const badgeToneClasses: Record<BadgeTone, BadgeToneClasses> = {
  success: { container: "bg-green-100", text: "text-green-800" },
  warning: { container: "bg-amber-100", text: "text-amber-800" },
  error: { container: "bg-red-100", text: "text-red-800" },
  info: { container: "bg-blue-100", text: "text-blue-800" },
  neutral: { container: "bg-gray-100", text: "text-gray-700" },
};
