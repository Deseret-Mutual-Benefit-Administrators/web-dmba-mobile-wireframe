/**
 * Prior Authorizations feature types.
 * These match the API contract defined in docs/integrations/appian-ppa-api-contract.md.
 * Data source: Appian PPA schema, proxied by DMBA Mobile API.
 */

/** Five display-facing status buckets — mapped from Appian ExternalStatus by the API (ADR-082). */
export type PriorAuthStatusBucket =
  | "Submitted"
  | "In Progress"
  | "Approved"
  | "Denied"
  /**
   * A request that ended without a determination — withdrawn, expired, duplicate.
   * Added 2026-09-08 (ADR-187) after a SELECT DISTINCT against the PPA database showed
   * `Closed` is a real production status. A Closed authorization that *does* carry a
   * determination is bucketed Approved/Denied by the API and never reaches this value.
   */
  | "Closed";

/** A single procedure line within an authorization. */
export interface PriorAuthLine {
  lineNumber: number;
  procedureCode: string;
  procedureDescription?: string;
  units?: number;
  approvedUnits?: number;
  expectedFromDate?: string;
  expectedToDate?: string;
  status: string;
}

/**
 * Summary shape returned by GET /prior-auths.
 * Matches PriorAuthSummaryResponse from the API.
 */
export interface PriorAuth {
  id: string;
  displayId: string;
  /** Single service description, or literal "Multiple Services" when multi-line. */
  service: string;
  provider: string;
  memberId: string;
  /** "FirstName LastName" — drives the family-member pill on the card. */
  member: string;
  requestDate: string;
  /** ISO date — nullable; API declares string? DateNeeded. */
  dateNeeded?: string;
  /**
   * Number of procedure lines on this authorization.
   * When > 1, the card renders the localized "Multiple Services" label
   * instead of `service`. The `service` field still holds the primary
   * line's description for screen-reader context.
   */
  lineCount: number;
  statusBucket: PriorAuthStatusBucket;
  /** Raw Appian ExternalStatus — surfaced for analytics/support tooling. */
  externalStatus: string;
  decisionDate?: string;
  /**
   * Primary diagnosis description (optional at summary level).
   * Populated when the API includes diagnosis on the list response.
   * Shown as the third line of the card's service/provider/diagnosis stack.
   */
  diagnosis?: string;
}

/**
 * Structured determination letter fields returned by
 * GET /prior-auths/{id}/determination-letter (ADR-085).
 * Rendered inline on the detail screen — no HTML, no WebView.
 */
export interface DeterminationLetterEffectiveDates {
  validFrom: string;
  validThrough: string;
}

export interface DeterminationLetterFields {
  authorizationId: string;
  authorizationNumber: string | null;
  decision: string;
  generatedDate: string;
  memberName: string;
  providerName: string;
  procedureDescription: string;
  summaryText: string;
  criteriaNotMetText: string | null;
  effectiveDates: DeterminationLetterEffectiveDates | null;
  nextSteps: string | null;
}

/**
 * Full detail shape returned by GET /prior-auths/{id}.
 * Extends PriorAuth with diagnosis, physician, auth number, lines, etc.
 */
export interface PriorAuthDetail extends PriorAuth {
  diagnosis: string;
  diagnosisCode?: string;
  requestingPhysician: string;
  authorizationNumber?: string;
  validThrough?: string;
  notes?: string;
  denialReason?: string;
  lines: PriorAuthLine[];
}

