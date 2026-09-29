/**
 * Stand-in for the app's `data/departments.ts` (excluded from the extract).
 * Labels come from the `contact.*` keys in en.json. The only real numbers are
 * the two that appear in en.json; every other line reads 800-000-0000.
 */
import type { BusinessHours, PhoneEntry } from "../types";

const PLACEHOLDER = { number: "tel:8000000000", displayNumber: "800-000-0000" };

export const saltLakePhone: PhoneEntry = { labelKey: "contact.saltLake", number: "tel:8015785600", displayNumber: "801-578-5600" };
export const tollFreePhone: PhoneEntry = { labelKey: "contact.tollFree", number: "tel:8007773622", displayNumber: "800-777-3622" };

export const phoneEntries: PhoneEntry[] = [
  saltLakePhone,
  tollFreePhone,
  { labelKey: "contact.hawaii", noteKey: "contact.hawaiiNote", ...PLACEHOLDER },
  { labelKey: "contact.missionaryMedical", ...PLACEHOLDER },
  { labelKey: "contact.canadianBenefits", ...PLACEHOLDER },
  { labelKey: "contact.uhcInformation", ...PLACEHOLDER },
  { labelKey: "contact.uhcEligibility", ...PLACEHOLDER },
  { labelKey: "contact.metlifeDental", noteKey: "contact.metlifeDentalNote", ...PLACEHOLDER },
  { labelKey: "contact.tty", ...PLACEHOLDER },
];

export const businessHours: BusinessHours[] = [
  { daysKey: "contact.daysMWF", hoursKey: "contact.hours8to5" },
  { daysKey: "contact.daysThursday", hoursKey: "contact.hours9to5" },
];
