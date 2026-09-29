/**
 * Spending-account claim submission (FA-4) types.
 *
 * A "spending claim" is a reimbursement claim filed against a Healthcare FSA,
 * Limited Purpose FSA or Dependent Care FSA. It lives in its own feature
 * folder rather than under financial-accounts (already 16 components) or
 * claims (that's medical claims, and `app/claim/[id].tsx` would collide).
 *
 * These types mirror `AccountClaimModels.cs` in the API repo — **that file is
 * the contract**, and it deliberately diverges from the API's own Core models:
 * the claimant is flattened to a name on the claim list, the vendor's receipt
 * format bitmask is decoded to a MIME list, and the vendor's display bitmask is
 * decoded to booleans. Routes: `GET /accounts/claims/template`,
 * `GET /accounts/claims`, `GET /accounts/receipts/{fileKey}`.
 *
 * Two vendor facts shape everything here (ADR-108):
 *
 * 1. **Claims are routed by service category, never by account.** The vendor
 *    rejects account keys outright ("SCC is not allowed when an account is
 *    specified") and selects the funding account itself from the category.
 *    There is no account picker, and no account identifier to send. The HSA is
 *    not claimable at all — the vendor omits it from the category list.
 * 2. **The form is rendered from a vendor-supplied template**, not hardcoded.
 *    The template carries DMBA's own compliance-reviewed copy plus per-field
 *    flags and the option lists, and varies per participant with enrollment.
 */

// ---------------------------------------------------------------------------
// API contract — the claim-entry template
// ---------------------------------------------------------------------------

/**
 * The 15 field names observed in the vendor's displayable-field list. Unknown
 * names must be ignored rather than treated as an error — the vendor can add
 * fields without notice, and a crash on an unrecognised name would take the
 * whole form down.
 */
export type ClaimTemplateFieldName =
  | "form_instructions_text"
  | "certification_text"
  | "confirmation_text"
  | "item_instructions_text"
  | "receipt_instruction_text"
  | "reimbursement_method"
  | "account_type"
  | "service_category_code"
  | "notes"
  | "deductible_amt"
  | "coinsurance_amt"
  | "copay_amt"
  | "allow_participant_schedule_claims"
  | "claimant"
  | "service_end_date";

/**
 * Display metadata for one claim-form field.
 *
 * `displaySpecifications` is the vendor's raw bitmask, documented in the
 * v30.0 spec's `_1121.DisplayableFields` and decoded **client-side** in
 * `claimFormSchema.ts`'s `flagsFor` — visibility and editability both come
 * from it for any recognised value. ADR-108's original inference ("bit 0 =
 * editable, bit 1 = required") had bit 0 backwards: it is visibility, and
 * editability is `IsReadOnly`, inverted.
 *
 * `isEditable` / `isRequired` are the API's own decode of the same mask
 * (historically the only decode; see ADR-108) and are kept as the fail-open
 * fallback for a `displaySpecifications` value the client's table doesn't
 * recognise — including version skew, where an older API response omits the
 * raw bitmask entirely.
 */
export interface ClaimDisplayField {
  /** Vendor field identifier. Compared against {@link ClaimTemplateFieldName}. */
  fieldName: string;
  /**
   * Vendor label override, when supplied. It wins over our i18n label and
   * carries real meaning — the vendor labels the provider field "Provider" and
   * the notes field "Comments".
   */
  label: string | null;
  /** Fallback only — see the interface doc above. Not read when the client recognises `displaySpecifications`. */
  isEditable: boolean;
  /** Fallback only — see the interface doc above. Not read when the client recognises `displaySpecifications`. */
  isRequired: boolean;
  /**
   * True when the **API's own** decode of the vendor spec hit a value it
   * didn't recognise. Diagnostic only — the client decodes `displaySpecifications`
   * independently and has its own, separate fail-open rule for a value *it*
   * doesn't recognise (see `flagsFor`), so this flag does not gate client
   * behaviour.
   */
  isUnknownSpecification: boolean;
  /** Raw vendor bitmask. The client's `flagsFor` decodes this directly for any recognised value. */
  displaySpecifications: number;
}

