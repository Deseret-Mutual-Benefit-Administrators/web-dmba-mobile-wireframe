/**
 * DMBA Brand Colors — blended from Figma prototype + WealthCare portal.
 * For NativeWind/Tailwind classes, use class names (e.g., "text-brand-primary").
 * For React Navigation screenOptions and other JS style objects, use these constants.
 *
 * `tokens.js` is the single source of truth for these values; `tailwind.config.js`
 * is the other consumer. Edit tokens.js to change a color — this file just
 * re-exports it under the shape existing call sites already expect.
 */
import { palette } from "./tokens";

export const colors = {
  brand: palette.brand,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
  border: palette.border,
  successTint: palette.successTint,
  warningTint: palette.warningTint,
  errorTint: palette.errorTint,
  infoTint: palette.infoTint,
  neutral: palette.neutral,
  financial: palette.financial,
  tone: palette.tone,
  inNetwork: palette.inNetwork,
  medication: palette.medication,
  highlight: palette.highlight,
  chart: palette.chart,
  searchSlate: palette.searchSlate,
} as const;

export { withAlpha } from "./withAlpha";
