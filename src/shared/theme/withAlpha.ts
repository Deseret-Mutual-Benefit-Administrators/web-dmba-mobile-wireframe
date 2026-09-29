/**
 * Derive a translucent variant of a theme token without hand-typing an
 * `rgba(...)` literal. Before ADR-164 the app carried `rgba(136, 189, 242, 0.2)`
 * style copies of token values; when the token changed, the copies did not.
 * Always build tints from the token: `withAlpha(colors.searchSlate.light, 0.2)`.
 *
 * Accepts 3- or 6-digit hex, with or without `#`. Alpha is clamped to [0, 1].
 * Pure and React-Native-free so it is unit-tested directly.
 */
export function withAlpha(hex: string, alpha: number): string {
  const raw = hex.trim().replace(/^#/, "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`withAlpha: expected a 3- or 6-digit hex color, got "${hex}"`);
  }
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
