import { useTranslation } from "@/src/shared/i18n";
import { gradientCss } from "@/src/shared/theme/gradients";
import { colors } from "@/src/shared/theme/colors";

/**
 * Full-width gradient progress bar for dashboard deductible cards.
 * Shows label, a spent/remaining/max row, and a tall gradient-filled bar.
 */

interface FullWidthProgressBarProps {
  label: string;
  spent: number;
  remaining: number;
  max: number;
  gradientColors: [string, string];
}

function formatDollars(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export function FullWidthProgressBar({ label, spent, remaining, max, gradientColors }: FullWidthProgressBarProps) {
  const { t } = useTranslation();
  const percentage = max > 0 ? Math.min((spent / max) * 100, 100) : 0;

  return (
    <div className="mb-4">
      {/* Bar label */}
      <p className="text-xs font-semibold text-brand-primary mb-1">{label}</p>

      {/* Spent / Remaining / Max row */}
      <div className="flex-row justify-between mb-1.5">
        <span className="text-xs text-brand-secondary">
          {t("dashboard.spent")}: {formatDollars(spent)}
        </span>
        <span className="text-xs text-brand-secondary">
          {t("dashboard.remaining")}: {formatDollars(remaining)}
        </span>
        <span className="text-xs text-brand-secondary">
          {t("dashboard.max")}: {formatDollars(max)}
        </span>
      </div>

      {/* Progress bar track */}
      <div
        className="w-full h-6 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.financial.track }}
        role="progressbar"
        aria-label={`${label}: ${formatDollars(spent)} of ${formatDollars(max)}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        {percentage > 0 && <div style={{ width: `${percentage}%`, height: "100%", background: gradientCss(gradientColors, 90) }} />}
      </div>
    </div>
  );
}
