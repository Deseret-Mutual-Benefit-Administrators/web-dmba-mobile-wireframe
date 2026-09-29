/**
 * Screen registry for the "home" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { LoginRoute } from "@/src/features/auth/screens/LoginRoute";
import { VerifyRoute } from "@/src/features/device-authenticator/screens/VerifyRoute";
import { SignInVerificationRoute } from "@/src/features/device-authenticator/screens/SignInVerificationRoute";
import { DashboardRoute } from "@/src/features/dashboard/screens/DashboardRoute";
import { DashboardCustomizeRoute } from "@/src/features/dashboard/screens/DashboardCustomizeRoute";
import { ArticleRoute } from "@/src/features/carousel/screens/ArticleRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/login": <LoginRoute />,
  "/verify": <VerifyRoute />,
  "/": <DashboardRoute />,
  "/article/:slug": <ArticleRoute />,
  "/dashboard/customize": <DashboardCustomizeRoute />,
  "/settings/sign-in-verification": <SignInVerificationRoute />,
};
