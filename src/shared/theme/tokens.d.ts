/**
 * Hand-written type declarations for the CommonJS `tokens.js`. Kept in sync
 * with `tokens.js` by hand — there's no build step that generates one from
 * the other.
 */

export interface BrandPalette {
  primary: string;
  secondary: string;
  accent: string;
  accentDark: string;
  background: string;
  surface: string;
}

export interface NeutralScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface TonePalette {
  icon: string;
  tint: string;
}

export interface TonePalettes {
  success: TonePalette;
  warning: TonePalette;
  error: TonePalette;
  info: TonePalette;
  neutral: TonePalette;
}

export interface FinancialPalette {
  gradientStart: string;
  gradientEnd: string;
  gradientDeep: string;
  track: string;
  orthoGradientStart: string;
  orthoGradientEnd: string;
  retirementAccent: string;
}

export interface SearchSlatePalette {
  base: string;
  light: string;
  deep: string;
  tint1: string;
  tint2: string;
  tint3: string;
}

export interface Palette {
  brand: BrandPalette;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  successTint: string;
  warningTint: string;
  errorTint: string;
  infoTint: string;
  neutral: NeutralScale;
  financial: FinancialPalette;
  tone: TonePalettes;
  inNetwork: string;
  medication: string;
  highlight: { base: string; light: string };
  chart: { billed: string; responsibility: string };
  searchSlate: SearchSlatePalette;
}

export interface TailwindBrandColors {
  primary: string;
  secondary: string;
  accent: string;
  "accent-dark": string;
  background: string;
  surface: string;
  border: string;
}

export interface TailwindColors {
  brand: TailwindBrandColors;
  success: string;
  warning: string;
  error: string;
  info: string;
  "success-tint": string;
  "warning-tint": string;
  "error-tint": string;
  "info-tint": string;
}

export interface FontFamily {
  sans: string[];
  "sans-bold": string[];
}

export const palette: Palette;
export const tailwindColors: TailwindColors;
export const fontFamily: FontFamily;
