import type { ReactNode } from "react";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface CollapsibleSectionProps {
  /** An Ionicons name. */
  icon: string;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  /**
   * `light` (default) — white header with a tinted icon chip. `dark` — the
   * Activity screen's slate band with white text, matching CostComparisonChart's
   * collapsed header so the two stacked cards read as one family.
   */
  variant?: "light" | "dark";
}

export function CollapsibleSection({ icon, title, subtitle, isOpen, onToggle, children, variant = "light" }: CollapsibleSectionProps) {
  if (variant === "dark") {
    return (
      <div className="bg-brand-surface rounded-xl shadow-sm mb-3 overflow-hidden">
        <div className="bg-slate-700">
          <button
            type="button"
            onClick={onToggle}
            className="active:opacity-80"
            style={{ padding: "12px 16px", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            aria-label={title}
            aria-expanded={isOpen}
          >
            <div style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Icon name={icon} size={18} color={colors.brand.surface} />
              <div className="ml-2 flex-1">
                <span className="text-white text-sm font-semibold">{title}</span>
                {subtitle !== undefined && <span className="text-white text-xs">{subtitle}</span>}
              </div>
            </div>
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.brand.surface} />
          </button>
        </div>
        {isOpen && <div className="px-4 pt-3 pb-4">{children}</div>}
      </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-2xl shadow-sm mb-3 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="active:opacity-80"
        style={{ padding: 16, flexDirection: "row", alignItems: "center" }}
        aria-label={title}
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3" aria-hidden="true">
          <Icon name={icon} size={20} color={colors.brand.accent} />
        </div>
        <div className="flex-1">
          <span className="text-brand-primary font-semibold">{title}</span>
          {subtitle !== undefined && <span className="text-gray-500 text-xs mt-0.5">{subtitle}</span>}
        </div>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.brand.secondary} />
      </button>
      {isOpen && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}
