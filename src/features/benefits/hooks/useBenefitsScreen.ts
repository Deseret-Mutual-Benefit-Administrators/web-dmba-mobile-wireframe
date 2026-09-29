/**
 * Stand-in for the app's `useBenefitsScreen` ViewModel: the same return shape
 * BenefitsScreen destructures, with sample data from `placeholder.ts`.
 * `?state=loading|error` drives the coverage read; `?state=empty` means the
 * member has no dental plan and the plans carry no rows.
 */
import { useCallback, useMemo, useState } from "react";
import { dentalData, medicalData, pharmacyData, procedureCodes, usePlaceholderState } from "../placeholder";
import type { BenefitsMainTab, CoverageSubTab } from "../types";

export function useBenefitsScreen(initialMainTab?: BenefitsMainTab, initialCoverageTab?: CoverageSubTab) {
  const state = usePlaceholderState();
  const [mainTab, setMainTab] = useState<BenefitsMainTab>(initialMainTab ?? "coverage");
  const [coverageTab, setCoverageTab] = useState<CoverageSubTab>(initialCoverageTab ?? "medical");
  const [targetTopicKey, setTargetTopicKey] = useState<string | undefined>(undefined);
  const clearTargetTopicKey = useCallback(() => setTargetTopicKey(undefined), []);
  const [codeSearchInput, setCodeSearchInput] = useState("");

  const empty = state === "empty";
  const strip = <T extends { categories: unknown[]; basics: unknown[] }>(data: T): T =>
    empty ? { ...data, categories: [], basics: [] } : data;

  const codes = useMemo(() => {
    const q = codeSearchInput.trim().toLowerCase();
    if (!q) return [];
    return procedureCodes.filter(
      (c) => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [codeSearchInput]);

  return {
    mainTab,
    setMainTab,
    coverageTab,
    setCoverageTab,
    targetTopicKey,
    setTargetTopicKey,
    clearTargetTopicKey,
    codeSearchInput,
    handleCodeSearchInput: setCodeSearchInput,
    medicalData: strip(medicalData),
    dentalData: strip(dentalData),
    pharmacyData: strip(pharmacyData),
    procedureCodes: codes,
    procedureCodeTotalCount: codes.length,
    procedureCodesHasNextPage: false,
    procedureCodesFetchNextPage: () => undefined,
    procedureCodesIsLoading: state === "loading" && codeSearchInput.length > 0,
    isCoverageLoading: state === "loading",
    isCoverageError: state === "error",
    isDentalPlanMissing: empty,
  };
}
