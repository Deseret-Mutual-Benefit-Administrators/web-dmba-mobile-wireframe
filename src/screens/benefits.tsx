/**
 * Screen registry for the "benefits" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { BenefitsRoute } from "@/src/features/benefits/screens/BenefitsRoute";
import { MedicationDetailRoute } from "@/src/features/medications/screens/MedicationDetailRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/benefits": <BenefitsRoute />,
  "/medication/:name": <MedicationDetailRoute />,
};
