/**
 * Placeholder data for the sign-in screen. The MFA factor shape follows the
 * app's `MfaFactor` (from `oktaAuth.ts`, not in the extract). Profile values
 * are masked, as the identity provider returns them.
 */
export interface MfaFactor {
  id: string;
  factorType: string;
  profile?: { phoneNumber?: string; email?: string };
}

export const placeholderFactors: MfaFactor[] = [
  { id: "factor-push", factorType: "push" },
  { id: "factor-sms", factorType: "sms", profile: { phoneNumber: "+1 XXX-XXX-XX00" } },
  { id: "factor-totp", factorType: "token:software:totp" },
  { id: "factor-email", factorType: "email", profile: { email: "j•••@example.com" } },
];

/** The app shows `Constants.expoConfig.version`. */
export const APP_VERSION = "0.10.3";
