import type { CoverageSubTab } from "../types";

/** What a Coverage sub-tab's search box searches (stand-in for the app's service). */
export type CoverageSearchMode = "topics" | "medications";

export function coverageSearchMode(tab: CoverageSubTab): CoverageSearchMode {
  return tab === "pharmacy" ? "medications" : "topics";
}
