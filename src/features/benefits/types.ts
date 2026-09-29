/**
 * Benefits feature types.
 * These are concrete interfaces matching the API contract.
 * Kept in sync with the API via `npm run generate-types` — review
 * types.generated.ts after running to catch contract changes.
 */

export type BenefitsMainTab = "coverage" | "estimateCosts" | "codes" | "navigation";
/** Every `BenefitsMainTab` value — for validating a `?tab=` route param. */
export const BENEFITS_MAIN_TABS: readonly BenefitsMainTab[] = [
  "coverage",
  "estimateCosts",
  "codes",
  "navigation",
];
export type CoverageSubTab = "medical" | "dental" | "pharmacy";
/** Every `CoverageSubTab` value — for validating a `?sub=` route param. */
export const COVERAGE_SUB_TABS: readonly CoverageSubTab[] = ["medical", "dental", "pharmacy"];

/**
 * One benefit row — a `benefits.PlanFacts` row for the member's plan, the
 * same row the AI Benefits Advisor cites (ADR-174). `id` is the citation
 * section id (`{topicKey}#planFacts:{planId}`), so a citation chip and this
 * row can never disagree: a citation lands on the card with the matching
 * `topicKey`.
 */
export interface Benefit {
  /** Citation section id, `{topicKey}#planFacts:{planId}` — not a Guid since ADR-174. */
  id: string;
  /** The owning topic's stable key — what `GET /benefits/topics/{topicKey}` and a citation target use. */
  topicKey: string;
  /** Category wire key (`medical`, `dental`, `pharmacy`, `spendingAccount`, `general`). */
  category: string;
  /** The plan this row belongs to (ADR-176 §6 — every row echoes its own planId). */
  planId: string;
  name: string;
  /** Empty string when not stated for this plan. */
  inNetworkCost: string;
  /** Empty string when not stated for this plan. */
  outOfNetworkCost: string;
  /** Tri-state on the wire (ADR-176 §6): `null` means the source did not state it — never treat as "no". */
  requiresPreauth: boolean | null;
  notes?: string | null;
  /** Flat copay amount for PPO plans (e.g. "$25"). Null/undefined for HSA plans where deductible+coinsurance applies. */
  copay?: string | null;
  /**
   * `false` when the plan explicitly excludes this benefit — the collapsed
   * card then says "Not covered on your plan" instead of two blank cost
   * cells. `null`/`undefined` means "not stated" and renders the costs as
   * usual; only an exact `false` is ever treated as not covered. Optional
   * until the API field lands (being added alongside this change).
   */
  covered?: boolean | null;
  /**
   * Curated search synonyms (`er` → Emergency Room, `glasses` → Eyewear —
   * ADR-174 §4, source contract §2). Optional only until the API field lands
   * (being added alongside this change); consume as `aliases ?? []`.
   */
  aliases?: string[];
}

/**
 * A group of benefit rows under the topic's curated `group` — an English
 * display string from the controlled vocabulary in
 * `docs/benefits-source-contract.md` §4 (the corpus is English-only this
 * release), rendered as-is. The API names the field `category` for wire
 * compatibility; it is the section header, not the category wire key.
 */
export interface BenefitCategoryGroup {
  category: string;
  benefits: Benefit[];
}

/**
 * A `kind: concept` (or prose-only) topic for the sub-tab's "Plan basics"
 * section — how the plan works rather than what it pays for. Never a cost
 * card with empty columns (ADR-174 §4).
 */
export interface BenefitTopicSummary {
  topicKey: string;
  title: string;
  /** Category wire key — see `Benefit.category`. */
  category: string;
  /** Same optional-until-landed posture as `Benefit.aliases`. */
  aliases?: string[];
}

