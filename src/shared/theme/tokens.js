/**
 * DMBA design tokens — the single source of truth for colors and font family
 * names. Plain CommonJS, zero imports, pure data, so both `tailwind.config.js`
 * (via `require`) and `src/shared/theme/colors.ts` (via a hand-written
 * `tokens.d.ts`) can consume it without pulling in NativeWind or React Native.
 *
 * Every literal hex value is defined exactly once below, then reshaped into
 * `palette` (camelCase, for JS/React Navigation style objects) and
 * `tailwindColors` (Tailwind's nested/kebab-case shape). Because both shapes
 * are derived from the same constants, the two can't drift apart.
 *
 * To change a color or font, edit the literal here — never in
 * tailwind.config.js or colors.ts directly.
 *
 * Contrast: every text/background pairing the app renders must meet WCAG 2.1
 * AA (4.5:1 text, 3:1 large text and non-text). The portal palette's slate,
 * cobalt, sage and terracotta were darkened on 2026-09-02 (ADR-164) to get
 * there; `__tests__/shared/theme/contrast.test.ts` fails on any edit here
 * that drops a sanctioned pairing under the line.
 */

// ---------------------------------------------------------------------------
// Brand palette — blended from Figma prototype + WealthCare portal
// ---------------------------------------------------------------------------
const BRAND_PRIMARY = "#374044"; // Dark charcoal (portal)
const BRAND_SECONDARY = "#547484"; // Slate blue (portal #678B99, darkened to 4.99:1 on white — ADR-164)
const BRAND_ACCENT = "#0072B8"; // Cobalt blue (portal #0079C2, darkened to 4.77:1 on the page background — ADR-164)
const BRAND_ACCENT_DARK = "#005a8e";
const BRAND_BACKGROUND = "#f5f7fa"; // Light gray (Figma)
const BRAND_SURFACE = "#ffffff";
const BORDER = "#e5e7eb";

// ---------------------------------------------------------------------------
// Semantic colors (portal palette)
// ---------------------------------------------------------------------------
const SUCCESS = "#587245"; // Sage green (portal #809A69, darkened to 5.37:1 as text / under white — ADR-164)
const WARNING = "#FFCE34"; // Golden yellow
const ERROR = "#B93D34"; // Terracotta (portal #DB584F, darkened to 5.56:1 as text / under white — ADR-164)
const INFO = "#0072B8"; // Cobalt blue (matches accent)

// Tailwind's standard 50-shade tints for each semantic color (blue/green/amber/red-50).
const INFO_TINT = "#eff6ff";
const SUCCESS_TINT = "#f0fdf4";
const WARNING_TINT = "#fffbeb";
const ERROR_TINT = "#fef2f2";

// ---------------------------------------------------------------------------
// Neutral scale — JS-side only. Tailwind's built-in gray-* classes stay in
// use for className consumers; this exists for JS style objects that need
// the same values (React Navigation options, inline styles, etc.).
// Standard Tailwind v3 gray palette.
// ---------------------------------------------------------------------------
const NEUTRAL = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
};

// ---------------------------------------------------------------------------
// Status tones — the JS-side icon colors that sit beside the Badge / banner
// class pairs in `badgeToneClasses.ts` (green-800 on green-100, etc.). Kept
// here so an icon next to a badge is guaranteed the badge's own text color
// rather than a hand-typed hex. Tints are the same 50-shades as *_TINT.
// ---------------------------------------------------------------------------
const TONE = {
  success: { icon: "#166534", tint: SUCCESS_TINT }, // green-800
  warning: { icon: "#92400e", tint: WARNING_TINT }, // amber-800
  error: { icon: "#991b1b", tint: ERROR_TINT }, // red-800
  info: { icon: "#1e40af", tint: INFO_TINT }, // blue-800
  neutral: { icon: "#374151", tint: "#f9fafb" }, // gray-700 / gray-50
};

// ---------------------------------------------------------------------------
// Feature accents that were one-off literals until ADR-164's tokenize sweep.
// Named for what they mean in the app, not for their hue.
// ---------------------------------------------------------------------------
const IN_NETWORK = "#059669"; // emerald-600 — in-network checkmarks (search)
const MEDICATION = "#0d9488"; // teal-600 — medicine cabinet / medication icons
const RETIREMENT_ACCENT = "#0891b2"; // cyan-600 — 401(k) card accent
const HIGHLIGHT = "#d97706"; // amber-600 — "use my location" highlight
const HIGHLIGHT_LIGHT = "#f59e0b"; // amber-500 — highlight pulse end stop
const CHART_BILLED = "#64748b"; // slate-500 — cost chart "Total billed" bar (slate-400 was 2.56:1 on white, under the 3:1 non-text floor — ADR-164 §10)
const CHART_RESPONSIBILITY = "#1e3a8a"; // blue-900 — cost chart "Your responsibility" bar

