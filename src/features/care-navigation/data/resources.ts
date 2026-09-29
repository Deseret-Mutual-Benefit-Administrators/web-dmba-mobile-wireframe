import type { CareNavSubTabConfig } from "../types";

/** The Navigation strip. The extract omits the registry; icons are placeholders. */
export const CARE_NAV_SUB_TABS: CareNavSubTabConfig[] = [
  { key: "financial", labelKey: "careNavigation.financialTab", icon: "wallet-outline" },
  { key: "mentalHealth", labelKey: "careNavigation.mentalHealthTab", icon: "heart-outline" },
  { key: "clinical", labelKey: "careNavigation.clinicalTab", icon: "medkit-outline" },
];
