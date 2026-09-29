/**
 * Placeholder stand-ins for the app's `financial-accounts/api/accountsQueries.ts`
 * hooks — same return shapes as the TanStack queries, fed from `../placeholder`.
 *
 * `?state=` on the page URL reaches the source's other states:
 * - `loading` / `error` — the screen's primary read
 * - `empty` — no accounts, transactions, activity or cards
 * - `transactionsError` — account detail's feed fails while the balance loads
 * - `receiptsUnavailable` — activity served without receipt enrichment (ADR-139)
 * - `onBehalf` — a granted dependent reading the holder's accounts (ADR-156)
 * - `extrasLoading` / `extrasError` — the collapsed Payments & receipts section
 * - `cardDetailError` — an expanded benefit card fails its detail read
 * - `noBalanceDue` — hides the balance-due banner (shown by default here)
 */
import { useLocation } from "react-router-dom";
import * as data from "../placeholder";
import type {
  AccountActivityItem,
  AccountTransaction,
  BalanceDueInfo,
  BenefitCard,
  BenefitCardDetail,
  CoveredDependent,
  FinancialSummary,
  FsaAccount,
  HsaAccount,
  PlanYearInfo,
  ProductEligibilityVerdict,
} from "../types";
import type { SpendingAccountType } from "../services/accountList";

const ON_BEHALF_NAME = "Jordan Avery";

export function useMoneyState(): string | null {
  return new URLSearchParams(useLocation().search).get("state");
}

export interface QueryLike<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isRefetching: boolean;
  error: unknown;
  refetch: () => void;
}

const noop = () => {};

function ok<T>(value: T | undefined): QueryLike<T> {
  return { data: value, isLoading: false, isError: false, isFetching: false, isSuccess: value !== undefined, isRefetching: false, error: null, refetch: noop };
}
const loading = <T,>(): QueryLike<T> => ({ ...ok<T>(undefined), isLoading: true, isFetching: true });
const failed = <T,>(error: unknown = "error"): QueryLike<T> => ({ ...ok<T>(undefined), isError: true, error });

interface Opts {
  enabled?: boolean;
  planYear?: number;
}

function primary<T>(state: string | null, value: T, opts?: Opts): QueryLike<T> {
  if (opts?.enabled === false) return ok<T>(undefined);
  if (state === "loading") return loading<T>();
  if (state === "error") return failed<T>();
  return ok(value);
}

function withOnBehalf<T extends { onBehalfOfName?: string }>(state: string | null, value: T): T {
  return state === "onBehalf" ? { ...value, onBehalfOfName: ON_BEHALF_NAME } : value;
}

export function useFinancialSummary(_opts?: Opts): QueryLike<FinancialSummary> {
  const state = useMoneyState();
  const base: FinancialSummary =
    state === "empty"
      ? { ...data.summary, hsa: null, fsa: null, lpfsa: null, depc: null }
      : state === "onBehalf"
        ? { ...data.summary, onBehalf: { spendingAccounts: ON_BEHALF_NAME } }
        : data.summary;
  return primary(state, base);
}

export function usePlanYears(): QueryLike<PlanYearInfo[]> {
  const state = useMoneyState();
  return primary(state, state === "empty" ? [] : data.planYears);
}

export function useHsaAccount(opts?: Opts): QueryLike<HsaAccount> {
  const state = useMoneyState();
  return primary(state, withOnBehalf(state, data.hsaFor(opts?.planYear ?? 0)), opts);
}

function useFsaFamily(type: "fsa" | "lpfsa" | "depc", opts?: Opts): QueryLike<FsaAccount> {
  const state = useMoneyState();
  return primary(state, withOnBehalf(state, data.fsaFor(type, opts?.planYear ?? 0)), opts);
}
export const useFsaAccount = (opts?: Opts) => useFsaFamily("fsa", opts);
export const useLpfsaAccount = (opts?: Opts) => useFsaFamily("lpfsa", opts);
export const useDepcAccount = (opts?: Opts) => useFsaFamily("depc", opts);

export interface Paged<T> {
  pages: { items: T[]; unavailable?: string[] }[];
}

export interface InfiniteLike<T> extends QueryLike<Paged<T>> {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

function paged<T>(q: QueryLike<Paged<T>>): InfiniteLike<T> {
  return { ...q, fetchNextPage: noop, hasNextPage: false, isFetchingNextPage: false };
}

export function useAccountTransactions(
  type: SpendingAccountType,
  _filters: object,
  opts?: Opts
): InfiniteLike<AccountTransaction> {
  const state = useMoneyState();
  if (opts?.enabled === false) return paged(ok<Paged<AccountTransaction>>(undefined));
  if (state === "transactionsError") return paged(failed());
  const items = state === "empty" || (opts?.planYear ?? 0) > 0 ? [] : data.transactionsByType[type];
  return paged(ok({ pages: [{ items }] }));
}

export function useAccountActivity(opts?: Opts): InfiniteLike<AccountActivityItem> {
  const state = useMoneyState();
  if (opts?.enabled === false) return paged(ok<Paged<AccountActivityItem>>(undefined));
  if (state === "loading") return paged(loading());
  if (state === "error" || state === "transactionsError") return paged(failed());
  const items = state === "empty" || (opts?.planYear ?? 0) > 0 ? [] : data.activityItems;
  const unavailable = state === "receiptsUnavailable" ? ["receipts"] : undefined;
  return paged(ok({ pages: [{ items: unavailable ? items.map((i) => ({ ...i, receipts: null })) : items, unavailable }] }));
}

export function useBalanceDue(opts?: Opts): QueryLike<BalanceDueInfo> {
  const state = useMoneyState();
  if (opts?.enabled === false) return ok<BalanceDueInfo>(undefined);
  if (state === "noBalanceDue" || state === "empty") return ok({ totalBalanceDue: 0, items: [] });
  return ok(data.balanceDue);
}

export function useBenefitCards(): QueryLike<BenefitCard[]> {
  const state = useMoneyState();
  return primary(state, state === "empty" ? [] : data.benefitCards);
}

export function useBenefitCardDetail(cardId: string, opts?: Opts): QueryLike<BenefitCardDetail> {
  const state = useMoneyState();
  if (opts?.enabled === false) return ok<BenefitCardDetail>(undefined);
  if (state === "cardDetailError") return failed();
  return ok(data.benefitCardDetails[cardId]);
}

export function useDependents(): QueryLike<CoveredDependent[]> {
  const state = useMoneyState();
  return primary(state, data.dependents);
}

/** Card-status writes. The wireframe settles immediately and changes nothing. */
export function useCardStatusAction() {
  return {
    mutate: (_vars: unknown, handlers?: { onSuccess?: () => void; onError?: (error: unknown) => void; onSettled?: () => void }) => {
      handlers?.onSuccess?.();
      handlers?.onSettled?.();
    },
  };
}
export const useRequestReplacementCard = useCardStatusAction;

export function useProductEligibility(code: string, opts?: Opts): QueryLike<ProductEligibilityVerdict> {
  const state = useMoneyState();
  if (opts?.enabled === false || code === "") return ok<ProductEligibilityVerdict>(undefined);
  if (state === "unavailable") return failed("unavailable");
  if (state === "checking") return loading();
  return ok(data.verdictFor(code));
}
