/**
 * Screen registry for the "findcare" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { SearchTabRoute } from "@/src/features/search/screens/SearchTabRoute";
import { ProviderDetailRoute } from "@/src/features/search/screens/ProviderDetailRoute";
import { FacilityDetailRoute } from "@/src/features/search/screens/FacilityDetailRoute";
import { FullscreenMapRoute } from "@/src/features/search/screens/FullscreenMapRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/search": <SearchTabRoute />,
  "/provider/:npi": <ProviderDetailRoute />,
  "/facility/:id": <FacilityDetailRoute />,
  "/search/map": <FullscreenMapRoute />,
};
