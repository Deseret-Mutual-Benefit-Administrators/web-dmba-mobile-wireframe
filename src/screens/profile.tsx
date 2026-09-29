/**
 * Screen registry for the "profile" slice. Map a route path from src/routes.json
 * to its translated screen element, e.g. "/claim/:id": <ClaimDetailScreen />.
 * Only the agent owning this slice edits this file.
 */
import type { ReactElement } from "react";
import { ProfileRoute } from "@/src/features/settings/screens/ProfileRoute";
import { PrivacyRoute } from "@/src/features/settings/screens/PrivacyRoute";
import { NotificationsRoute } from "@/src/features/settings/screens/NotificationsRoute";
import { HelpRoute } from "@/src/features/settings/screens/HelpRoute";
import { ChangePasswordRoute } from "@/src/features/settings/screens/ChangePasswordRoute";
import { FamilyPermissionsRoute } from "@/src/features/family-permissions/screens/FamilyPermissionsRoute";
import { ContactRoute } from "@/src/features/contact/screens/ContactRoute";
import { IdCardRoute } from "@/src/features/id-card/screens/IdCardRoute";

export const screens: Partial<Record<string, ReactElement>> = {
  "/profile": <ProfileRoute />,
  "/settings/privacy": <PrivacyRoute />,
  "/settings/notifications": <NotificationsRoute />,
  "/settings/help": <HelpRoute />,
  "/settings/change-password": <ChangePasswordRoute />,
  "/settings/family-permissions": <FamilyPermissionsRoute />,
  "/contact": <ContactRoute />,
  "/id-card": <IdCardRoute />,
};
