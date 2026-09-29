import { gradientCss } from "@/src/shared/theme/gradients";
import { colors } from "@/src/shared/theme/colors";

/**
 * Wireframe-only stand-in for the article hero image: a neutral gradient block
 * carrying the article title. No remote image is ever loaded.
 */
export function HeroPlaceholder({ title, width, height }: { title: string; width: number | string; height: number }) {
  return (
    <div
      className="items-center justify-center px-6"
      style={{ width, height, background: gradientCss([colors.neutral[200], colors.neutral[300]], 135) }}
      aria-hidden="true"
    >
      <span className="text-center text-sm font-semibold" style={{ color: colors.neutral[600] }}>
        {title}
      </span>
    </div>
  );
}
