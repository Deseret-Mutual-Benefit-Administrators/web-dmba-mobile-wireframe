/**
 * Wireframe stand-in for the three `hooks/use*Search.ts` hooks (not in the UI
 * extract): filters the placeholder list locally and honours `?state=`.
 * `searchEnabled` mirrors the app: a location is set.
 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { readState } from "../placeholder";

export function useWireframeSearch<T>(
  location: { lat: number; lng: number } | null,
  all: T[],
  matches: (item: T, query: string) => boolean
) {
  const [params] = useSearchParams();
  const state = readState(params);
  const [searchInput, setSearchInput] = useState("");

  const searchEnabled = location != null;
  const q = searchInput.trim().toLowerCase();
  const results = !searchEnabled || state === "loading" || state === "error" || state === "empty"
    ? []
    : all.filter((item) => !q || matches(item, q));

  return {
    searchInput,
    handleSearchInput: setSearchInput,
    handleClear: () => setSearchInput(""),
    searchEnabled,
    results,
    isLoading: state === "loading",
    isFetching: false,
    isError: state === "error",
  };
}
