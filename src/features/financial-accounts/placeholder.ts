/**
 * Static placeholder data for the spending-account screens, shaped by `types.ts`.
 * Account balances come from the dashboard cards' `cardPlaceholder.ts` so a card
 * and the detail screen it opens agree. Fictitious names, merchants and round
 * amounts only.
 */
import {
  placeholderDepc,
  placeholderFsa,
  placeholderHsa,
  placeholderLpfsa,
  placeholderSummary,
} from "./components/cardPlaceholder";
import type {
  AccountActivityItem,
  AccountExpense,
  AccountTransaction,
  BalanceDueInfo,
  BenefitCard,
  BenefitCardDetail,
  CoveredDependent,
  FinancialSummary,
  FsaAccount,
  HsaAccount,
  HsaPayment,
  PendingReimbursement,
  PlanYearInfo,
  ProductEligibilityVerdict,
  SettledReimbursement,
} from "./types";
import type { SpendingAccountType } from "./services/accountList";

export const summary: FinancialSummary = placeholderSummary;

/** The same account in plan-year index `planYear` — index 1 is the prior year. */
export function hsaFor(_planYear: number): HsaAccount {
  return placeholderHsa;
}

export function fsaFor(type: "fsa" | "lpfsa" | "depc", planYear: number): FsaAccount {
  const base = type === "fsa" ? placeholderFsa : type === "lpfsa" ? placeholderLpfsa : placeholderDepc;
  if (planYear === 0) return base;
  return {
    ...base,
    balance: 0,
    remainingBalance: 0,
    ytdDisbursements: base.annualElection,
    planStartDate: "2025-01-01",
    planEndDate: "2025-12-31",
    gracePeriodEnd: "2026-03-31",
    submitClaimsLastDate: "2026-03-31",
  };
}

export const planYears: PlanYearInfo[] = [
  { planYear: 1, planStartDate: "2025-01-01", planEndDate: "2025-12-31", accountTypes: ["healthcare"] },
];

function tx(partial: Partial<AccountTransaction> & Pick<AccountTransaction, "id" | "date" | "amount" | "description">): AccountTransaction {
  return {
    category: "Medical",
    status: "Approved",
    merchantName: null,
    settlementDate: null,
    claimant: null,
    receipts: [],
    canUploadReceipt: false,
    ...partial,
  };
}

export const transactionsByType: Record<SpendingAccountType, AccountTransaction[]> = {
  hsa: [
    tx({ id: "hsa-1", date: "2026-09-12", amount: -60, description: "Card purchase", merchantName: "Corner Pharmacy", settlementDate: "2026-09-14", claimant: "Jordan Avery" }),
    tx({ id: "hsa-2", date: "2026-09-01", amount: 250, description: "Payroll contribution", category: "Contribution" }),
    tx({ id: "hsa-3", date: "2026-08-20", amount: -125, description: "Card purchase", merchantName: "Valley Dental", status: "Pending", claimant: "Sam Avery" }),
  ],
  fsa: [
    tx({ id: "fsa-1", date: "2026-09-18", amount: -85, description: "Card purchase", merchantName: "Corner Pharmacy", status: "Pending", canUploadReceipt: true, claimant: "Jordan Avery" }),
    tx({
      id: "fsa-2",
      date: "2026-08-28",
      amount: -150,
      description: "Card purchase",
      merchantName: "Valley Dental",
      settlementDate: "2026-08-30",
      claimant: "Riley Avery",
      receipts: [{ fileKey: 1001, documentId: null, originalFileName: null, uploadDate: "2026-08-29" }],
    }),
    tx({ id: "fsa-3", date: "2026-07-15", amount: -40, description: "Card purchase", merchantName: "Lakeside Vision", status: "Denied", claimant: "Jordan Avery" }),
  ],
  lpfsa: [
    tx({ id: "lpfsa-1", date: "2024-10-05", amount: -200, description: "Card purchase", merchantName: "Lakeside Vision", settlementDate: "2024-10-07", claimant: "Sam Avery" }),
  ],
  depc: [
    tx({ id: "depc-1", date: "2026-09-05", amount: -400, description: "Reimbursement", merchantName: "Sunny Days Child Care", claimant: "Riley Avery" }),
  ],
};

function act(partial: Partial<AccountActivityItem> & Pick<AccountActivityItem, "id" | "type" | "date" | "amount">): AccountActivityItem {
  return {
    description: null,
    customDescription: null,
    displayStatus: "Approved",
    claimant: null,
    accountTypeCode: "FSA",
    accountTypeClass: null,
    billedAmount: null,
    allowedAmount: null,
    coveredAmount: null,
    accountsPaidAmount: null,
    deductibleAmount: null,
    balanceDue: null,
    denialReason: null,
    denialComment: null,
    excludedReason: null,
    checkNumber: null,
    settlementDate: null,
    serviceStartDate: null,
    reimbursementDate: null,
    receipts: null,
    ...partial,
  };
}

