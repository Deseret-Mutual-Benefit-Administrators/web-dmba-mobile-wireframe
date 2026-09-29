import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface InlineErrorStateProps {
  /** Member-facing message. Defaults to `common.unavailable`. */
  message?: string;
  /** Re-runs the failed read. When omitted, only the message renders. */
  onRetry?: () => void;
  /** Extra classes for the outer container. */
  className?: string;
}

/**
 * The one way a failed third-party read looks: a short "we couldn't load this"
 * plus Try Again — never an empty box or a card that disappears.
 */
export function InlineErrorState({ message, onRetry, className }: InlineErrorStateProps) {
  const { t } = useTranslation();
  return (
    <div className={`items-center ${className ?? ""}`} role="alert" aria-live="polite">
      <Icon name="cloud-offline-outline" size={28} color={colors.neutral[500]} />
      <span className="text-gray-600 text-sm text-center mt-2">{message ?? t("common.unavailable")}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="active:opacity-70"
          aria-label={t("common.retry")}
          style={{
            marginTop: 12,
            padding: "8px 20px",
            borderRadius: 8,
            border: `1px solid ${colors.financial.gradientStart}`,
          }}
        >
          <span className="text-brand-accent text-sm font-semibold">{t("common.retry")}</span>
        </button>
      )}
    </div>
  );
}
