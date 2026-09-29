/**
 * Static placeholder data for the spending-account claim flow, card-charge
 * substantiation and the receipt viewer — shaped by `types.ts`. The app renders
 * the claim form from the administrator's claim-entry template; this is one
 * fixed, representative template and the schema derived from it.
 */
import type { ClaimEntryTemplate, ClaimFormField, ClaimFormSchema, ClaimReceiptContent } from "./types";
import type { SubstantiationCandidate } from "./services/cardSubstantiation";

export const template: ClaimEntryTemplate = {
  formInstructions:
    "<p>Claims are paid from the account that matches the type of expense.</p><ul><li>Healthcare FSA: medical, dental, vision and pharmacy expenses.</li><li>Dependent Care FSA: care for a dependent while you work.</li></ul><p>Every claim needs an itemized receipt.</p>",
  certificationText:
    "<p>I certify that the expenses submitted were incurred by me, my spouse or my eligible dependents, have not been reimbursed from any other source, and will not be claimed on my tax return.</p><p>I understand that ineligible or unsubstantiated claims may have to be repaid.</p>",
  confirmationText:
    "<p>Your claim has been received. Most claims are reviewed within five business days.</p><p>If we need more information we will send you a message.</p>",
  documentationHelpText: null,
  itemInstructionsText: null,
  receiptInstructionText:
    "<p>You can also send receipts by mail or fax. Write your name and the claim date on each page.</p>",
  documentationLabel: "Attach receipt",
  helpTextLinkLabel: null,
  allowESignature: true,
  allowPayProvider: false,
  claimants: [
    { cardholderKey: 1, firstName: "Jordan", lastName: "Avery", initial: null, namePrefix: null, isEmployee: true },
    { cardholderKey: 2, firstName: "Sam", lastName: "Avery", initial: null, namePrefix: null, isEmployee: false },
    { cardholderKey: 3, firstName: "Riley", lastName: "Avery", initial: null, namePrefix: null, isEmployee: false },
  ],
  serviceCategories: [
    { code: "MEDICAL", description: "Medical", isDirectSubmit: true, allowFutureDatedClaims: false, allowESignature: true, allowPayProvider: false },
    { code: "DENTAL", description: "Dental", isDirectSubmit: true, allowFutureDatedClaims: false, allowESignature: true, allowPayProvider: false },
    { code: "VISION", description: "Vision", isDirectSubmit: true, allowFutureDatedClaims: false, allowESignature: true, allowPayProvider: false },
    { code: "RX", description: "Pharmacy", isDirectSubmit: true, allowFutureDatedClaims: false, allowESignature: true, allowPayProvider: false },
    { code: "SUPPLIES", description: "OTC Supplies", isDirectSubmit: true, allowFutureDatedClaims: false, allowESignature: true, allowPayProvider: false },
    { code: "DAY", description: "Dependent Care", isDirectSubmit: true, allowFutureDatedClaims: false, allowESignature: true, allowPayProvider: false },
  ],
  reimbursementMethods: ["directDeposit"],
  fields: [],
  rules: {
    allowSameMonthService: true,
    allowAnyLengthService: true,
    allowDiscountsAndCoupons: false,
    allowNoClaimantName: false,
    enableAiClaimEligibility: false,
  },
  acceptedReceiptContentTypes: ["image/jpeg", "image/png", "application/pdf"],
  maxReceiptBytes: 10 * 1024 * 1024,
  maxClaimAmount: 5000,
  serviceWindow: { startDate: "2026-01-01", endDate: "2026-12-31" },
  submitClaimsLastDate: "2027-03-31",
};

function field(id: ClaimFormField["id"], kind: ClaimFormField["kind"], labelKey: string | null, required: boolean, label: string | null = null): ClaimFormField {
  return {
    id,
    kind,
    labelKey,
    label,
    content: null,
    flags: { visible: true, editable: true, required },
    options: [],
    source: label !== null ? "template" : "base",
  };
}

export const schema: ClaimFormSchema = {
  fields: [
    field("serviceCategory", "select", "spendingClaims.fields.serviceCategory", true),
    field("claimant", "select", "spendingClaims.fields.claimant", true),
    field("serviceStartDate", "date", "spendingClaims.fields.serviceStartDate", true),
    field("serviceEndDate", "date", "spendingClaims.fields.serviceEndDate", false),
    field("amount", "amount", "spendingClaims.fields.amount", true),
    field("provider", "text", "spendingClaims.fields.provider", true),
    // The vendor's own label for the notes field — shows the "administrator's wording" note.
    field("notes", "multiline", "spendingClaims.fields.notes", false, "Comments"),
  ],
  categories: template.serviceCategories,
  claimants: template.claimants,
  receipt: {
    acceptedContentTypes: template.acceptedReceiptContentTypes,
    maxBytes: template.maxReceiptBytes,
    attachLabel: null,
    helpLinkLabel: null,
    helpText: null,
  },
  allowsScheduledClaims: false,
};

/** FSA card charges the plan has asked to be documented. */
export const substantiationCandidates: SubstantiationCandidate[] = [
  { id: "fsa-1", merchantName: "Corner Pharmacy", description: "Card purchase", amount: -85, date: "2026-09-18" },
  { id: "fsa-4", merchantName: "Valley Dental", description: "Card purchase", amount: -120, date: "2026-09-03" },
  { id: "fsa-5", merchantName: null, description: "Card purchase — clinic", amount: -40, date: "2026-08-22" },
];

/** A neutral grey receipt, drawn — no text, no data. */
const RECEIPT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="440" viewBox="0 0 300 440">
<rect width="300" height="440" fill="#e5e7eb"/>
<path d="M40 30 H260 V400 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 l-10 12 l-10 -12 Z" fill="#f9fafb" stroke="#d1d5db"/>
<rect x="95" y="60" width="110" height="14" rx="3" fill="#9ca3af"/>
<rect x="115" y="84" width="70" height="8" rx="3" fill="#d1d5db"/>
<g fill="#d1d5db"><rect x="60" y="130" width="120" height="8" rx="3"/><rect x="200" y="130" width="40" height="8" rx="3"/>
<rect x="60" y="155" width="100" height="8" rx="3"/><rect x="200" y="155" width="40" height="8" rx="3"/>
<rect x="60" y="180" width="140" height="8" rx="3"/><rect x="200" y="180" width="40" height="8" rx="3"/>
<rect x="60" y="205" width="90" height="8" rx="3"/><rect x="200" y="205" width="40" height="8" rx="3"/></g>
<line x1="60" y1="240" x2="240" y2="240" stroke="#d1d5db" stroke-dasharray="4 4"/>
<rect x="60" y="258" width="60" height="10" rx="3" fill="#9ca3af"/><rect x="190" y="258" width="50" height="10" rx="3" fill="#9ca3af"/>
<rect x="100" y="330" width="100" height="30" fill="#d1d5db"/>
</svg>`;

export function receiptContent(fileKey: number): ClaimReceiptContent {
  if (fileKey === 1002) return { contentType: "application/pdf", base64: "", contentLength: 184_320 };
  const base64 = btoa(RECEIPT_SVG);
  return { contentType: "image/svg+xml", base64, contentLength: 412_672 };
}
