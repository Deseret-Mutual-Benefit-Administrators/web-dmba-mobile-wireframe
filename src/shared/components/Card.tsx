import type { AriaRole, CSSProperties, ReactNode } from "react";
import { colors, withAlpha } from "@/src/shared/theme/colors";

export type CardVariant = "solid" | "translucent";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  accessibilityRole?: AriaRole;
  accessibilityLabel?: string;
}

/**
 * Canonical card container: `rounded-2xl p-4 shadow-sm` + a solid or translucent
 * background. Non-pressable. Tappable cards apply the same classes to their own
 * button, or spread `cardShadowStyle`.
 * `translucent` is an inline 85%-white background, matching the app exactly.
 */
export function Card({ variant = "solid", className, style, children, accessibilityRole, accessibilityLabel }: CardProps) {
  const isTranslucent = variant === "translucent";

  return (
    <div
      className={["rounded-2xl p-4 shadow-sm", isTranslucent ? "" : "bg-brand-surface", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...(isTranslucent ? { backgroundColor: withAlpha(colors.brand.surface, 0.85) } : undefined),
        ...style,
      }}
      role={accessibilityRole}
      aria-label={accessibilityLabel}
    >
      {children}
    </div>
  );
}

/**
 * The app-standard card shadow as a CSS style object (the RN original is
 * shadowOffset 0/1, opacity 0.06, radius 4 — visually `shadow-sm`).
 */
export const cardShadowStyle: CSSProperties = {
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
};
