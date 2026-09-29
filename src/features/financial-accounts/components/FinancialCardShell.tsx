import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/src/shared/icons";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Spinner } from "@/src/shared/components/Spinner";
import { financialCardGradient, gradientCss } from "@/src/shared/theme/gradients";
import { colors } from "@/src/shared/theme/colors";
import { lines } from "@/src/features/dashboard/webText";

/**
 * Shared wrapper for all financial account dashboard cards.
 * Provides the consistent card shell: gradient icon circle, title, chevron,
 * and a collapsible content area — mirroring CollapsibleDeductibleCard.
 *
 * With `onPress`, the title area links to the account's own screen and the
 * chevron is a separate sibling control that expands the inline summary.
 */

interface FinancialCardShellBaseProps {
  /** Ionicons name, resolved through `src/shared/icons.tsx`. */
  icon: string;
  title: string;
  /** Accessibility label for the expand/collapse control */
  accessibilityLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
  isLoading: boolean;
  /** The card's own read failed — renders "couldn't load — Try Again" (ADR-139). */
  isError?: boolean;
  /** Re-runs the failed read. */
  onRetry?: () => void;
  children: ReactNode;
  /** Short state pill beside the title — a `PlanYearBadge`, or nothing. */
  badge?: ReactNode;
  /** "Viewing {name}'s account" — rendered under the title. */
  caption?: string;
}

type CardLinkProps =
  | { onPress?: undefined; pressAccessibilityLabel?: undefined }
  | { onPress: () => void; pressAccessibilityLabel: string };

type FinancialCardShellProps = FinancialCardShellBaseProps & CardLinkProps;

const cardLinkStyle: CSSProperties = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
};

const toggleStyle: CSSProperties = {
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 8,
  paddingRight: 16,
};

export function FinancialCardShell({
  icon,
  title,
  accessibilityLabel,
  isExpanded,
  onToggle,
  isLoading,
  isError = false,
  onRetry,
  children,
  badge,
  caption,
  onPress,
  pressAccessibilityLabel,
}: FinancialCardShellProps) {
  const titleRow = (
    <>
      <div style={{ marginRight: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            background: gradientCss(financialCardGradient, 90),
          }}
        >
          <Icon name={icon} size={18} color={colors.brand.surface} />
        </div>
      </div>
      <div className="flex-shrink">
        <div className="flex-row items-center">
          <p className="text-brand-primary font-semibold text-base flex-shrink" style={lines(1)}>
            {title}
          </p>
          {badge ? <div className="ml-2">{badge}</div> : null}
        </div>
        {caption ? (
          <p className="text-xs text-gray-500 mt-0.5" style={lines(1)}>
            {caption}
          </p>
        ) : null}
      </div>
    </>
  );

  const captionSuffix = caption ? `, ${caption}` : "";
  const effectivePressAccessibilityLabel = pressAccessibilityLabel
    ? `${pressAccessibilityLabel}${captionSuffix}`
    : pressAccessibilityLabel;
  const effectiveToggleAccessibilityLabel = `${accessibilityLabel}${captionSuffix}`;

  const chevron = <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.financial.gradientStart} />;

  return (
    <div className="bg-brand-surface rounded-2xl mb-3 overflow-hidden shadow-sm">
      {/* ── Card Header ── */}
      {onPress ? (
        <div className="flex-row items-center">
          <button type="button" onClick={onPress} style={cardLinkStyle} className="active:opacity-70" aria-label={effectivePressAccessibilityLabel}>
            {titleRow}
          </button>
          <button type="button" onClick={onToggle} style={toggleStyle} aria-label={accessibilityLabel} aria-expanded={isExpanded}>
            {chevron}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="p-4 flex-row items-center justify-between"
          aria-label={effectiveToggleAccessibilityLabel}
          aria-expanded={isExpanded}
        >
          <div className="flex-row items-center flex-1 mr-4">{titleRow}</div>
          {chevron}
        </button>
      )}

      {/* ── Expandable Body ── */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {isLoading ? (
            <div className="items-center justify-center py-8">
              <Spinner size="small" tone="accent" />
            </div>
          ) : isError ? (
            <InlineErrorState onRetry={onRetry} className="px-4 py-6" />
          ) : (
            <div className="p-4">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
