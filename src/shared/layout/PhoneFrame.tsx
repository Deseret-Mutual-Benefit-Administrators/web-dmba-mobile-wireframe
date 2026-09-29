import { useEffect, useState, type ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

/** iPhone 17 point size. */
export const FRAME_WIDTH = 393;
export const FRAME_HEIGHT = 852;
/** Safe-area insets the app reads from `useSafeAreaInsets()`. */
export const STATUS_BAR_HEIGHT = 59;
export const HOME_INDICATOR_HEIGHT = 34;

/** Scale the frame down on short viewports so the whole phone stays visible. */
function useFrameScale(): number {
  const compute = () => Math.min(1, (window.innerHeight - 32) / (FRAME_HEIGHT + 2), (window.innerWidth - 16) / (FRAME_WIDTH + 2));
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    const onResize = () => setScale(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

/**
 * The phone: a 393×852 frame with a status-bar strip on top and the home
 * indicator drawn over the bottom 34px. The screen area below the status bar is
 * `.rn-screen`, which gives every div React Native's flex-column defaults (see
 * `src/index.css`), and is the positioning parent for FABs, sheets and toasts.
 * Screens extend under the home indicator, as on iOS: the tab bar and
 * ScreenScrollView pad for it.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const scale = useFrameScale();

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden py-4">
      <div style={{ width: FRAME_WIDTH * scale, height: FRAME_HEIGHT * scale }}>
        <div
          className="relative bg-brand-background border border-neutral-300 overflow-hidden flex flex-col"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            borderRadius: 55,
            boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            className="flex items-center justify-between bg-brand-surface text-black shrink-0"
            style={{ height: STATUS_BAR_HEIGHT, paddingLeft: 44, paddingRight: 34, paddingTop: 14 }}
            aria-hidden="true"
          >
            <span className="font-semibold text-[17px]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>9:41</span>
            <span className="flex items-center gap-1.5">
              <Signal size={17} strokeWidth={2.5} />
              <Wifi size={17} strokeWidth={2.5} />
              <BatteryFull size={24} strokeWidth={2} />
            </span>
          </div>

          <div className="rn-screen relative flex flex-col flex-1 min-h-0 bg-brand-background">{children}</div>

          <div
            className="pointer-events-none absolute left-0 right-0 bottom-0 flex items-end justify-center"
            style={{ height: HOME_INDICATOR_HEIGHT, paddingBottom: 8, zIndex: 100 }}
            aria-hidden="true"
          >
            <div className="bg-black rounded-full" style={{ width: 134, height: 5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
