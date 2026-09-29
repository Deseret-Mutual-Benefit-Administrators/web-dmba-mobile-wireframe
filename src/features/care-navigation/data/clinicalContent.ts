import type { InfoCardDef, ScenarioDef } from "../types";

/** Reconstructed from the `careNavigation.clinical.*` keys in en.json (registry not in the extract). */
export const clinicalCards: InfoCardDef[] = [
  {
    key: "complexDiagnosis",
    icon: "medical-outline",
    titleKey: "careNavigation.clinical.complexDiagnosis.title",
    summaryKey: "careNavigation.clinical.complexDiagnosis.summary",
    bulletKeys: [1, 2, 3, 4].map((n) => `careNavigation.clinical.complexDiagnosis.bullet${n}`),
    cta: { kind: "message", labelKey: "careNavigation.clinical.complexDiagnosis.cta", topic: "benefitsCoverage" },
  },
  {
    key: "treatmentOptions",
    icon: "list-outline",
    titleKey: "careNavigation.clinical.treatmentOptions.title",
    summaryKey: "careNavigation.clinical.treatmentOptions.summary",
    bulletKeys: [1, 2, 3].map((n) => `careNavigation.clinical.treatmentOptions.bullet${n}`),
    cta: { kind: "message", labelKey: "careNavigation.clinical.treatmentOptions.cta", topic: "benefitsCoverage" },
  },
  {
    key: "specialists",
    icon: "people-outline",
    titleKey: "careNavigation.clinical.specialists.title",
    summaryKey: "careNavigation.clinical.specialists.summary",
    bulletKeys: [1, 2, 3].map((n) => `careNavigation.clinical.specialists.bullet${n}`),
    cta: { kind: "message", labelKey: "careNavigation.clinical.specialists.cta", topic: "benefitsCoverage" },
  },
];

export const clinicalScenarios: ScenarioDef[] = [
  "recentDiagnosis",
  "multipleSpecialists",
  "treatmentDecision",
  "ongoingCondition",
].map((key) => ({
  key,
  titleKey: `careNavigation.clinical.scenarios.${key}.title`,
  descriptionKey: `careNavigation.clinical.scenarios.${key}.description`,
}));
