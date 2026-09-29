/**
 * Stand-in for `useCostCompareLaunch` + `classifyCostCompareLaunchError`.
 * `?state=empty` → the "not available" copy (the app's 404 path);
 * `?state=error` → the shared error state; `?state=loading` → the in-flight CTA.
 * A tap on the happy path shows a toast instead of opening the vendor tool.
 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export type CostCompareErrorKind = "notAvailable" | "error";

export function useCostCompareLaunch() {
  const [params] = useSearchParams();
  const state = params.get("state");
  const [isPending, setIsPending] = useState(false);
  const errorKind: CostCompareErrorKind | null =
    state === "empty" ? "notAvailable" : state === "error" ? "error" : null;

  return {
    isPending: isPending || state === "loading",
    isError: errorKind !== null,
    errorKind,
    mutate: (_: undefined, opts: { onSuccess: (data: { url: string; expiresAt: string }) => void }) => {
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
        opts.onSuccess({ url: "about:blank#cost-compare", expiresAt: "2026-12-31T00:00:00Z" });
      }, 600);
    },
  };
}
