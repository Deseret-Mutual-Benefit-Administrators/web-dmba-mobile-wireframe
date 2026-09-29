import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import {
  claimFilingDeadline,
  formatTransactionDate,
  planYearStatus,
  planYearStatusMessageKey,
  planYearStatusTone,
  type PlanYearDates,
} from "./cardServices";

/**
 * The sentence that says where an account sits in time. Renders nothing for an
 * active or lifetime account. States facts and stops (ADR-107).
 */

type PlanYearTone = ReturnType<typeof planYearStatusTone>;

interface PlanYearStatusBannerProps {
  dates: PlanYearDates;
  /** Local `yyyy-MM-dd`. */
  today: string;
}

const TONE_STYLES: Record<PlanYearTone, { container: string; text: string; icon: string; iconColor: string }> = {
  neutral: {
    container: "bg-gray-50",
    text: "text-gray-600",
    icon: "calendar-outline",
    iconColor: colors.brand.secondary,
  },
  info: {
    container: "bg-blue-50",
    text: "text-blue-800",
    icon: "calendar-outline",
    iconColor: colors.brand.accent,
  },
  warning: {
    container: "bg-amber-50",
    text: "text-amber-800",
    icon: "time-outline",
    iconColor: colors.tone.warning.icon,
  },
};

export function PlanYearStatusBanner({ dates, today }: PlanYearStatusBannerProps) {
  const { t } = useTranslation();

  const status = planYearStatus(dates, today);
  const messageKey = planYearStatusMessageKey(status);
  if (messageKey === null) return null;

  const message = t(messageKey, {
    startDate: formatTransactionDate(dates.planStartDate ?? ""),
    endDate: formatTransactionDate(dates.planEndDate ?? ""),
    deadline: formatTransactionDate(claimFilingDeadline(dates)),
  });

  const tone = TONE_STYLES[planYearStatusTone(status)];

  return (
    <div
      className={`${tone.container} rounded-xl px-4 py-3 mb-3 flex-row items-start`}
      role={status === "runOut" ? "alert" : "note"}
      aria-label={message}
    >
      <div style={{ marginRight: 8, marginTop: 1 }}>
        <Icon name={tone.icon} size={16} color={tone.iconColor} />
      </div>
      <p className={`${tone.text} text-xs flex-1`}>{message}</p>
    </div>
  );
}
