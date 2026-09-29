import type { ResourceLink } from "../types";

/** Placeholder link targets — the wireframe never points at a DMBA environment. */
export const CORE_SCORE_URL = "about:blank#core-score";
export const SCHEDULE_URL = "about:blank#schedule";

export const financialResources: ResourceLink[] = [
  {
    key: "lifeLongFinancialSecurity",
    labelKey: "careNavigation.resources.lifeLongFinancialSecurity",
    descriptionKey: "careNavigation.resources.lifeLongFinancialSecurityDescription",
    url: "about:blank#resource",
  },
];
