/**
 * Feature-level types for the custom authenticator (ADR-195).
 *
 * The app re-exports its native-module contract from `@/modules/dmba-okta-devices`,
 * which the UI extract does not include. The two shapes this UI reads are
 * restated below from how the screens use them; the rest is verbatim.
 */

/** Why the identity provider dropped an enrollment server-side. */
export type EnrollmentInvalidationReason = "biometricKeyInvalid" | "removed";

/** An enrollment as the settings screen shows it: the device label and when it was set up. */
export interface OktaEnrollment {
  deviceLabel: string;
  /** ISO date; absent on iOS, where the SDK exposes none. */
  createdAt?: string;
}

/**
 * What the "Sign-in verification" settings row is showing right now.
 */
export type EnrollmentState =
  | "unsupported"
  | "notEnrolled"
  | "pushPermissionDenied"
  | "biometricsNotEnrolled"
  | "enrolling"
  | "enrolled"
  | "invalidated"
  | "error";

/**
 * The last thing that went wrong, kept separate from `EnrollmentState`.
 */
export type EnrollmentFailure =
  | { kind: "invalidated"; reason: EnrollmentInvalidationReason }
  | { kind: "failed"; message: string };

/** Terminal outcomes of the sign-in approval screen (the app's `useVerifyChallenge`). */
export type VerifyResult =
  | "approved"
  | "denied"
  | "expired"
  | "userVerificationCancelled"
  | "userVerificationFailed"
  | "failed";
