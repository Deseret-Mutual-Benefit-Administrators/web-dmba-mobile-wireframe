/**
 * Cost Compare (Talon MyMedicalShopper) feature types.
 * See ADR-138 (why a link-out) and ADR-140 (launch mechanics) in
 * docs/adr-log.md.
 */

/**
 * Response from `GET /cost-compare/launch`. `url` is Talon's OAuth callback
 * with a single-use token embedded — fetch it right before opening it, never
 * cache or prefetch it (ADR-140 #3).
 */
export interface CostCompareLaunchResponse {
  url: string;
  expiresAt: string;
}

/**
 * Whitelisted `languagePreference` values Talon accepts, derived from the
 * app's i18n language (ADR-140 #2). Talon uses bare Google-directory language
 * codes (`en`/`es`), not BCP-47 region tags — vendor-confirmed 2026-08-26
 * (ADR-147).
 */
export type TalonLanguagePreference = "en" | "es";
