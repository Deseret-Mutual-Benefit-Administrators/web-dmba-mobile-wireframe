/**
 * Local stand-ins for the app's `medicationTransforms.ts` (not in the extract).
 * `null` is always "unknown", never a value the member could act on.
 */
import type { BadgeTone } from "@/src/shared/components/Badge";
import type { MedicationSummary, MedicineCabinetItem } from "../types";

export function hasMedicationValue(value: string | null | undefined): value is string {
  return (value ?? "").trim().length > 0;
}

export function formatCopay(copayDisplay: string | null, unavailable: string): string {
  return hasMedicationValue(copayDisplay) ? copayDisplay.trim() : unavailable;
}

export type RequirementState = "required" | "notRequired" | "unknown";

export function requirementState(value: boolean | null): RequirementState {
  if (value === true) return "required";
  if (value === false) return "notRequired";
  return "unknown";
}

export function getTierTone(tier: string): BadgeTone {
  const n = tier.replace(/\D/g, "");
  if (n === "1") return "success";
  if (n === "2") return "info";
  if (n === "3") return "warning";
  return "neutral";
}

export function findMedicineCabinetItem(
  items: MedicineCabinetItem[] | undefined,
  medication: Pick<MedicationSummary, "ndcCode" | "name" | "genericName">
): MedicineCabinetItem | undefined {
  const names = [medication.name, medication.genericName].map((n) => n.toLowerCase());
  return (items ?? []).find(
    (item) =>
      item.medicationId === medication.ndcCode ||
      names.includes(item.drugName.toLowerCase()) ||
      (item.genericName !== null && names.includes(item.genericName.toLowerCase()))
  );
}