/**
 * A person a claim can be filed for — the member or a covered dependent.
 * PHI: names are display-only and must never be logged.
 */
export interface ClaimClaimant {
  /** Opaque vendor key. Used for matching on submission — never displayed. */
  cardholderKey: number;
  firstName: string;
  lastName: string;
  initial: string | null;
  namePrefix: string | null;
  /** True when this is the employee rather than a dependent. */
  isEmployee: boolean;
}

/** A claimable service category. One of these routes the claim to an account. */
export interface ClaimServiceCategory {
  /** Vendor code submitted with the claim (e.g. "MEDICAL", "DAY"). */
  code: string;
  /** Vendor description (e.g. "Dependent Care"). Rendered raw, never via t(). */
  description: string | null;
  /** Whether the member may submit this category themselves. */
  isDirectSubmit: boolean;
  /**
   * Whether a service date after today is permitted. False on every DMBA
   * category — and *not* enforced by the vendor, which accepted a future-dated
   * claim, so the API enforces it and we mirror it (ADR-108).
   */
  allowFutureDatedClaims: boolean;
  allowESignature: boolean;
  allowPayProvider: boolean;
}

/**
 * Plan adjudication rules published on the template.
 *
 * **Advisory vendor metadata, not vendor enforcement.** The vendor publishes
 * these and then accepts claims that violate them (ADR-108) — so the API
 * applies them, and the client uses them only to warn the member early.
 */
export interface ClaimAdjudicationRules {
  allowSameMonthService: boolean;
  allowAnyLengthService: boolean;
  allowDiscountsAndCoupons: boolean;
  allowNoClaimantName: boolean;
  enableAiClaimEligibility: boolean;
}

/**
 * The window a claim's **service dates** must fall inside, derived server-side.
 *
 * Deliberately separate from `submitClaimsLastDate`, which is a different rule
 * (see {@link ClaimEntryTemplate.submitClaimsLastDate}). Bundling them lost the
 * deadline entirely for a member who has one but no plan window.
 *
 * Derived as a union across the member's claim-eligible accounts, because the
 * vendor picks the funding account from the category, so nobody upstream of
 * submission knows which account's window governs (ADR-108). Treat it as a UX
 * guard — the server validates again and its check is the one that counts.
 *
 * Null when the API knows neither end, **or only one** — the shape can't express
 * a half-open range, so half a window is reported as no window and the server
 * still applies whichever end it does know.
 *
 * Values arrive as .NET `DateTime` (`"2026-01-01T00:00:00"`), so pass them
 * through `toDateOnly` before comparing.
 */
export interface ClaimServiceWindow {
  startDate: string;
  endDate: string;
}

/**
 * The claim-entry template — the definition of the claim form for one
 * participant. Plan-specific: never hardcode any part of it.
 *
 * The copy fields carry DMBA's own configured, legally-reviewed member text
 * and are rendered **raw** — never passed through `t()`, never reworded.
 *
 * Note what is absent: no account picker and no account input anywhere. Claims
 * are category-routed and the vendor rejects account keys (ADR-108).
 */
