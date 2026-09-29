/** Step progress indicator — a progressbar with a numeric value, not decorative dots. */
import { useTranslation } from "@/src/shared/i18n";
import { colors } from "@/src/shared/theme/colors";
import { stepProgress, type ClaimSubmissionStep } from "../services/claimSubmissionSteps";

interface ClaimSubmissionStepProgressProps {
  step: ClaimSubmissionStep;
}

export function ClaimSubmissionStepProgress({ step }: ClaimSubmissionStepProgressProps) {
  const { t } = useTranslation();
  const { current, total } = stepProgress(step);

  if (current === 0) return null;

  const label = t("claimSubmission.stepProgress", { current, total });

  return (
    <div
      className="px-4 pt-3 pb-1"
      role="progressbar"
      aria-label={t("claimSubmission.stepProgressLabel")}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={label}
    >
      <span className="text-xs text-gray-500 mb-1.5">{label}</span>
      <div className="flex-row" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              marginRight: index === total - 1 ? 0 : 4,
              backgroundColor: index < current ? colors.brand.accent : colors.border,
            }}
          />
        ))}
      </div>
    </div>
  );
}
