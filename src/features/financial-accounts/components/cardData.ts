/**
 * Placeholder stand-ins for the app's `../api/accountsQueries` hooks. Same
 * return shape as a TanStack query (`data`, `isLoading`, `isError`, `refetch`).
 *
 * `?accounts=loading|error` on the page URL puts every account read into that
 * state, so the shell's spinner and "Try Again" states are reachable.
 * `?accounts=summaryError` fails the dashboard summary outright.
 */
import { useLocation } from "react-router-dom";
import {
  placeholderDepc,
  placeholderFsa,
  placeholderHsa,
  placeholderLife,
  placeholderLpfsa,
  placeholderMrp,
  placeholderRetirement,
  placeholderSummary,
} from "./cardPlaceholder";
import type { FinancialSummary } from "./cardTypes";

interface QueryLike<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

function useAccountsState(): string | null {
  return new URLSearchParams(useLocation().search).get("accounts");
}

function useStub<T>(value: T, opts?: { enabled?: boolean }): QueryLike<T> {
  const state = useAccountsState();
  const enabled = opts?.enabled ?? true;
  if (!enabled) return { data: undefined, isLoading: false, isError: false, refetch: () => {} };
  if (state === "loading") return { data: undefined, isLoading: true, isError: false, refetch: () => {} };
  if (state === "error") return { data: undefined, isLoading: false, isError: true, refetch: () => {} };
  return { data: value, isLoading: false, isError: false, refetch: () => {} };
}

export const useHsaAccount = (opts?: { enabled?: boolean }) => useStub(placeholderHsa, opts);
export const useFsaAccount = (opts?: { enabled?: boolean }) => useStub(placeholderFsa, opts);
export const useLpfsaAccount = (opts?: { enabled?: boolean }) => useStub(placeholderLpfsa, opts);
export const useDepcAccount = (opts?: { enabled?: boolean }) => useStub(placeholderDepc, opts);
export const useRetirementAccount = (opts?: { enabled?: boolean }) => useStub(placeholderRetirement, opts);
export const useMrpAccount = (opts?: { enabled?: boolean }) => useStub(placeholderMrp, opts);
export const useLifeInsurance = (opts?: { enabled?: boolean }) => useStub(placeholderLife, opts);

export function useFinancialSummary(): QueryLike<FinancialSummary> {
  const state = useAccountsState();
  if (state === "summaryError") return { data: undefined, isLoading: false, isError: true, refetch: () => {} };
  return { data: placeholderSummary, isLoading: false, isError: false, refetch: () => {} };
}
