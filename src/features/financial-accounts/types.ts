/**
 * Financial accounts feature types.
 * Matches the API contract from AccountsController (v0.7).
 */

/**
 * A transaction's attached receipts use the **same** type as a claim's, imported rather than
 * re-declared. ADR-108's "one viewer serves both" only holds if both sides are literally one shape:
 * a parallel local copy would let the two drift, and the viewer would then have to branch on where a
 * receipt came from — which is precisely what the shared server-side mapper exists to prevent. A
 * type-only import, so nothing is pulled in at runtime.
 */
import type { ClaimReceiptInfo } from "@/src/features/spending-claims/types";

export type AccountType = "hsa" | "fsa" | "lpfsa" | "depc" | "401k" | "retirement" | "life";

/** Which FSA-family account this is — healthcare FSA, Limited Purpose FSA, or Dependent Care FSA. */
export type FsaType = "healthcare" | "lpfsa" | "depc";

export type TransactionStatus = "Approved" | "Pending" | "Denied";

// --- Summary (dashboard) ---

export interface FinancialSummary {
  hsa: HsaSummary | null;
  fsa: FsaSummary | null;
  retirement401k: RetirementSummary | null;
  masterRetirement: MrpSummary | null;
  lifeInsurance: LifeInsuranceSummary | null;
  lpfsa: FsaSummary | null;
  depc: FsaSummary | null;
  /**
   * Summary fields whose vendor could not be read on this request (ADR-139), e.g.
   * `["hsa","fsa","lpfsa","depc"]` or `["retirement401k"]`. A field listed here is null
   * because the API *doesn't know*, not because the member isn't enrolled — the dashboard
   * still shows the card so the member sees "try again" instead of a missing account.
   */
  unavailable: FinancialSummaryAccountKey[];
  /**
   * Which financial family-permission sections the caller is reading on behalf of a
   * contract holder, keyed by the section's wire key from the family-permissions
   * vocabulary — **not** by {@link FinancialSummaryAccountKey}. `spendingAccounts` is
   * one key covering HSA/FSA/LPFSA/DEPC together, since a single grant covers all
   * four. Valued with the holder's display name — e.g. `{ retirement401k: "Jane
   * Doe" }`. Empty when every account here belongs to the caller (reads only — see
   * ADR-156).
   */
  onBehalf: Partial<Record<FinancialOnBehalfSection, string>>;
}

/** The financial-account family-permission section keys `FinancialSummary.onBehalf` can carry. */
export type FinancialOnBehalfSection =
  | "spendingAccounts"
  | "retirement401k"
  | "masterRetirement"
  | "lifeInsurance";

/** The per-account fields of `FinancialSummary` — the values `unavailable` can carry. */
export type FinancialSummaryAccountKey =
  | "hsa"
  | "fsa"
  | "lpfsa"
  | "depc"
  | "retirement401k"
  | "masterRetirement"
  | "lifeInsurance";

export interface HsaSummary {
  cashBalance: number;
  investmentBalance: number;
  totalBalance: number;
}

export interface FsaSummary {
  balance: number;
  annualElection: number;
  remainingBalance: number;
  fsaType: FsaType;
}

export interface RetirementSummary {
  totalBalance: number;
  vestedBalance: number;
}

export interface MrpSummary {
  yearsOfCredit: number;
  estimatedMonthlyPayment: number;
}

export interface LifeInsuranceSummary {
  groupTermLifeAmount: number;
}

// --- HSA Detail ---

