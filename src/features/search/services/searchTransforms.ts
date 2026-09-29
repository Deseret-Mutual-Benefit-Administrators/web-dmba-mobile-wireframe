/**
 * Local stand-ins for the app's `services/searchTransforms.ts`, which the UI
 * extract does not include. Same export names; behaviour is a best guess from
 * the call sites and the facility-type chips in the app screenshots.
 */
import type { BadgeTone } from "@/src/shared/components/Badge";

/** "2.4 mi"; "" when there is no distance. */
export function formatDistance(miles: number | null): string {
  if (miles == null) return "";
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
}

/** Network-status tone for `InNetworkBadge`. */
export function getNetworkTone(isInNetwork: boolean): BadgeTone {
  return isInNetwork ? "success" : "warning";
}

/** Facility-type filter chips, in the order the app shows them. */
export const FACILITY_TYPES: { value: string; label: string }[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "UrgentCare", label: "Urgent Care" },
  { value: "ImagingCenter", label: "Imaging Center" },
  { value: "Lab", label: "Lab" },
  { value: "SurgeryCenterASC", label: "Surgery Center" },
];

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Office-hours record → ordered `{ day, hours }` rows. */
export function parseOfficeHours(hours: Record<string, string> | null): { day: string; hours: string }[] {
  if (!hours) return [];
  return Object.entries(hours)
    .map(([day, h]) => ({ day, hours: h }))
    .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
}
