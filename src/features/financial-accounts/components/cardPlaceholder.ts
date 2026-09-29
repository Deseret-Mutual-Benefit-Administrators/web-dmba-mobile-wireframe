/**
 * Static placeholder data for the dashboard's financial cards, shaped by
 * `cardTypes.ts`. Fictitious names and round amounts only.
 */
import type {
  FinancialSummary,
  FsaAccount,
  HsaAccount,
  LifeInsuranceAccount,
  MrpAccount,
  RetirementAccount,
} from "./cardTypes";

export const placeholderHsa: HsaAccount = {
  cashBalance: 3200,
  investmentBalance: 12500,
  totalBalance: 15700,
  totalHsaBalance: 15700,
  ytdContributions: 2750,
  employerContributions: 500,
  annualLimit: 8750,
  status: "Active",
  taxYear: 2026,
  coverageTier: "family",
  catchUpContribution: 1000,
  limitsUnavailable: false,
  planStartDate: "2024-01-01",
  planEndDate: "2099-12-31",
  gracePeriodEnd: null,
  submitClaimsLastDate: null,
  additionalDeposits: 0,
};

export const placeholderFsa: FsaAccount = {
  balance: 1400,
  annualElection: 2500,
  remainingBalance: 1400,
  ytdDisbursements: 1100,
  status: "Active",
  fsaType: "healthcare",
  planStartDate: "2026-01-01",
  planEndDate: "2026-12-31",
  gracePeriodEnd: "2027-03-31",
  submitClaimsLastDate: "2027-03-31",
  ytdContributions: 1875,
  additionalDeposits: 0,
};

/** A prior plan year, past its filing deadline — renders the "Closed" badge. */
export const placeholderLpfsa: FsaAccount = {
  balance: 150,
  annualElection: 1000,
  remainingBalance: 150,
  ytdDisbursements: 850,
  status: "Active",
  fsaType: "lpfsa",
  planStartDate: "2024-01-01",
  planEndDate: "2024-12-31",
  gracePeriodEnd: "2025-03-31",
  submitClaimsLastDate: "2025-03-31",
  ytdContributions: 1000,
  additionalDeposits: 0,
};

export const placeholderDepc: FsaAccount = {
  balance: 3000,
  annualElection: 5000,
  remainingBalance: 3000,
  ytdDisbursements: 2000,
  status: "Active",
  fsaType: "depc",
  planStartDate: "2026-01-01",
  planEndDate: "2026-12-31",
  gracePeriodEnd: "2027-03-31",
  submitClaimsLastDate: "2027-03-31",
  ytdContributions: 3750,
  additionalDeposits: 0,
};

export const placeholderRetirement: RetirementAccount = {
  planName: "Sample 401(k) Plan",
  totalBalance: 84000,
  vestedBalance: 80000,
  totalLoanBalance: 5000,
  investments: [
    { fundName: "Target Date 2050 Fund", ticker: "TDF50", balance: 50400, allocationPercent: 60 },
    { fundName: "Total Bond Index Fund", ticker: "BOND1", balance: 21000, allocationPercent: 25 },
    { fundName: "International Stock Fund", ticker: null, balance: 12600, allocationPercent: 15 },
  ],
  loans: [{ balance: 5000, effectiveDate: "2025-06-01", statusCode: null }],
};

export const placeholderMrp: MrpAccount = {
  yearsOfCredit: 12.5,
  estimatedMonthlyPayment: 1250,
  estimatedPaymentAge: 65,
  asOfDate: "2026-01-01T00:00:00",
};

export const placeholderLife: LifeInsuranceAccount = {
  members: [
    { name: "Jordan Avery", relationship: "Self", groupTermLife: 50000, supplementalGtl: 100000, adndCoverage: 50000 },
    { name: "Sam Avery", relationship: "Spouse", groupTermLife: 10000, supplementalGtl: 0, adndCoverage: 0 },
    { name: "Riley Avery", relationship: "Child", groupTermLife: 5000, supplementalGtl: 0, adndCoverage: 0 },
  ],
};

export const placeholderSummary: FinancialSummary = {
  hsa: { cashBalance: 3200, investmentBalance: 12500, totalBalance: 15700 },
  fsa: { balance: 1400, annualElection: 2500, remainingBalance: 1400, fsaType: "healthcare" },
  lpfsa: { balance: 150, annualElection: 1000, remainingBalance: 150, fsaType: "lpfsa" },
  depc: { balance: 3000, annualElection: 5000, remainingBalance: 3000, fsaType: "depc" },
  retirement401k: { totalBalance: 84000, vestedBalance: 80000 },
  masterRetirement: { yearsOfCredit: 12.5, estimatedMonthlyPayment: 1250 },
  lifeInsurance: { groupTermLifeAmount: 50000 },
  unavailable: [],
  onBehalf: {},
};
