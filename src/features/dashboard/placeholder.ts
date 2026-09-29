/**
 * Static placeholder data for the Home dashboard. Fictitious people, round
 * amounts, 2026 dates. The member id is a made-up display value.
 */
import type { DashboardAccumulators, DashboardData, DisplayPreferences } from "./types";

export const placeholderUser = {
  firstName: "Jordan",
  lastName: "Avery",
  memberId: "123456789",
};

export const placeholderDashboard: DashboardData = {
  firstName: "Jordan",
  lastName: "Avery",
  planName: "DMBA Sample PPO",
  recentClaims: [
    { id: "sample-claim", provider: "Riverside Family Clinic", dateOfService: "2026-09-14T00:00:00", serviceDescription: "Office visit", billedAmount: 180, status: "Processed" },
    { id: "sample-claim-2", provider: "Valley Imaging Center", dateOfService: "2026-09-02T00:00:00", serviceDescription: "X-ray", billedAmount: 420, status: "Pending" },
    { id: "sample-claim-3", provider: "Lakeside Pharmacy", dateOfService: "2026-08-21T00:00:00", serviceDescription: "Prescription", billedAmount: 40, status: "Denied" },
  ],
};

export const placeholderAccumulators: DashboardAccumulators = {
  deductibleInNetwork: { used: 600, total: 1500 },
  oopMaxInNetwork: { used: 1200, total: 5000 },
  oopMaxInNetworkIsUnlimited: false,
  deductibleOutOfNetwork: { used: 0, total: 3000 },
  oopMaxOutOfNetwork: null,
  oopMaxOutOfNetworkIsUnlimited: true,
  familyDeductibleInNetwork: { used: 1400, total: 3000 },
  familyOopMaxInNetwork: { used: 2600, total: 10000 },
  familyOopMaxInNetworkIsUnlimited: false,
  dentalDeductible: { used: 50, total: 50 },
  dentalAnnualMax: { used: 400, total: 1500 },
  familyMembers: [
    { memberId: "dep-1", firstName: "Sam", lastName: "Avery", relationship: "Spouse" },
    { memberId: "dep-2", firstName: "Riley", lastName: "Avery", relationship: "Child" },
  ],
  familyBucketsAvailable: true,
};

/** Saved preferences: all cards shown, default order. */
export const placeholderDisplayPreferences: DisplayPreferences = {
  cardOrder: [],
  hiddenCards: [],
};
