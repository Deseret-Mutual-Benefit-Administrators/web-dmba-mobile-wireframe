import type { FamilyPermissionsResponse } from "./types";

const ALL_SECTIONS: FamilyPermissionsResponse["availableSections"] = [
  "claims",
  "priorAuths",
  "spendingAccounts",
  "retirement401k",
  "masterRetirement",
  "lifeInsurance",
];

/** Contract holder Jordan Avery managing two dependents. */
export const placeholderHolderResponse: FamilyPermissionsResponse = {
  viewerRole: "contractHolder",
  availableSections: ALL_SECTIONS,
  members: [
    { memberId: "123456790", firstName: "Sam", lastName: "Avery", relationship: "Spouse", grantedSections: ["claims", "priorAuths", "spendingAccounts"], isDefault: false, lastUpdated: "2026-08-20" },
    { memberId: "123456791", firstName: "Riley", lastName: "Avery", relationship: "Child", grantedSections: ["claims", "priorAuths"], isDefault: true },
  ],
  hipaaAuthorizedViewers: [],
};

/** Dependent Sam Avery's view of what Jordan has shared. */
export const placeholderDependentResponse: FamilyPermissionsResponse = {
  viewerRole: "dependent",
  availableSections: ALL_SECTIONS,
  members: [
    { memberId: "123456790", firstName: "Sam", lastName: "Avery", relationship: "Spouse", grantedSections: ["claims", "priorAuths", "spendingAccounts"], isDefault: false, grantedByMemberId: "123456789", grantedByName: "Jordan Avery", lastUpdated: "2026-08-20" },
  ],
  hipaaAuthorizedViewers: [
    { memberId: "123456789", firstName: "Jordan", lastName: "Avery", relationship: "Spouse", expiryDate: "2027-12-31" },
  ],
};

export const placeholderIndividualResponse: FamilyPermissionsResponse = {
  viewerRole: "individual",
  availableSections: ALL_SECTIONS,
  members: [],
  hipaaAuthorizedViewers: [],
};