export const activityItems: AccountActivityItem[] = [
  act({
    id: "a-1",
    type: "manualClaim",
    date: "2026-09-20",
    amount: -95,
    description: "Member claim",
    customDescription: "Valley Dental",
    displayStatus: "Pending",
    claimant: "Jordan Avery",
    accountTypeCode: "",
    receipts: [{ fileKey: 1002, documentId: null, originalFileName: null, uploadDate: "2026-09-20" }],
  }),
  act({
    id: "a-2",
    type: "claim",
    date: "2026-09-02",
    amount: -150,
    description: "Dental services",
    customDescription: "Valley Dental",
    claimant: "Riley Avery",
    billedAmount: 150,
    allowedAmount: 150,
    coveredAmount: 150,
    accountsPaidAmount: 150,
    reimbursementDate: "2026-09-04",
    checkNumber: "20417",
  }),
  act({
    id: "a-3",
    type: "claim",
    date: "2026-08-10",
    amount: -60,
    description: "Pharmacy",
    customDescription: "Corner Pharmacy",
    displayStatus: "Denied",
    claimant: "Sam Avery",
    billedAmount: 60,
    denialReason: "Documentation incomplete",
    denialComment: "The receipt did not show the date of service.",
    balanceDue: 60,
  }),
  act({ id: "a-4", type: "deposit", date: "2026-09-01", amount: 200, description: "Payroll deposit", accountTypeCode: "DCA" }),
  act({ id: "a-5", type: "deposit", date: "2026-09-01", amount: 250, description: "Payroll contribution", accountTypeCode: "HSA" }),
  act({
    id: "a-6",
    type: "claim",
    date: "2026-07-22",
    amount: -30,
    description: "Over-the-counter",
    customDescription: "Corner Pharmacy",
    displayStatus: "Denied",
    claimant: "Jordan Avery",
    accountTypeCode: "XQ1",
    denialReason: "Item not eligible",
  }),
];

export const balanceDue: BalanceDueInfo = {
  totalBalanceDue: 60,
  items: [{ accountType: "healthcare", planDescription: "", amount: 60 }],
};

export const benefitCards: BenefitCard[] = [
  { cardId: "card-a", last4: "4321", status: "Active", holderName: "Jordan Avery", issueDate: "2025-01-15", isDependent: false },
  { cardId: "card-b", last4: "8765", status: "New", holderName: "Sam Avery", issueDate: "2026-06-02", isDependent: true },
  { cardId: "card-c", last4: "1098", status: "LostStolen", holderName: "Jordan Avery", issueDate: "2023-01-10", isDependent: false },
];

export const benefitCardDetails: Record<string, BenefitCardDetail> = {
  "card-a": { effectiveDate: "2025-01-15", expireDate: "2028-01-31", activationDate: "2025-01-20", isPrimary: true },
  "card-b": { effectiveDate: "2026-06-02", expireDate: "2029-06-30", activationDate: null, isPrimary: false },
  "card-c": { effectiveDate: "2023-01-10", expireDate: "2026-01-31", activationDate: "2023-01-12", isPrimary: false },
};

export const dependents: CoveredDependent[] = [
  { id: "dep-1", firstName: "Sam", lastName: "Avery", relationship: "spouse", status: "active" },
  { id: "dep-2", firstName: "Riley", lastName: "Avery", relationship: "child", status: "active" },
  { id: "dep-3", firstName: "Casey", lastName: "Avery", relationship: "child", status: "enrollment" },
];

export const expenses: AccountExpense[] = [
  {
    expenseKey: 501,
    serviceStartDate: "2026-09-10",
    serviceEndDate: null,
    status: "New",
    provider: "Corner Pharmacy",
    description: "Prescription",
    billedAmount: 25,
    insurancePaid: null,
    yourResponsibility: 25,
    reimbursedAmount: null,
    hasReceipt: false,
    dependentName: null,
  },
];

export const settledReimbursements: SettledReimbursement[] = [
  { reimburseKey: 601, date: "2026-09-04", amount: 150, method: "Direct Deposit", checkNumber: null, trackingNumber: null },
];

export const pendingReimbursements: PendingReimbursement[] = [
  { serviceStartDate: "2026-09-18", amount: 95, merchant: "Valley Dental", method: "directDeposit", expectedDate: "2026-10-02", accountType: "FSA" },
];

export const hsaPendingPayments: HsaPayment[] = [
  { date: "2026-09-25", payee: "Valley Dental", amount: 125, method: "check", memo: null, failureReason: null, recurrence: null },
];

export const hsaFailedPayments: HsaPayment[] = [];

/** Deterministic verdict by last digit, so every category can be reached by typing a code. */
export function verdictFor(code: string): ProductEligibilityVerdict {
  const last = Number(code.slice(-1));
  if (last <= 3) return { category: "eligible", message: "", detail: "Eligible OTC item — first-aid supplies." };
  if (last <= 5) return { category: "dualEligible", message: "", detail: "Dual-purpose item — eligible when used to treat a medical condition." };
  if (last <= 7) return { category: "notEligible", message: "", detail: "General-use personal care item." };
  return { category: "notFound", message: "", detail: "No catalog entry for this code." };
}
