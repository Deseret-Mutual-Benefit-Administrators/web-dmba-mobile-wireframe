/**
 * Medications feature types — drug reference lookups and the member's
 * medicine cabinet. These match the API DTOs exactly (same field names, same
 * shapes).
 *
 * For .NET devs: these are the client-side equivalents of the API response
 * DTOs in DMBA.Mobile.Api/Models/SearchResponses.cs.
 *
 * Nullability note: `tier`, `copayDisplay`, `requiresPriorAuth` and
 * `requiresStepTherapy` are nullable because the API stopped substituting a
 * default for a field the drug reference didn't supply. `null` means
 * *unknown*, not "Tier 1" and not "no prior approval needed" — every screen
 * renders it as an explicit "Not available", never as a value the member
 * could act on.
 */

export interface MedicationSummary {
  name: string;
  genericName: string;
  brandName: string | null;
  ndcCode: string;
  /** Formulary tier, or null when the reference doesn't carry one. */
  tier: string | null;
  /** Member cost string, or null when the reference doesn't carry one. */
  copayDisplay: string | null;
  description: string | null;
  /** null = unknown (search results don't resolve this), not "no". */
  requiresPriorAuth: boolean | null;
  /** null = unknown, not "no". */
  requiresStepTherapy: boolean | null;
}

export interface MedicationDetail extends MedicationSummary {
  alternatives: MedicationEquivalent[];
}

export interface MedicationEquivalent {
  name: string;
  ndcCode: string;
  tier: string | null;
}

export interface PrescriptionHistory {
  drugName: string;
  genericName: string;
  fillDate: string;
  daysSupply: number;
  pharmacy: string;
}

export interface MedicineCabinetItem {
  medicationId: string;
  drugName: string;
  genericName: string | null;
  addedAt: string;
  source: "RxHistory" | "ManualAdd";
}

export interface MedicationSearchParams {
  q?: string;
}

/**
 * The API's shared paged envelope. Each feature carries its own copy rather
 * than importing another feature's (same convention as `chat` and
 * `messaging`) — the shape is the API's, not any one feature's.
 */
export interface PaginatedResponse<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  items: T[];
}

export interface AddMedicineCabinetRequest {
  medicationId: string;
  drugName: string;
  genericName: string | null;
}