export interface HsaAccount {
  cashBalance: number;
  /**
   * The vendor's `PortfolioBalance` ("HSA Investment Balance"), or null when the
   * vendor did not report one.
   *
   * **Null means "do not display", never "zero".** This was a plain `number`
   * hardcoded to `0m` by the API — the same bug class `annualLimit` had
   * (ADR-117), one field over (ADR-1xx / audit finding V2) — which rendered as
   * "Investment Balance $0.00" against live data even though the account held
   * no investments at all.
   */
  investmentBalance: number | null;
  /**
   * Client-recomputed cash + investment balance. Kept as the fallback total —
   * prefer {@link totalHsaBalance} when the vendor supplied one, since that is
   * the vendor's own authoritative figure rather than an app-side sum.
   */
  totalBalance: number;
  /**
   * The vendor's own `TotalHSABalance`, when reported — the authoritative total
   * rather than a client recompute of cash + investment. Null when the vendor
   * did not report one, in which case fall back to {@link totalBalance}.
   */
  totalHsaBalance: number | null;
  /** Member plus employer contributions for {@link taxYear}. */
  ytdContributions: number;
  /** Employer contributions for {@link taxYear}. */
  employerContributions: number;
  /**
   * The IRS contribution limit that applies to this member for {@link taxYear}, or null when it
   * could not be established — the summary was unavailable, or the vendor reported a coverage
   * tier the API does not recognise.
   *
   * **Null means "do not display", never "zero".** This was a plain `number` hardcoded to 0 by
   * the API, which rendered as "Annual Limit $0.00" against live data (ADR-117).
   */
  annualLimit: number | null;
  status: string;
  /**
   * The tax year the contribution figures and limit belong to, or null when unavailable.
   *
   * The HSA itself has no plan year — it is reported over an open-ended window (ADR-116) — but
   * contributions and limits are annual, and this is the only year that legitimately applies to
   * anything on an HSA screen.
   */
  taxYear: number | null;
  /**
   * HDHP coverage basis the limit is drawn from. Shown beside the limit so the basis is visible
   * rather than assumed: the two limits differ by roughly double.
   */
  coverageTier: "selfOnly" | "family" | null;
  /**
   * The extra amount accountholders aged 55+ may contribute in {@link taxYear}. Never folded
   * into {@link annualLimit} — eligibility depends on the member's age, which nothing here knows.
   */
  catchUpContribution: number | null;
  /**
   * True when the limits read failed on this request (ADR-139): `annualLimit` / `taxYear` /
   * `coverageTier` / `catchUpContribution` are null because the API *doesn't know*, not because
   * none applies. Render the limit row as "Unavailable" — the balance is still good.
   */
  limitsUnavailable: boolean;
  /** Plan year start date (ISO), or null when the vendor doesn't report one. */
  planStartDate: string | null;
  /** Plan year end date (ISO), or null when the vendor doesn't report one. */
  planEndDate: string | null;
  /** End of the run-out grace period for submitting claims against this plan year, or null. */
  gracePeriodEnd: string | null;
  /** Last date claims can be submitted against this plan year, or null. */
  submitClaimsLastDate: string | null;
  /** Additional deposits made outside the standard payroll contribution schedule. */
  additionalDeposits: number;
  /**
   * Set when this account belongs to a contract holder and the caller is reading it
   * under a granted family permission, not their own account. Never rendered as "0" or
   * omitted-means-self — absent means self, present names whose account this is.
   */
  onBehalfOfName?: string;
}

// --- FSA Detail ---

export interface FsaAccount {
  balance: number;
  annualElection: number;
  remainingBalance: number;
  ytdDisbursements: number;
  status: string;
  fsaType: FsaType;
  /** Plan year start date (ISO), or null when the vendor doesn't report one. */
  planStartDate: string | null;
  /** Plan year end date (ISO), or null when the vendor doesn't report one. */
  planEndDate: string | null;
  /** End of the run-out grace period for submitting claims against this plan year, or null. */
  gracePeriodEnd: string | null;
  /** Last date claims can be submitted against this plan year, or null. */
  submitClaimsLastDate: string | null;
  /** Year-to-date member contributions. */
  ytdContributions: number;
  /** Additional deposits made outside the standard payroll contribution schedule. */
  additionalDeposits: number;
  /** See {@link HsaAccount.onBehalfOfName}. */
  onBehalfOfName?: string;
}

// --- 401(k) Detail ---
//
// Reshaped to the probed Empower Balance API (ADR-137) — our grant is
// `balance.read` only. No YTD contributions, employer match, contribution
// rate, or quarterly history: Empower's real API has none of them, and
// keeping them typed here would only invite a future fabricated value
// (ADR-116/117's rule — absent information is hidden, never rendered as 0).

