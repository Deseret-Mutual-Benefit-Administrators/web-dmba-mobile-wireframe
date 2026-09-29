import type { InfoCardDef } from "../types";

/** Reconstructed from the `careNavigation.mentalHealth.*` keys in en.json (registry not in the extract). */
export const mentalHealthCards: InfoCardDef[] = [
  {
    key: "behavioralHealth",
    icon: "happy-outline",
    titleKey: "careNavigation.mentalHealth.behavioralHealth.title",
    summaryKey: "careNavigation.mentalHealth.behavioralHealth.summary",
    bulletsHeadingKey: "careNavigation.mentalHealth.coveredServices",
    bulletKeys: [1, 2, 3, 4, 5].map((n) => `careNavigation.mentalHealth.behavioralHealth.bullet${n}`),
    callouts: [
      { tone: "warning", textKey: "careNavigation.mentalHealth.behavioralHealth.preauth" },
      { tone: "excluded", textKey: "careNavigation.mentalHealth.behavioralHealth.notCovered" },
    ],
    cta: { kind: "seeCosts" },
  },
  {
    key: "abaTherapy",
    icon: "people-outline",
    titleKey: "careNavigation.mentalHealth.abaTherapy.title",
    summaryKey: "careNavigation.mentalHealth.abaTherapy.summary",
    bulletsHeadingKey: "careNavigation.mentalHealth.requirements",
    bulletKeys: [1, 2].map((n) => `careNavigation.mentalHealth.abaTherapy.bullet${n}`),
    callouts: [
      { tone: "warning", textKey: "careNavigation.mentalHealth.abaTherapy.preauth" },
      { tone: "info", textKey: "careNavigation.mentalHealth.abaTherapy.byuNote" },
    ],
    cta: { kind: "seeCosts" },
  },
  {
    key: "erVsUrgentCare",
    icon: "medkit-outline",
    titleKey: "careNavigation.mentalHealth.erVsUrgentCare.title",
    summaryKey: "careNavigation.mentalHealth.erVsUrgentCare.summary",
    bulletKeys: [1, 2, 3].map((n) => `careNavigation.mentalHealth.erVsUrgentCare.bullet${n}`),
    callouts: [{ tone: "info", textKey: "careNavigation.mentalHealth.erVsUrgentCare.preauth" }],
    cta: { kind: "seeCosts" },
  },
];