export interface MedicalBenefitsData {
  planId: string;
  planName: string;
  coinsuranceInNetwork: number;
  coinsuranceOutOfNetwork: number;
  categories: BenefitCategoryGroup[];
  /**
   * Plan category from the API contract (WS1c — added in parallel).
   * Optional until the API deploy lands; absent → planCategory-based fallbacks.
   * NOTE: run `npm run generate-types` once the API endpoint is deployed.
   */
  planCategory?: "HSA" | "PPO" | "Deseret" | "Student" | "Dental";
  /**
   * Per-network deductible flags from the API contract (WS2/W3 — added in
   * parallel with WS1c). More precise than planCategory because Deseret plans
   * vary: Deseret Protect has no in-network deductible but does have an OON one.
   *
   * Tri-state: true → "after deductible"; false → "of the approved amount";
   * undefined → omit the suffix entirely (safe default during the deploy gap).
   * Do NOT default undefined to false — that shows affirmatively wrong copy to
   * HSA/PPO members before the new API field reaches production.
   */
  hasInNetworkDeductible?: boolean;
  hasOutOfNetworkDeductible?: boolean;
  /** Concept and prose-only topics for the "Plan basics" section, in display order. */
  basics: BenefitTopicSummary[];
  /** The standing SPD disclaimer — the page now carries the claim it qualifies (ADR-174 §3). */
  disclaimer: string;
  /** Null when the plan has no SPD on file yet — the "Governing document" button is hidden. */
  governingDocumentId: string | null;
}

export interface DentalBenefitsData {
  planId: string;
  planName: string;
  categories: BenefitCategoryGroup[];
  annualMax: number;
  deductible: number;
  /** Concept and prose-only topics for the "Plan basics" section, in display order. */
  basics: BenefitTopicSummary[];
  /** The standing SPD disclaimer — the page now carries the claim it qualifies (ADR-174 §3). */
  disclaimer: string;
  /** Null when the plan has no SPD on file yet — the "Governing document" button is hidden. */
  governingDocumentId: string | null;
}

export interface PharmacyBenefitsData {
  planId: string;
  planName: string;
  pharmacyManager: string;
  pharmacyPhone: string;
  categories: BenefitCategoryGroup[];
  /** Concept and prose-only topics for the "Plan basics" section, in display order. */
  basics: BenefitTopicSummary[];
  /** The standing SPD disclaimer — the page now carries the claim it qualifies (ADR-174 §3). */
  disclaimer: string;
  /** Null when the plan has no SPD on file yet — the "Governing document" button is hidden. */
  governingDocumentId: string | null;
}

export interface ProcedureCode {
  id: string;
  code: string;
  codeType: string;
  category: string;
  description: string;
  requiresPreauth: boolean;
}

export interface PaginatedResponse<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  items: T[];
}

export interface Accumulator {
  type: string;
  used: number;
  total: number;
  label: string;
}

export interface FamilyMember {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

export interface MemberAccumulators {
  medical: Accumulator[];
  dental: Accumulator[];
  familyMembers: FamilyMember[];
}

export interface DocumentMetadata {
  id: string;
  title: string;
  category: string;
  contentType: string;
  fileSize?: number;
  createdDate: string;
  containsPhi: boolean;
}

export interface DocumentListData {
  documents: DocumentMetadata[];
}

/**
 * `GET /benefits/topics/{topicKey}?planId=` — one topic's prose sections in
 * display order plus the typed plan fact for the member's plan (ADR-174).
 * Fetched lazily when a benefit card or Plan-basics row is expanded.
 */
export type BenefitTopicSectionKind =
  | "whatItIs"
  | "needToKnow"
  | "planFacts"
  | "limitations"
  | "planComparisonNote";

export interface BenefitTopicSection {
  /** Citation section id — `{topicKey}#{kind}` or `{topicKey}#planFacts:{planId}`. */
  id: string;
  /** Wire key of the section kind. A kind this build doesn't know renders under a generic label rather than being dropped. */
  kind: BenefitTopicSectionKind | (string & {});
  /** Set only on a `planFacts` section. */
  planId: string | null;
  markdown: string;
}

/**
 * The typed plan fact behind a benefit row. Every field is tri-state: `null`
 * means the source did not state it for this plan — never render a null as
 * "no" (ADR-116/117's absent-vs-fabricated rule).
 */
export interface BenefitTopicPlanFact {
  covered: boolean | null;
  inNetworkCost: string | null;
  outOfNetworkCost: string | null;
  copay: string | null;
  deductible: string | null;
  oopMax: string | null;
  requiresPreauth: boolean | null;
  notes: string | null;
}

export interface BenefitTopicDetail {
  topicKey: string;
  title: string;
  /** Category wire key — see `Benefit.category`. */
  category: string;
  /** The plan the response was resolved for (the member's own when the request omitted one). */
  planId: string;
  sections: BenefitTopicSection[];
  /** Null for a concept topic, or a benefit the source states nothing about for this plan. */
  planFact: BenefitTopicPlanFact | null;
}