export interface RetirementAccount {
  /** Null when the vendor didn't report a plan name for this participant's entries. */
  planName: string | null;
  totalBalance: number;
  vestedBalance: number;
  totalLoanBalance: number;
  investments: Investment[];
  loans: Loan[];
  /** See {@link HsaAccount.onBehalfOfName}. */
  onBehalfOfName?: string;
}

export interface Investment {
  /** Null when the vendor didn't report a fund name for this holding. */
  fundName: string | null;
  ticker: string | null;
  balance: number;
  /** Server-computed share of {@link RetirementAccount.totalBalance}, in percent units (32.5 for 32.5%). */
  allocationPercent: number;
}

export interface Loan {
  balance: number;
  /** Null when the vendor didn't report an effective date. */
  effectiveDate: string | null;
  /**
   * Raw vendor status code — one of A/C/D/I/P/Q/W, undocumented by Empower. Not translated:
   * there is no confirmed mapping to member-friendly copy, so this is not rendered in the UI.
   * Kept on the type for the day a mapping is confirmed, rather than dropped and re-added.
   */
  statusCode: string | null;
}

// --- Master Retirement Plan ---

export interface MrpAccount {
  yearsOfCredit: number;
  estimatedMonthlyPayment: number;
  estimatedPaymentAge: number;
  asOfDate: string;
  /** See {@link HsaAccount.onBehalfOfName}. */
  onBehalfOfName?: string;
}

// --- Life Insurance ---

export interface LifeInsuranceAccount {
  members: LifeInsuranceMember[];
  /** See {@link HsaAccount.onBehalfOfName}. */
  onBehalfOfName?: string;
}

export interface LifeInsuranceMember {
  name: string;
  relationship: string;
  groupTermLife: number;
  supplementalGtl: number;
  adndCoverage: number;
}

// --- Transactions ---

export interface AccountTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  /**
   * Vendor-reported status. Usually one of TransactionStatus, but live data
   * carries other values too (e.g. "Processing") — treat as an open string
   * and fall back gracefully in display code.
   */
  status: string;
  merchantName: string | null;
  /** Date the transaction settled, or null when unsettled/pending. */
  settlementDate: string | null;
  /** Name of the person the expense was for, if available. PHI — display only, never log. */
  claimant: string | null;
  /**
   * Receipts already attached to this charge. Same shape and same retrievable keys a claim's
   * receipts carry, projected through one server-side mapper — which is what lets a single
   * viewer serve both without branching on where the receipt came from (ADR-108).
   *
   * Non-retrievable keys are filtered out server-side, so every key here opens.
   */
  receipts: ClaimReceiptInfo[];
  /**
   * Whether the plan intends a receipt to be attachable to this charge.
   *
   * **Advisory plan intent — never an authorization check.** The vendor returned `false` on all 52
   * sandbox transactions and accepted the upload anyway (ADR-108), and the API deliberately does
   * not gate on it either; the server's ownership check is the only check. Use it to decide what to
   * *offer* a member, and never to conclude that an upload would be refused.
   */
  canUploadReceipt: boolean;
}

export interface TransactionFilter {
  status?: TransactionStatus;
  searchQuery?: string;
}

// --- Plan years ---

/** A single plan year the participant has spending-account data for, beyond the current (default) plan year. */
export interface PlanYearInfo {
  /** Plan-year index (1-9) as understood by the Alegeus `planyear` query parameter. */
  planYear: number;
  planStartDate: string | null;
  planEndDate: string | null;
  /** Account type slugs with data in this plan year (e.g., "hsa", "healthcare", "lpfsa", "depc"). */
  accountTypes: string[];
}

// --- Benefit cards ---

export type BenefitCardStatus =
  | "New"
  | "Active"
  | "TempInactive"
  | "PermInactive"
  | "LostStolen"
  | "Unknown";

