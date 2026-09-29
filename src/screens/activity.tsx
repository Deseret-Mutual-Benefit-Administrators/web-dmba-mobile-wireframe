/**
 * Screen registry for the "activity" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { ActivityRoute } from "@/src/features/claims/screens/ActivityRoute";
import { ClaimDetailRoute } from "@/src/features/claims/screens/ClaimDetailRoute";
import { PriorAuthDetailRoute } from "@/src/features/prior-auths/screens/PriorAuthDetailRoute";
import { SubmitClaimRoute } from "@/src/features/claim-submission/screens/SubmitClaimRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/activity": <ActivityRoute />,
  "/claim/:id": <ClaimDetailRoute />,
  "/prior-auth/:id": <PriorAuthDetailRoute />,
  "/submit-claim": <SubmitClaimRoute />,
};