export interface ClaimEntryTemplate {
  formInstructions: string | null;
  certificationText: string | null;
  confirmationText: string | null;
  documentationHelpText: string | null;
  itemInstructionsText: string | null;
  receiptInstructionText: string | null;
  /** Label for the receipt-attachment control (e.g. "Add Documentation"). */
  documentationLabel: string | null;
  /** Label for the link revealing {@link documentationHelpText}. */
  helpTextLinkLabel: string | null;
  allowESignature: boolean;
  allowPayProvider: boolean;
  claimants: ClaimClaimant[];
  serviceCategories: ClaimServiceCategory[];
  /**
   * Reimbursement methods offered. Only "Direct Deposit" was observed — with a
   * single option the field renders as read-only text rather than a picker.
   */
  reimbursementMethods: string[];
  fields: ClaimDisplayField[];
  rules: ClaimAdjudicationRules;
  /**
   * MIME types a receipt may be uploaded as. **Server-decided**: decoded from
   * the vendor's format mask and intersected with what the API actually
   * supports, so the client offers exactly these and never carries its own list
   * or decodes the mask itself. An empty list means receipts cannot be attached
   * at all — not "anything goes".
   */
  acceptedReceiptContentTypes: string[];
  /**
   * Maximum decoded receipt size in bytes, from server configuration —
   * deliberately below the vendor's own 10 MB (ADR-108). Never hardcoded here.
   */
  maxReceiptBytes: number;
  /**
   * Largest single claim amount the API will accept, in dollars.
   *
   * **A sanity bound on a mistyped figure — not a balance and not an
   * eligibility check.** Never present it to the member as what they have
   * available: whether an account can cover a claim is adjudication's business
   * and the vendor is the system of record for balances.
   */
  maxClaimAmount: number;
  /**
   * Window the claim's service dates must fall inside, or null when the API
   * couldn't determine one — in which case **apply no date-range rule at all**,
   * exactly as the server does, rather than inventing a window.
   */
  serviceWindow: ClaimServiceWindow | null;
  /**
   * The run-out deadline — the last date a claim may still be **filed**, whatever
   * its service date. **A separate rule from {@link serviceWindow}**, evaluated
   * against today rather than against the service date: it is what catches a
   * member filing in January for the year just ended. It is also *not* the
   * grace-period end, which is a different vendor date and deliberately excluded.
   *
   * A .NET `DateTime` on the wire, so pass it through `toDateOnly` before
   * comparing. Null when unknown, in which case the rule is skipped.
   */
  submitClaimsLastDate: string | null;
}

// ---------------------------------------------------------------------------
// API contract — submitted claims and receipts
// ---------------------------------------------------------------------------

/** Metadata for one receipt attached to a claim. */
export interface ClaimReceiptInfo {
  /**
   * The **retrievable** vendor file key, passed to
   * `GET /accounts/receipts/{fileKey}`. The claim's own top-level file key is
   * not a retrieval key (it read `1` on a claim with two receipts), so this
   * collection is the only path from a claim to its images (ADR-108).
   */
  fileKey: number;
  documentId: string | null;
  /** Usually null — the vendor discards the uploaded name. Fall back to the date. */
  originalFileName: string | null;
  /** ISO date, or null. */
  uploadDate: string | null;
}

/**
 * A receipt image. PHI — never logged, and not cached at any layer.
 *
 * `contentType` is **non-nullable**: the vendor returns no content type at all,
 * so the API sniffs the decoded magic bytes and fails the request rather than
 * returning a blob whose format it could not determine (ADR-108). The client
 * therefore never has to handle an unknown type on download.
 */
export interface ClaimReceiptContent {
  contentType: string;
  base64: string;
  contentLength: number;
}

/**
 * A receipt the member has just captured, held while they finish the claim form.
 *
 * Note what this deliberately does **not** carry: the image. `encryptedPath`
 * points at an AES-256-GCM blob under `documentDirectory/receipts/`, and reading
 * it back is an explicit decrypt. Plaintext receipt bytes must never enter the
 * TanStack Query cache or a Zustand store — `@tanstack/react-query-persist-client`
 * is installed and unwired, and one `persistQueryClient` call away from writing
 * PHI images into AsyncStorage in the clear. Contrast
 * {@link ClaimReceiptContent}, which *is* the bytes, on the download path, and
 * carries the same rule.
 *
 * See `src/shared/services/receiptCrypto.ts`.
 */
