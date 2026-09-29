import { useTranslation } from "@/src/shared/i18n";
import { colors } from "@/src/shared/theme/colors";

export type SpinnerSize = "small" | "large";
export type SpinnerTone = "accent" | "onDark";

interface SpinnerProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Falls back to `common.loading`. */
  label?: string;
}

/**
 * The one place the activity-indicator colour is spelled out: accent on light,
 * white on dark (`tone="onDark"`, e.g. inside a primary Button). Web: a CSS ring
 * spinner sized like iOS's small (20) / large (36) ActivityIndicator.
 */
export function Spinner({ size = "small", tone = "accent", label }: SpinnerProps) {
  const { t } = useTranslation();
  const color = tone === "onDark" ? colors.brand.surface : colors.brand.accent;
  const px = size === "large" ? 36 : 20;
  return (
    <span
      role="progressbar"
      aria-label={label ?? t("common.loading")}
      className="inline-block animate-spin rounded-full self-center"
      style={{ width: px, height: px, border: `${size === "large" ? 3 : 2}px solid ${color}`, borderTopColor: "transparent" }}
    />
  );
}
