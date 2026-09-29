/**
 * Family permissions feature types.
 * Matches the API contract from Part A.2/A.4 of the family-permissions plan —
 * `GET/PUT /member/family-permissions` and the `onBehalf` fields on
 * `/accounts/*`. See `docs/dev-complete-plan-2026-09.md` §5 Block 1 item #2.
 */

/** The six sections a contract holder can grant a dependent, in two groups. */
export type FamilyPermissionSection =
  | "claims"
  | "priorAuths"
  | "spendingAccounts"
  | "retirement401k"
  | "masterRetirement"
  | "lifeInsurance";

export type FamilyPermissionGroup = "health" | "financial";

/** Which role the caller has on this household — decides which render the screen shows. */
export type FamilyPermissionsViewerRole = "contractHolder" | "dependent" | "individual";

/**
 * One dependent's granted-sections row, from a holder's point of view (one entry per
 * dependent), or the caller's own row when the caller is the dependent (`grantedBy*` set).
 */
export interface FamilyPermissionGrant {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  /** The effective granted-sections list — the server has already applied defaults (health
   * open / financial closed) when `isDefault` is true; never re-derive this on the client. */
  grantedSections: FamilyPermissionSection[];
  /** True when the holder has never saved a row for this dependent — `grantedSections` is
   * still the effective (default) list, just not yet authoritative. */
  isDefault: boolean;
  /** Set only on a dependent's own entry — who granted these sections. */
  grantedByMemberId?: string;
  grantedByName?: string;
  lastUpdated?: string;
}

/** A household member with an active HIPAA authorization on file to see the caller's health information. */
export interface HipaaAuthorizedViewer {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  expiryDate?: string;
}

export interface FamilyPermissionsResponse {
  viewerRole: FamilyPermissionsViewerRole;
  availableSections: FamilyPermissionSection[];
  members: FamilyPermissionGrant[];
  hipaaAuthorizedViewers: HipaaAuthorizedViewer[];
}

/** `PUT /member/family-permissions/{dependentMemberId}` request body — full replace. */
export interface UpdateFamilyPermissionsRequest {
  grantedSections: FamilyPermissionSection[];
}

/** A section's static display metadata — label/description i18n keys and which group it sits in. */
export interface FamilyPermissionSectionDefinition {
  key: FamilyPermissionSection;
  labelKey: string;
  descriptionKey: string;
  group: FamilyPermissionGroup;
}
