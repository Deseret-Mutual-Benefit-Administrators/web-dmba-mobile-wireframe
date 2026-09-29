/**
 * Stand-in for the app's `useMedicationSearch` (2-char minimum). Filters the
 * sample list locally. `?state=loading|error` drives the results list;
 * `?state=empty` returns no matches.
 */
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { medications as sampleMedications } from "../placeholder";

export function useMedicationSearch() {
  const [params] = useSearchParams();
  const state = params.get("state");
  const [searchInput, setSearchInput] = useState("");
  const showResults = searchInput.trim().length >= 2;

  const medications = useMemo(() => {
    if (!showResults || state === "empty" || state === "loading" || state === "error") return [];
    const q = searchInput.trim().toLowerCase();
    return sampleMedications.filter(
      (m) =>
        m.genericName.toLowerCase().includes(q) ||
        m.name.includes(q) ||
        (m.brandName ?? "").toLowerCase().includes(q)
    );
  }, [searchInput, showResults, state]);

  const handleReset = useCallback(() => setSearchInput(""), []);

  return {
    searchInput,
    handleSearchInput: setSearchInput,
    handleReset,
    showResults,
    medications,
    hasNextPage: false,
    fetchNextPage: () => undefined,
    isLoading: showResults && state === "loading",
    isFetching: false,
    isError: showResults && state === "error",
  };
}
