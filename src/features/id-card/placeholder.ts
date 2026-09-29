import type { CachedIdCard } from "./types";

export const placeholderCards: CachedIdCard[] = [
  {
    id: 1,
    cardType: "Medical",
    planDisplayName: "Sample Medical Plan",
    network: "Sample Network",
    cardholderName: "Jordan Avery",
    policyId: "123456789",
    groupNumber: "0000",
    cardIssueDate: "2026-01-01",
    isActive: true,
    frontImagePath: "medical-front",
    backImagePath: "medical-back",
  },
  {
    id: 2,
    cardType: "Dental",
    planDisplayName: "Sample Dental Plan",
    network: null,
    cardholderName: "Jordan Avery",
    policyId: "123456789",
    groupNumber: "0000",
    cardIssueDate: "2026-01-01",
    isActive: true,
    frontImagePath: "dental-front",
    backImagePath: "dental-back",
  },
];
