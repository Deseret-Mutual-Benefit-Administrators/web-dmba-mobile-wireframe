/**
 * Local stand-in for the app's familyPermissions service (not in the extract).
 * Same exports the screen imports; section keys map onto `familyPermissions.sections.*`.
 */
import type {
  FamilyPermissionGroup,
  FamilyPermissionSection,
  FamilyPermissionSectionDefinition,
} from "../types";

export const SECTIONS: FamilyPermissionSectionDefinition[] = [
  { key: "claims", labelKey: "familyPermissions.sections.claims.label", descriptionKey: "familyPermissions.sections.claims.description", group: "health" },
  { key: "priorAuths", labelKey: "familyPermissions.sections.priorAuths.label", descriptionKey: "familyPermissions.sections.priorAuths.description", group: "health" },
  { key: "spendingAccounts", labelKey: "familyPermissions.sections.spendingAccounts.label", descriptionKey: "familyPermissions.sections.spendingAccounts.description", group: "financial" },
  { key: "retirement401k", labelKey: "familyPermissions.sections.retirement401k.label", descriptionKey: "familyPermissions.sections.retirement401k.description", group: "financial" },
  { key: "masterRetirement", labelKey: "familyPermissions.sections.masterRetirement.label", descriptionKey: "familyPermissions.sections.masterRetirement.description", group: "financial" },
  { key: "lifeInsurance", labelKey: "familyPermissions.sections.lifeInsurance.label", descriptionKey: "familyPermissions.sections.lifeInsurance.description", group: "financial" },
];

export function sectionDefinition(key: FamilyPermissionSection): FamilyPermissionSectionDefinition | undefined {
  return SECTIONS.find((s) => s.key === key);
}

/** The group's sections, narrowed to the ones the server currently accepts. */
export function availableSectionsInGroup(
  group: FamilyPermissionGroup,
  availableSections: FamilyPermissionSection[]
): FamilyPermissionSectionDefinition[] {
  return SECTIONS.filter((s) => s.group === group && availableSections.includes(s.key));
}

export function relationshipLabelKey(relationship: string): string | null {
  const key = relationship.trim().toLowerCase();
  return ["self", "spouse", "child", "parent", "subscriber"].includes(key)
    ? `familyPermissions.relationships.${key}`
    : null;
}

/** `YYYY-MM-DD…` → a locale date, or "" for a missing/invalid value. */
export function formatDateOnly(value?: string): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return "";
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
