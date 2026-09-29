/**
 * Sample drug-reference data. Names are invented ("Sample…") and every tier
 * and cost is sample text — nothing here is a real formulary entry.
 */
import type { MedicationDetail, MedicationSummary, MedicineCabinetItem } from "./types";

export const medications: MedicationSummary[] = [
  {
    name: "sampleprofen",
    genericName: "Sampleprofen",
    brandName: "Sample Brand A",
    ndcCode: "00000-0001-01",
    tier: "Tier 1",
    copayDisplay: "Sample copay",
    description: "Sample description of what this medication is used for. Wireframe content only.",
    requiresPriorAuth: null,
    requiresStepTherapy: null,
  },
  {
    name: "placebitol",
    genericName: "Placebitol",
    brandName: "Sample Brand B",
    ndcCode: "00000-0002-01",
    tier: "Tier 2",
    copayDisplay: "Sample copay",
    description: "Sample description text.",
    requiresPriorAuth: true,
    requiresStepTherapy: true,
  },
  {
    name: "demozepam",
    genericName: "Demozepam",
    brandName: null,
    ndcCode: "00000-0003-01",
    tier: null,
    copayDisplay: null,
    description: null,
    requiresPriorAuth: null,
    requiresStepTherapy: false,
  },
];

export const medicineCabinet: MedicineCabinetItem[] = [
  {
    medicationId: "00000-0002-01",
    drugName: "placebitol",
    genericName: "Placebitol",
    addedAt: "2026-06-01T00:00:00Z",
    source: "ManualAdd",
  },
];

/** Detail read by route name; any unknown name resolves to the first sample. */
export function medicationDetailFor(name: string | undefined): MedicationDetail {
  const summary =
    medications.find((m) => m.name === (name ?? "").toLowerCase() || m.genericName === name) ?? medications[0];
  return {
    ...summary,
    alternatives: [
      { name: "Sample alternative one", ndcCode: "00000-0101-01", tier: "Tier 1" },
      { name: "Sample alternative two", ndcCode: "00000-0102-01", tier: null },
    ],
  };
}
