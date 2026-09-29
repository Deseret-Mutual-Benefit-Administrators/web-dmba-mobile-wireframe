/**
 * Static placeholder data for the claims slice — generic, fictitious, shaped by
 * `types.ts`. Replaces `claimsQueries`, `useFamilyMembers`, `useAuth` and
 * `useCoverageJourney`.
 */
import type { Claim, ClaimDetail, ServiceLine } from "./types";
import type { CoverageJourney, JourneyPhaseView } from "./services/coverageJourney";

/** Same shape as `Accumulator` in `src/features/benefits/types.ts`. */
export interface Accumulator {
  type: string;
  used: number;
  total: number;
  label: string;
}

/** Same shape as `FamilyMember` in `src/features/benefits/types.ts`. */
export interface FamilyMember {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

/** Same shape as the app's `MonthlyCostBar` (claimsQueries). */
export interface MonthlyCostBar {
  month: string;
  totalBilled: number;
  yourResponsibility: number;
}

export const placeholderUser = { firstName: "Jordan", lastName: "Avery", memberId: "M-000001" };

export const placeholderFamilyMembers: FamilyMember[] = [
  { memberId: "M-000002", firstName: "Sam", lastName: "Avery", relationship: "Spouse" },
  { memberId: "M-000003", firstName: "Riley", lastName: "Avery", relationship: "Child" },
];

const base = (c: Omit<Claim, "submittedDate"> & { submittedDate?: string }): Claim => ({
  submittedDate: c.dateOfService,
  ...c,
});

export const placeholderClaims: Claim[] = [
  base({ id: "processed", claimNumber: "C-000123", claimType: "Medical", status: "Processed", provider: "Valley Family Clinic", dateOfService: "2026-03-24T12:00:00", billedAmount: 200, allowedAmount: 150, memberResponsibility: 40, planPaid: 110, serviceDescription: "Office visit - follow-up", submittedDate: "2026-03-26T12:00:00" }),
  base({ id: "pending", claimNumber: "C-000124", claimType: "Medical", status: "Pending", provider: "Lakeside Imaging Center", dateOfService: "2026-03-19T12:00:00", billedAmount: 900, allowedAmount: 0, memberResponsibility: 0, planPaid: 0, serviceDescription: "MRI, knee" }),
  base({ id: "denied", claimNumber: "C-000125", claimType: "Medical", status: "Denied", provider: "Northside Urgent Care", dateOfService: "2026-03-02T12:00:00", billedAmount: 300, allowedAmount: 0, memberResponsibility: 300, planPaid: 0, serviceDescription: "Urgent care visit" }),
  base({ id: "processing", claimNumber: "C-000126", claimType: "Dental", status: "Processing", provider: "Bright Smile Dental", dateOfService: "2026-02-20T12:00:00", billedAmount: 250, allowedAmount: 200, memberResponsibility: 50, planPaid: 150, serviceDescription: "Cleaning and exam" }),
  base({ id: "pharmacy", claimNumber: "C-000127", claimType: "Pharmacy", status: "Processed", provider: "Main Street Pharmacy", dateOfService: "2026-02-11T12:00:00", billedAmount: 60, allowedAmount: 40, memberResponsibility: 10, planPaid: 30, serviceDescription: "Prescription fill" }),
  base({ id: "adjusted", claimNumber: "C-000128", claimType: "Medical", status: "Adjusted", provider: "Valley Family Clinic", dateOfService: "2026-01-28T12:00:00", billedAmount: 400, allowedAmount: 300, memberResponsibility: 100, planPaid: 200, serviceDescription: "Lab work" }),
  base({ id: "dental-2", claimNumber: "C-000129", claimType: "Dental", status: "Processed", provider: "Bright Smile Dental", dateOfService: "2026-01-09T12:00:00", billedAmount: 150, allowedAmount: 120, memberResponsibility: 20, planPaid: 100, serviceDescription: "X-rays" }),
];

/** Grand total the list header counts against ("7 of 12 claims"). */
export const placeholderClaimsTotal = 12;

const lines: ServiceLine[] = [
  { id: "sl-1", procedureCode: "99213", description: "Office visit, established patient", billedAmount: 150, allowedAmount: 110, memberResponsibility: 30, deductible: 0, coinsurance: 10, copay: 20 },
  { id: "sl-2", procedureCode: "36415", description: "Blood draw", billedAmount: 50, allowedAmount: 40, memberResponsibility: 10, deductible: 10, coinsurance: 0, copay: 0 },
];

export function placeholderClaimDetail(id: string): ClaimDetail {
  const claim = placeholderClaims.find((c) => c.id === id) ?? placeholderClaims[0];
  const hasLines = claim.status !== "Pending";
  return {
    ...claim,
    eobDocumentId: claim.status === "Processed" || claim.status === "Denied" ? "eob-1" : null,
    serviceLines: hasLines ? lines : [],
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const bars = (billed: number[], resp: number[]): MonthlyCostBar[] =>
  MONTHS.map((month, i) => ({ month, totalBilled: billed[i] ?? 0, yourResponsibility: resp[i] ?? 0 }));

export const placeholderCostComparison = {
  currentYear: 2026,
  lastYearNum: 2025,
  thisYear: bars([1000, 500, 900], [200, 100, 150]),
  lastYear: bars([300, 0, 600, 200, 0, 800, 100, 0, 400, 0, 250, 500], [60, 0, 120, 40, 0, 200, 20, 0, 80, 0, 50, 100]),
};

export const placeholderJourney: {
  journey: CoverageJourney;
  phases: [JourneyPhaseView, JourneyPhaseView, JourneyPhaseView];
  memberCoinsurancePct: number | null;
} = {
  journey: { phase: "beforeDeductible", oopMaxIsUnlimited: false, deductibleIsWaived: false },
  phases: [
    { key: "deductible", state: "current", accumulator: { type: "deductible", used: 600, total: 1500, label: "Deductible" } },
    { key: "coinsurance", state: "upcoming", accumulator: null },
    { key: "oopMax", state: "upcoming", accumulator: { type: "oopMax", used: 600, total: 4000, label: "Out-of-pocket max" } },
  ],
  memberCoinsurancePct: 20,
};