export interface CapturedReceipt {
  /** Stable local id — also the on-disk filename stem. Not a vendor key. */
  id: string;
  /** Path to the sealed blob. Never a path to plaintext. */
  encryptedPath: string;
  /** Sniffed from the magic bytes, never from a type the OS declared. */
  contentType: string;
  /** Decoded plaintext size, for the "2.1 MB of 4 MB" style UI. */
  byteLength: number;
}

/** A claim the member has submitted. */
export interface SpendingClaim {
  claimKey: number;
  trackingNumber: string | null;
  /**
   * Member-facing status, already stripped of the HTML the vendor embeds by the
   * API (the live vendor value is `"Entered<br>Not Reviewed"`). Free-form vendor
   * text — display with a neutral fallback, never use as a map key.
   */
  status: string | null;
  statusCode: number;
  /** ISO date, or null. */
  serviceStartDate: string | null;
  /** ISO date, or null. */
  serviceEndDate: string | null;
  /** ISO date, or null. */
  submittedDate: string | null;
  amount: number;
  deniedAmount: number;
  pendingAmount: number;
  balanceDue: number;
  serviceCategoryCode: string | null;
  serviceCategoryDescription: string | null;
  /**
   * Provider name. PHI. Comes from the vendor's `ClaimDesc`, which its own
   * display metadata labels "Provider" — the dedicated provider fields come
   * back empty, so this is a provider name and not a free-text description.
   */
  provider: string | null;
  /**
   * Member-entered comments (the vendor labels this "Comments"). PHI.
   *
   * Along with {@link provider}, this is the member's own text — render it
   * verbatim and **never** through `stripVendorHtml`, which would silently alter
   * what they typed.
   */
  notes: string | null;
  /**
   * Who the expense was for, as the vendor supplies it. PHI, display-only, and
   * **not authoritative** — the submission echo normalizes the claimant, so the
   * activity feed is the record of who a claim was for (ADR-108). Display as
   * supplied; never parse into name components, because the vendor formats it
   * inconsistently ("LAST, First" on new claims, "First LAST" on older ones).
   */
  claimantName: string | null;
  hasReceipt: boolean;
  receiptExpired: boolean;
  receipts: ClaimReceiptInfo[];
}

/**
 * The claim-list response. Newest first, and empty rather than a 404 when the
 * member has no claims.
 */
export interface SpendingClaimsResponse {
  items: SpendingClaim[];
}

/**
 * Claim submission payload — the wire shape of `POST /accounts/claims`.
 *
 * **No account field, and there will not be one.** A claim is routed by service
 * category; the vendor rejects a claim carrying an account key alongside one and
 * picks the funding account itself (ADR-108).
 *
 * The claimant is addressed **by key, never by name** — the server takes the
 * claimant record from the member's own template, so no caller-supplied identity
 * text ever reaches the vendor.
 *
 * There is no reimbursement-method field: only "Direct Deposit" is ever offered,
 * so there is nothing to choose and nothing to send.
 *
 * Dates are ISO `yyyy-MM-dd`; the API converts them to the WCF
 * `/Date(ms±offset)/` form the vendor requires.
 */
export interface SubmitClaimRequest {
  serviceCategoryCode: string;
  claimantCardholderKey: number;
  serviceStartDate: string;
  serviceEndDate: string;
  /**
   * Decimal dollars, because that is what the endpoint's `decimal` accepts.
   * **This is the one place money stops being integer cents** — the app holds
   * cents everywhere else, and `useSubmitSpendingClaim` performs the single
   * conversion at the wire boundary.
   */
  amount: number;
  /**
   * The provider name. **Required** — the server rejects a claim without one.
   * Client and server must move in step here: if the PO later makes it optional,
   * both sides relax together (see the base schema in claimFormSchema.ts).
   */
  provider: string;
  notes: string | null;
}

