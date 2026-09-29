/**
 * Claims feature types.
 * These are concrete interfaces matching the API contract.
 * Kept in sync with the API via `npm run generate-types` — review
 * types.generated.ts after running to catch contract changes.
 */

export type ClaimStatus = "Pending" | "Processing" | "Processed" | "Denied" | "Adjusted";

export type ClaimType = "Medical" | "Dental" | "Pharmacy";

export interface Claim {
  id: string;
  claimNumber: string;
  claimType: ClaimType;
  status: ClaimStatus;
  provider: string;
  dateOfService: string;
  billedAmount: number;
  allowedAmount: number;
  memberResponsibility: number;
  planPaid: number;
  serviceDescription: string;
  submittedDate: string;
}

export interface ClaimDetail extends Claim {
  eobDocumentId: string | null;
  serviceLines: ServiceLine[];
}

export interface ServiceLine {
  id: string;
  procedureCode: string;
  description: string;
  billedAmount: number;
  allowedAmount: number;
  memberResponsibility: number;
  deductible: number;
  coinsurance: number;
  copay: number;
}

// Filters for claims list
export interface ClaimsFilter {
  status?: ClaimStatus;
  claimType?: ClaimType;
  dateRange?: { start: string; end: string };
  searchQuery?: string;
  /** Server-side family member filter. Omit for the authenticated user's own claims. */
  familyMemberId?: string;
}
