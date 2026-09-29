/**
 * Every route of the app's `app/` folder, with how the app presents it.
 * The list itself is `routes.json` (shared with `scripts/smoke.mjs`).
 *
 * To translate a screen, add its element to SCREENS under the route's path:
 *   "/claim/:id": <ClaimDetailScreen />,
 * Anything not in SCREENS renders the Placeholder. The chrome (tab bar, header,
 * sheet) comes from `presentation`, so a screen supplies only its own content —
 * a pushed screen renders its own ScreenHeader, as in the app.
 */
import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import routeList from "./routes.json";
import { ModalSheet } from "@/src/shared/layout/ModalSheet";
import { NotFound } from "@/src/shared/layout/NotFound";
import { Placeholder } from "@/src/shared/layout/Placeholder";
import { StackScreen } from "@/src/shared/layout/StackScreen";
import { TabsLayout } from "@/src/shared/layout/TabsLayout";
import { screens as homeScreens } from "./screens/home";
import { screens as benefitsScreens } from "./screens/benefits";
import { screens as findcareScreens } from "./screens/findcare";
import { screens as activityScreens } from "./screens/activity";
import { screens as profileScreens } from "./screens/profile";
import { screens as messagingScreens } from "./screens/messaging";
import { screens as moneyScreens } from "./screens/money";

export type Presentation = "tab" | "push" | "modal" | "formSheet" | "bare";

export interface RouteDef {
  path: string;
  title: string;
  presentation: Presentation;
  /** A concrete URL for this route (params filled with placeholders). */
  sample: string;
}

export const ROUTES: RouteDef[] = routeList as RouteDef[];

/** Translated screens, keyed by route path. Later waves add entries here. */
const SCREENS: Partial<Record<string, ReactElement>> = {
  ...homeScreens,
  ...benefitsScreens,
  ...findcareScreens,
  ...activityScreens,
  ...profileScreens,
  ...messagingScreens,
  ...moneyScreens,
  "*": <NotFound />,
};

function screenFor(route: RouteDef): ReactElement {
  const screen = SCREENS[route.path];
  if (screen) return screen;
  const withHeader = route.presentation === "push" || route.presentation === "bare";
  return <Placeholder title={route.title} path={route.path} withHeader={withHeader} />;
}

function elementFor(route: RouteDef): ReactElement {
  const screen = screenFor(route);
  switch (route.presentation) {
    case "tab":
      return screen;
    case "modal":
      return <ModalSheet title={route.title}>{screen}</ModalSheet>;
    case "formSheet":
      return (
        <ModalSheet title={route.title} presentation="formSheet">
          {screen}
        </ModalSheet>
      );
    default:
      return <StackScreen>{screen}</StackScreen>;
  }
}

export function AppRoutes() {
  const tabs = ROUTES.filter((r) => r.presentation === "tab");
  const others = ROUTES.filter((r) => r.presentation !== "tab");
  return (
    <Routes>
      <Route element={<TabsLayout />}>
        {tabs.map((route) =>
          route.path === "/" ? (
            <Route key={route.path} index element={elementFor(route)} />
          ) : (
            <Route key={route.path} path={route.path} element={elementFor(route)} />
          )
        )}
      </Route>
      {others.map((route) => (
        <Route key={route.path} path={route.path} element={elementFor(route)} />
      ))}
    </Routes>
  );
}