/** What the API echoes back after a successful submission. */
export interface SubmitClaimResponse {
  claimKey: number;
  trackingNumber: string | null;
  /** Vendor status, already stripped of HTML by the API. */
  status: string | null;
  /** Whether this claim needs documentation to be substantiated. */
  requiresReceipt: boolean;
}

/**
 * Result of a successful receipt attachment. The key is null when the vendor's
 * success response didn't parse — the upload still happened, and the durable
 * keys live on the claim's `receipts` list either way, so nothing needs to store
 * this (ADR-108).
 */
export interface ReceiptUploadResponse {
  fileKey: number | null;
}

// ---------------------------------------------------------------------------
// Derived form schema
// ---------------------------------------------------------------------------

/** Our stable field identifiers, independent of the vendor's field names. */
export type ClaimFormFieldId =
  | "formInstructions"
  | "itemInstructions"
  | "receiptInstructions"
  | "certification"
  | "confirmation"
  | "serviceCategory"
  | "claimant"
  | "serviceStartDate"
  | "serviceEndDate"
  | "amount"
  | "provider"
  | "notes"
  | "reimbursementMethod"
  | "deductibleAmount"
  | "coinsuranceAmount"
  | "copayAmount";

/** How the UI should render a field. */
export type ClaimFieldKind =
  /** Vendor copy block — rendered raw, never through `t()`. */
  | "vendorCopy"
  /** Picker backed by {@link ClaimFormField.options}. */
  | "select"
  /** Date picker, ISO `yyyy-MM-dd`. */
  | "date"
  /** Single-line text. */
  | "text"
  /** Multi-line text. */
  | "multiline"
  /** Currency input, held as typed text and parsed to integer cents. */
  | "amount"
  /** Non-editable text (a single-option reimbursement method). */
  | "readOnlyText"
  /** Vendor-supplied value shown for information; DMBA collects no input. */
  | "displayOnly";

/** One option in a `select` field. Labels are vendor-supplied — rendered raw. */
export interface ClaimFormOption {
  value: string;
  label: string;
}

/** Whether a field came from the template or from our fixed base schema. */
export type ClaimFieldSource = "template" | "base";

/**
 * Per-field display flags, taken from the API's decoded booleans. The raw
 * `displaySpecifications` is never read on the client.
 */
export interface ClaimFieldDisplayFlags {
  /**
   * Always true today, so it carries no information from the vendor — there is
   * no observed "hide" encoding. Kept because the schema and validator both
   * branch on it structurally, and a future vendor flag would land here.
   */
  visible: boolean;
  editable: boolean;
  required: boolean;
}

/** One renderable field in the claim form. */
export interface ClaimFormField {
  id: ClaimFormFieldId;
  kind: ClaimFieldKind;
  /** i18n key for our label. Null for copy blocks, which have no label. */
  labelKey: string | null;
  /**
   * Vendor's label override. When set, render this verbatim instead of
   * translating {@link labelKey} — it is vendor copy, not a key.
   */
  label: string | null;
  /**
   * Raw vendor copy for `vendorCopy` and `readOnlyText` fields. Rendered raw.
   */
  content: string | null;
  flags: ClaimFieldDisplayFlags;
  options: ClaimFormOption[];
  source: ClaimFieldSource;
}

/** The claim form, derived from a template. */
export interface ClaimFormSchema {
  /** Renderable fields in display order. */
  fields: ClaimFormField[];
  /** The category list, for validation and the category-first step. */
  categories: ClaimServiceCategory[];
  /** The eligible claimants, for validation. */
  claimants: ClaimClaimant[];
  /** Accepted receipt formats and the size ceiling — both server-decided. */
  receipt: {
    /** MIME types, exactly as the API supplied them. Empty = cannot attach. */
    acceptedContentTypes: string[];
    maxBytes: number;
    /** Vendor's label for the attach control, when supplied. */
    attachLabel: string | null;
    helpLinkLabel: string | null;
    helpText: string | null;
  };
  /**
   * Whether the vendor offers participant-scheduled claims
   * (`allow_participant_schedule_claims`). A capability flag, not a field —
   * out of scope for FA-4, surfaced so it isn't mistaken for a missing input.
   */
  allowsScheduledClaims: boolean;
}