// ---------------------------------------------------------------------------
// Financial sub-palette — the blue gradient used on financial account cards
// (HSA/FSA/LPFSA/DEPC, dashboard deductible/dental cards, Coverage Journey).
// JS-side only (consumed via LinearGradient, not Tailwind classes).
// ---------------------------------------------------------------------------
const FINANCIAL_GRADIENT_START = "#1e88e5";
const FINANCIAL_GRADIENT_END = "#336688";
const FINANCIAL_GRADIENT_DEEP = "#1a2633"; // out-of-pocket max bar end stop
const FINANCIAL_TRACK = "#e3f2fd"; // progress-bar track behind the gradient fill
const ORTHO_GRADIENT_START = "#00897b"; // dental orthodontia lifetime-max bar
const ORTHO_GRADIENT_END = "#004d40";

// ---------------------------------------------------------------------------
// Search slate sub-palette — provider/facility detail header gradient and
// assorted icon colors across the search feature. JS-side only.
// ---------------------------------------------------------------------------
const SEARCH_SLATE_BASE = "#3F6485"; // was #6A89A7 — white text on it 3.65:1 → 6.23:1 (ADR-164)
const SEARCH_SLATE_LIGHT = "#4E76A0"; // was #88BDF2 — white text on it 1.98:1 → 4.75:1 (ADR-164)
const SEARCH_SLATE_DEEP = "#003B6D";
// Three-stop dashboard hero gradient (app/(tabs)/index.tsx). Named tint1-3
// rather than folded into base/light/deep — this is a distinct lighter blue
// family used only for the hero, not the provider/facility header gradient.
const SEARCH_SLATE_TINT1 = "#1F6A94"; // was #4A9AC7 — white on it 3.12:1 → 5.92:1 (ADR-164)
const SEARCH_SLATE_TINT2 = "#2A6F99"; // was #5fa3d0 — 2.75:1 → 5.48:1
const SEARCH_SLATE_TINT3 = "#2F7BA8"; // was #74b3d8 — 2.29:1 → 4.65:1

const palette = {
  brand: {
    primary: BRAND_PRIMARY,
    secondary: BRAND_SECONDARY,
    accent: BRAND_ACCENT,
    accentDark: BRAND_ACCENT_DARK,
    background: BRAND_BACKGROUND,
    surface: BRAND_SURFACE,
  },
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  info: INFO,
  border: BORDER,
  successTint: SUCCESS_TINT,
  warningTint: WARNING_TINT,
  errorTint: ERROR_TINT,
  infoTint: INFO_TINT,
  neutral: NEUTRAL,
  financial: {
    gradientStart: FINANCIAL_GRADIENT_START,
    gradientEnd: FINANCIAL_GRADIENT_END,
    gradientDeep: FINANCIAL_GRADIENT_DEEP,
    track: FINANCIAL_TRACK,
    orthoGradientStart: ORTHO_GRADIENT_START,
    orthoGradientEnd: ORTHO_GRADIENT_END,
    retirementAccent: RETIREMENT_ACCENT,
  },
  tone: TONE,
  inNetwork: IN_NETWORK,
  medication: MEDICATION,
  highlight: { base: HIGHLIGHT, light: HIGHLIGHT_LIGHT },
  chart: { billed: CHART_BILLED, responsibility: CHART_RESPONSIBILITY },
  searchSlate: {
    base: SEARCH_SLATE_BASE,
    light: SEARCH_SLATE_LIGHT,
    deep: SEARCH_SLATE_DEEP,
    tint1: SEARCH_SLATE_TINT1,
    tint2: SEARCH_SLATE_TINT2,
    tint3: SEARCH_SLATE_TINT3,
  },
};

const tailwindColors = {
  brand: {
    primary: BRAND_PRIMARY,
    secondary: BRAND_SECONDARY,
    accent: BRAND_ACCENT,
    "accent-dark": BRAND_ACCENT_DARK,
    background: BRAND_BACKGROUND,
    surface: BRAND_SURFACE,
    border: BORDER,
  },
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  info: INFO,
  "success-tint": SUCCESS_TINT,
  "warning-tint": WARNING_TINT,
  "error-tint": ERROR_TINT,
  "info-tint": INFO_TINT,
};

// Embedded at build time by the expo-font config plugin from assets/fonts/Oxygen.ttf
// and Oxygen-Bold.ttf (ADR-215 addendum). How the two names below resolve:
// Android registers each file under its file name; iOS registers the file's own
// names — both files carry family "Oxygen", and the PostScript names are
// "Oxygen-Regular" and "Oxygen-Bold" — so "Oxygen" resolves through the family
// (regular member) and "Oxygen-Bold" through the PostScript name. A third face
// would need its file named after the name asked for here. RN doesn't
// synthesize bold from a family name, so bold is its own family/class rather
// than a font-weight variant.
const fontFamily = {
  sans: ["Oxygen"],
  "sans-bold": ["Oxygen-Bold"],
};

module.exports = { palette, tailwindColors, fontFamily };
