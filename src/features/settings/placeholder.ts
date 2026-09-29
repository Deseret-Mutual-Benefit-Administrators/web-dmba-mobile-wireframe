/**
 * Static stand-ins for the profile slice's hooks (useAuth, useFamilyMembers,
 * useMedicineCabinet, useNotificationPreferences, usePrivacySecurity).
 * Every value is fictitious.
 */
import type { NotificationPreferences } from "./types";

/** Shape of the app's `UserProfile` (authStore) — the fields the Profile tab reads. */
export interface UserProfile {
  memberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  planName: string;
  groupNumber: string;
  effectiveDate: string;
  email: string;
  phone: string;
  mailingAddress: string;
}

export const placeholderUser: UserProfile = {
  memberId: "123456789",
  firstName: "Jordan",
  lastName: "Avery",
  dateOfBirth: "04/12/1985",
  planName: "Sample Medical Plan",
  groupNumber: "0000",
  effectiveDate: "01/01/2026",
  email: "jordan.avery@mail.test",
  phone: "(800) 000-0000",
  mailingAddress: "100 Sample Street, Anytown, UT 00000",
};

/** Shape of benefits' `FamilyMember`. */
export interface FamilyMember {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

export const placeholderFamilyMembers: FamilyMember[] = [
  { memberId: "123456790", firstName: "Sam", lastName: "Avery", relationship: "Spouse" },
  { memberId: "123456791", firstName: "Riley", lastName: "Avery", relationship: "Child" },
];

/** Shape of medications' `MedicineCabinetItem`. */
export interface MedicineCabinetItem {
  medicationId: string;
  drugName: string;
  genericName?: string;
  source: "RxHistory" | "ManualAdd";
  addedAt: string;
}

export const placeholderMedicineCabinet: MedicineCabinetItem[] = [
  { medicationId: "med-1", drugName: "Sample Brand 10 MG Tablet", genericName: "samplezepam", source: "RxHistory", addedAt: "2026-08-14T12:00:00Z" },
  { medicationId: "med-2", drugName: "Example Allergy Relief", genericName: "examplatadine", source: "ManualAdd", addedAt: "2026-09-02T12:00:00Z" },
];

export const placeholderNotificationPreferences: NotificationPreferences = {
  eobNotifications: true,
  wellnessReminders: true,
  productInfo: false,
  benefitsUpdates: true,
  claimsStatusChanges: true,
  policyChanges: true,
  paymentReminders: true,
  preventiveCareReminders: true,
  prescriptionRefillReminders: true,
  promotionalCommunications: false,
};

export const placeholderAppVersion = "0.10.3";
