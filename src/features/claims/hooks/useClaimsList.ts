/**
 * Stand-in for the app's `useClaimsListScreen` — same return shape, filtering
 * and sorting done over static placeholder claims instead of the paged query.
 */
import { useMemo, useState } from "react";
import type { ClaimType } from "../types";
import { placeholderClaims, placeholderClaimsTotal } from "../placeholder";
import { usePlaceholderState } from "./usePlaceholderState";

export function useClaimsListScreen() {
  const state = usePlaceholderState();
  const [claimType, setClaimType] = useState<ClaimType | undefined>(undefined);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>("family");

  const claims = useMemo(() => {
    if (state === "empty") return [];
    const query = searchInput.trim().toLowerCase();
    const filtered = placeholderClaims.filter(
      (c) =>
        (claimType === undefined || c.claimType === claimType) &&
        (query === "" ||
          c.provider.toLowerCase().includes(query) ||
          c.serviceDescription.toLowerCase().includes(query) ||
          c.claimNumber.toLowerCase().includes(query))
    );
    const dir = sortOrder === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) =>
      sortBy === "date"
        ? dir * a.dateOfService.localeCompare(b.dateOfService)
        : dir * (a.billedAmount - b.billedAmount)
    );
  }, [state, claimType, searchInput, sortBy, sortOrder]);

  return {
    claims,
    totalCount: state === "empty" ? 0 : placeholderClaimsTotal,
    isLoading: state === "loading",
    isRefetching: false,
    isError: state === "error",
    refetch: () => {},
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    claimType,
    setClaimType,
    searchInput,
    setSearchInput,
    sortBy,
    sortOrder,
    toggleSortOrder: () => setSortOrder((o) => (o === "desc" ? "asc" : "desc")),
    toggleSortField: () => setSortBy((s) => (s === "date" ? "amount" : "date")),
    selectedMemberId,
    setSelectedMemberId,
  };
}