// ---------------------------------------------------------------------------
// Form values and validation
// ---------------------------------------------------------------------------

/** The member's in-progress claim. All values are strings as typed. */
export interface ClaimFormValues {
  serviceCategoryCode: string;
  /** {@link ClaimClaimant.cardholderKey} as a string, for select values. */
  claimantKey: string;
  /** ISO `yyyy-MM-dd`. */
  serviceStartDate: string;
  /** ISO `yyyy-MM-dd`, or "" when the member left it blank. */
  serviceEndDate: string;
  /**
   * Raw text exactly as typed. Parsed with `parseAmountInput` to integer
   * cents — money is never held as a float.
   */
  amount: string;
  provider: string;
  notes: string;
  reimbursementMethod: string;
}

/**
 * Everything the validator needs beyond the schema and the values.
 *
 * The date window and the amount ceiling are **UX guards, not the check** — they
 * stop a doomed submission before it leaves the device. The server validates
 * every one of these authoritatively and its answer is the one that counts, so
 * each is nullable and is skipped when unknown rather than blocking a submission
 * the server might well accept.
 */
export interface ClaimValidationRules {
  /**
   * From the template's rules. Advisory vendor metadata that the vendor does
   * not enforce — the API does, and we mirror it (ADR-108).
   */
  allowSameMonthService: boolean;
  /**
   * The service-date range from the template. Skipped when null. Values may
   * carry a time component — the validator truncates them.
   */
  serviceWindow: ClaimServiceWindow | null;
  /**
   * The run-out deadline, a **separate rule** evaluated against today rather than
   * against the service date. Kept apart from {@link serviceWindow} because a
   * member can have one without the other. Skipped when null.
   */
  submitClaimsLastDate: string | null;
  /**
   * Upper bound on the claim amount, in **cents** (the template publishes
   * `maxClaimAmount` in dollars; the caller converts). Unbounded when null. A
   * sanity bound on a mistyped figure, never presented as an available balance.
   */
  maxAmountCents: number | null;
  /** Today as ISO `yyyy-MM-dd`. Injected so validation is deterministic. */
  today: string;
}

/**
 * One evaluated validation rule. Mirrors `PasswordRule` from
 * settings/services/passwordValidation.ts, plus the field the rule attaches
 * to so the UI can show the message inline.
 */
export interface ClaimFormRule {
  /** Stable rule identifier (e.g. "amountPositive"). */
  key: string;
  field: ClaimFormFieldId;
  /** i18n key for the message. Never literal text. */
  messageKey: string;
  /**
   * Interpolation values the message needs, beyond the field label the renderer
   * always supplies.
   *
   * **A rule whose message has a placeholder must populate this**, because the
   * renderer cannot know what a given key wants. Omitting it does not fail
   * loudly — i18next leaves the placeholder in place, so the member reads a
   * literal `{{date}}` in an error message. That is exactly what shipped for
   * `submitDeadlinePassed`, and the reason this field exists rather than the
   * render site special-casing individual keys.
   */
  messageValues?: Record<string, string>;
  passed: boolean;
}

export interface ClaimFormValidationResult {
  isValid: boolean;
  /** Every rule that applied, passed or not. Failures are `!passed`. */
  rules: ClaimFormRule[];
}

// ---------------------------------------------------------------------------
// Status display
// ---------------------------------------------------------------------------

/**
 * Display tone for a claim status. `neutral` is the fallback for anything
 * unrecognised — a v0.8.8 bug had an unknown status defaulting to a denial
 * tone, which told members their claim was denied when it wasn't.
 */
export type ClaimStatusTone = "positive" | "pending" | "negative" | "neutral";
