import { useTranslation } from "@/src/shared/i18n";
import { colors } from "@/src/shared/theme/colors";
import type { DeductibleProgress } from "../types";

/**
 * Deductible / OOP progress card — shows a progress bar with amounts.
 */

interface ProgressCardProps {
  data: DeductibleProgress;
}

export function ProgressCard({ data }: ProgressCardProps) {
  const { t } = useTranslation();
  const percentage = data.total > 0 ? Math.min((data.used / data.total) * 100, 100) : 0;
  const remaining = Math.max(data.total - data.used, 0);

  return (
    <div className="bg-brand-surface rounded-xl p-4 shadow-sm">
      <p className="text-sm text-brand-secondary mb-1">{data.label}</p>

      {/* Amounts */}
      <div className="flex-row items-baseline mb-2">
        <span className="text-xl font-bold text-brand-primary">${data.used.toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
        <span className="text-sm text-brand-secondary ml-1">of ${data.total.toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2.5 bg-gray-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-label={data.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: percentage > 80 ? colors.error : percentage > 50 ? colors.warning : colors.info,
          }}
        />
      </div>

      {/* Remaining */}
      <p className="text-xs text-brand-secondary mt-1.5">
        ${remaining.toLocaleString("en-US", { minimumFractionDigits: 0 })} {t("dashboard.remaining").toLowerCase()}
      </p>
    </div>
  );
}