/** A single benefit (debit) card, list view. Read-only — no reissue/lost-stolen actions (FA-5 is deferred, ADR-099). */
export interface BenefitCard {
  /** Opaque card proxy identifier — pass to the card-detail endpoint. Never log. */
  cardId: string;
  last4: string;
  status: BenefitCardStatus;
  holderName: string;
  issueDate: string | null;
  /** True when the card was issued to a covered dependent rather than the participant. */
  isDependent: boolean;
}

/** Detail for a single benefit card, fetched on expand. */
export interface BenefitCardDetail {
  effectiveDate: string | null;
  expireDate: string | null;
  activationDate: string | null;
  /** True when this is the participant's primary card. */
  isPrimary: boolean;
}

// --- Benefit card actions (v0.8.8, FA-5) ---

/** A card-status write action — maps to Alegeus CardStatusCode 5 (LostStolen) / 4 (PermInactive). No activation action is exposed (compliance-conservative, ADR-106). */
export type CardActionKind = "reportLostStolen" | "deactivate";

// --- OTC product eligibility scanner (v0.8.8, FA-7) ---

export type ProductEligibilityCategory =
  | "eligible"
  | "dualEligible"
  | "notEligible"
  | "notFound"
  | "unknown";

/**
 * OTC product-catalog eligibility verdict for a scanned UPC-12/GTIN-14 barcode.
 * Verdicts are catalog-global — not specific to the requesting member.
 */
export interface ProductEligibilityVerdict {
  category: ProductEligibilityCategory;
  /** Neutral, member-friendly default message for this category — a default, not vendor-sourced. */
  message: string;
  /** Raw vendor verdict text. Secondary/supplementary display only. */
  detail: string;
}

// --- Account activity feed (v0.8.8) ---

/** Normalized activity type slug. */
export type ActivityType = "claim" | "manualClaim" | "deposit" | "cardTransaction" | "other";

/**
 * A single account activity item — claim, deposit, or card transaction — with
 * adjudication detail beyond what {@link AccountTransaction} carries.
 */
export interface AccountActivityItem {
  id: string;
  type: ActivityType;
  date: string;
  /** Activity amount. Positive = deposit/contribution; negative = disbursement. */
  amount: number;
  description: string | null;
  customDescription: string | null;
  displayStatus: string | null;
  /** Name of the person the expense was for, if available. PHI — display only, never log. */
  claimant: string | null;
  /**
   * Raw vendor code, unnormalized. **On the wire this is `""`, never `null`** — the
   * vendor sends null for a member-submitted claim before adjudication (it assigns
   * no account type code until then), but the API coalesces that to an empty string
   * and its response field is non-nullable. `null` is tolerated here defensively;
   * do not write a `=== null` check against this field, it will never fire. Treat
   * "no code" as blank-or-null, the way {@link vendorCodeToAccountType} and
   * `entriesForAccountFeed` both do.
   */
  accountTypeCode: string | null;
  accountTypeClass: string | null;
  billedAmount: number | null;
  allowedAmount: number | null;
  coveredAmount: number | null;
  accountsPaidAmount: number | null;
  deductibleAmount: number | null;
  balanceDue: number | null;
  denialReason: string | null;
  denialComment: string | null;
  excludedReason: string | null;
  checkNumber: string | null;
  settlementDate: string | null;
  serviceStartDate: string | null;
  reimbursementDate: string | null;
  /**
   * Receipts for a member-submitted claim, joined server-side from the vendor's claims
   * list — same shape as {@link AccountTransaction.receipts}, reused rather than
   * re-declared for the same ADR-108 reason. **Optional, not just nullable**: until the
   * API deploys this field, it is absent from the response entirely rather than sent as
   * `null` or `[]`. Treat undefined, null, and an empty array identically — none of them
   * mean anything beyond "no receipt to offer".
   */
  receipts?: ClaimReceiptInfo[] | null;
}

// --- Balance due (v0.8.8) ---

/** A single account carrying an outstanding balance due. */
export interface BalanceDueItem {
  /** Account type slug (e.g. "hsa", "healthcare", "lpfsa", "depc"), or "other" when unresolved. */
  accountType: string;
  planDescription: string;
  amount: number;
}

