/**
 * Dashboard data shapes. The app declares these beside its hooks
 * (`useDashboardData`, `useDashboardAccumulators`, `displayPreferencesQueries`)
 * and in `benefits/types.ts` (`FamilyMember`), none of which the extract
 * includes; they are restated here from how the components use them.
 */

/** Same shape as `FamilyMember` in `src/features/benefits/types.ts`. */
export interface FamilyMember {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

/** One accumulator bucket as the dashboard cards draw it. */
export interface AccumulatorDisplay {
  used: number;
  total: number;
}

export interface ClaimSummary {
  id: string;
  provider: string;
  dateOfService: string;
  serviceDescription: string;
  billedAmount: number;
  status: string;
}

export interface DeductibleProgress {
  label: string;
  used: number;
  total: number;
}

export interface DashboardData {
  firstName: string;
  lastName: string;
  planName: string | null;
  recentClaims: ClaimSummary[];
}

export interface DashboardAccumulators {
  deductibleInNetwork: AccumulatorDisplay | null;
  oopMaxInNetwork: AccumulatorDisplay | null;
  oopMaxInNetworkIsUnlimited: boolean;
  deductibleOutOfNetwork: AccumulatorDisplay | null;
  oopMaxOutOfNetwork: AccumulatorDisplay | null;
  oopMaxOutOfNetworkIsUnlimited: boolean;
  familyDeductibleInNetwork: AccumulatorDisplay | null;
  familyOopMaxInNetwork: AccumulatorDisplay | null;
  familyOopMaxInNetworkIsUnlimited: boolean;
  dentalDeductible: AccumulatorDisplay | null;
  dentalAnnualMax: AccumulatorDisplay | null;
  familyMembers: FamilyMember[];
  familyBucketsAvailable: boolean;
}

export interface DisplayPreferences {
  cardOrder: string[];
  hiddenCards: string[];
}
