/** Port of `app/substantiate.tsx` — reads `?transactionId=` and composes the screen. */
import { useSearchParams } from "react-router-dom";
import { SubstantiateCardChargeScreen } from "./SubstantiateCardChargeScreen";

export function SubstantiateRoute() {
  const [params] = useSearchParams();
  return <SubstantiateCardChargeScreen preselectedTransactionId={params.get("transactionId") ?? null} />;
}