/** Accounts with an outstanding balance due. Empty on the live sandbox — mock exercises the non-empty path. */
export interface BalanceDueInfo {
  totalBalanceDue: number;
  items: BalanceDueItem[];
}

// --- Covered dependents (v0.8.8) ---

export type DependentRelationship = "unknown" | "spouse" | "child" | "domesticPartner" | "other";

export type DependentStatus =
  | "all"
  | "new"
  | "active"
  | "tempInactive"
  | "permInactive"
  | "terminated"
  | "enrollment";

/** A single covered dependent. */
export interface CoveredDependent {
  id: string;
  firstName: string | null;
  lastName: string | null;
  relationship: DependentRelationship;
  status: DependentStatus;
}

// --- Expenses, reimbursements, HSA payments (v0.8.9, ADR-120) ---
//
// Read-only. The write side of this surface (submitting an expense online, paying
// from the HSA) is gated on two pending Alegeus entitlement asks — see ADR-120.
// These types mirror AccountExpenseModels.cs field-for-field; a name or
// nullability mismatch here is this project's most-repeated defect (FA4-M6).

/** One line item from the member's expense ledger. Distinct from a submitted claim. */
export interface AccountExpense {
  /** Opaque vendor key. Never logged. Null when the vendor sent its documented 0 placeholder. */
  expenseKey: number | null;
  serviceStartDate: string | null;
  serviceEndDate: string | null;
  /** Vendor status, raw (e.g. "Reimbursed", "New", "In_Process") — map to member-facing copy, don't display verbatim. */
  status: string | null;
  provider: string | null;
  description: string | null;
  billedAmount: number | null;
  insurancePaid: number | null;
  yourResponsibility: number | null;
  reimbursedAmount: number | null;
  hasReceipt: boolean;
  /** Who the expense was for, when it belongs to a covered dependent. PHI — display only. */
  dependentName: string | null;
}

/** One plan-level label/amount summary row from the expenses ledger. */
export interface AccountExpenseLabel {
  label: string | null;
  description: string | null;
  amount: number | null;
}

export interface AccountExpensesResponse {
  expenses: AccountExpense[];
  labels: AccountExpenseLabel[];
}

/** A reimbursement the vendor has already disbursed. */
export interface SettledReimbursement {
  /** Opaque vendor key. Never logged. Null when the vendor sent its documented placeholder. */
  reimburseKey: number | null;
  date: string | null;
  amount: number | null;
  /** Free-form vendor text (e.g. "Direct Deposit", "Check", "ePay-ACH"). Never used as a key. */
  method: string | null;
  checkNumber: string | null;
  trackingNumber: string | null;
}

/** A reimbursement not yet settled. Carries no vendor id at all. */
export interface PendingReimbursement {
  serviceStartDate: string | null;
  amount: number | null;
  merchant: string | null;
  /** Decoded vendor enum ("directDeposit" | "check" | "card" | ...). Null when unrecognized. */
  method: string | null;
  expectedDate: string | null;
  /** Which account this will disburse from, as the vendor reports it (raw code, not normalized). */
  accountType: string | null;
}

export interface AccountReimbursementsResponse {
  settled: SettledReimbursement[];
  pending: PendingReimbursement[];
}

/** One HSA online payment. Carries no vendor id at all. */
export interface HsaPayment {
  /** Documented as the service start date, not when the payment moved. */
  date: string | null;
  /** Who was paid. PHI — display only. */
  payee: string | null;
  amount: number | null;
  /** "check" | "directDeposit", decoded from the vendor's numeric payment type. Null when unrecognized. */
  method: string | null;
  /** Vendor memo text. PHI — display only. */
  memo: string | null;
  /** Only ever populated on the failed list. */
  failureReason: string | null;
  /** Null when the vendor reports "None" or "Once" — those aren't a recurrence. */
  recurrence: string | null;
}

export interface HsaPaymentsResponse {
  pending: HsaPayment[];
  failed: HsaPayment[];
}
