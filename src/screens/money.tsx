/**
 * Screen registry for the "money" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { AccountRoute } from "@/src/features/financial-accounts/screens/AccountRoute";
import { SpendingActivityRoute } from "@/src/features/financial-accounts/screens/SpendingActivityRoute";
import { BenefitCardsRoute } from "@/src/features/financial-accounts/screens/BenefitCardsRoute";
import { EligibilityScannerRoute } from "@/src/features/financial-accounts/screens/EligibilityScannerRoute";
import { SpendingClaimRoute } from "@/src/features/spending-claims/screens/SpendingClaimRoute";
import { SubstantiateRoute } from "@/src/features/spending-claims/screens/SubstantiateRoute";
import { ReceiptRoute } from "@/src/features/spending-claims/screens/ReceiptRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/account/:type": <AccountRoute />,
  "/spending-activity": <SpendingActivityRoute />,
  "/spending-claim": <SpendingClaimRoute />,
  "/substantiate": <SubstantiateRoute />,
  "/receipt/:fileKey": <ReceiptRoute />,
  "/benefit-cards": <BenefitCardsRoute />,
  "/eligibility-scanner": <EligibilityScannerRoute />,
};
