import { Outlet } from "react-router-dom";
import { AppHeader } from "@/src/shared/components/AppHeader";
import { TabBar } from "./TabBar";

/**
 * The five tab screens: persistent AppHeader, the screen between, TabBar below.
 * The middle area is the positioning parent for a tab screen's FAB and scrolls
 * if the screen does not scroll itself.
 */
export function TabsLayout() {
  return (
    <div className="flex-1 min-h-0">
      <AppHeader />
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
