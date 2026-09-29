import { useSearchParams } from "react-router-dom";
import { BenefitsScreen } from "./BenefitsScreen";
import { parseBenefitsTargetParams } from "../services/benefitsTarget";
import { BENEFITS_MAIN_TABS, type BenefitsMainTab } from "../types";

/**
 * `app/(tabs)/benefits.tsx`: `?tab=` picks the main tab (coverage,
 * estimateCosts, codes, navigation); `?sub=` + `?topic=` land on a Coverage
 * sub-tab and topic, the way a chat citation does.
 */
export function BenefitsRoute() {
  const [params] = useSearchParams();
  const tabParam = params.get("tab");
  const initialMainTab = BENEFITS_MAIN_TABS.find((tab) => tab === tabParam) as BenefitsMainTab | undefined;
  const target = parseBenefitsTargetParams({ sub: params.get("sub"), topic: params.get("topic") });
  return (
    <BenefitsScreen initialMainTab={initialMainTab} initialCoverageTab={target.sub} initialTopicKey={target.topicKey} />
  );
}
