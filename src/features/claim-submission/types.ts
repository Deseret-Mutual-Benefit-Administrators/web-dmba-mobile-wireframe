/**
 * Types for the "Submit a claim" (medical) flow (#5,
 * `docs/dev-complete-plan-2026-09.md` §4).
 *
 * There is no claims-system write API, so this flow doesn't create a claim at
 * all — it files a typed request thread on the secure-messaging store
 * (`kind: "claimSubmission"`, `topic: "claims"`) that customer service works
 * from the admin inbox. The wizard shape (step machine, review, discard guard)
 * mirrors `spending-claims`'s `useSubmitClaimFlow`; the actual submission goes
 * through messaging's `useCreateThread`/`useMessageAttachments`, not a vendor
 * claim API.
 */

/** One selectable patient — the member themself, or a HIPAA-visible household member. */
export interface ClaimSubmissionPatientOption {
  /** The real member id — the member's own for self, a household member's otherwise. */
  memberId: string;
  label: string;
  /** Relationship qualifier ("Spouse", "Child", ...) — absent for self. */
  secondary?: string;
  /** True for the member submitting the claim; false for anyone else in the household. */
  isSelf: boolean;
}

export type AlreadyPaid = "yes" | "no";

/** The wizard's editable form state. Everything starts empty/unselected. */
export interface ClaimSubmissionFormValues {
  /** A {@link ClaimSubmissionPatientOption.memberId}, or "" when not yet chosen. */
  patientMemberId: string;
  providerName: string;
  /** ISO `yyyy-MM-dd`, or "" when not yet chosen. */
  serviceDate: string;
  /** As typed — normalized to a two-decimal string only at submit time. */
  amount: string;
  serviceDescription: string;
  alreadyPaid: AlreadyPaid | "";
}
