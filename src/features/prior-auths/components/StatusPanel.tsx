/**
 * Status-specific contextual panel on the Prior Auth detail screen.
 *   Submitted → none · In Progress → amber · Approved → green · Denied → red · Closed → neutral
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Button } from "@/src/shared/components/Button";
import { colors } from "@/src/shared/theme/colors";
import type { PriorAuthDetail } from "../types";

interface StatusPanelProps {
  auth: PriorAuthDetail;
}

export function StatusPanel({ auth }: StatusPanelProps) {
  switch (auth.statusBucket) {
    case "Approved":
      return <ApprovedPanel auth={auth} />;
    case "Denied":
      return <DeniedPanel auth={auth} />;
    case "In Progress":
      return <InProgressPanel />;
    case "Closed":
      return <ClosedPanel />;
    case "Submitted":
    default:
      return null;
  }
}

function ApprovedPanel({ auth }: { auth: PriorAuthDetail }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg p-4 mb-4 border border-green-200" style={{ backgroundColor: colors.successTint }}>
      <div className="flex-row items-center mb-3">
        <Icon name="checkmark-circle" size={22} color={colors.tone.success.icon} />
        <span className="ml-2 text-base font-semibold text-green-800">{t("priorAuth.approvedTitle")}</span>
      </div>

      {auth.authorizationNumber && (
        <div className="mb-3 bg-green-50 rounded-xl px-3 py-2.5 border border-green-100">
          <span className="text-xs text-green-700 mb-0.5">{t("priorAuth.authorizationNumber")}</span>
          <span className="text-sm font-bold text-green-900">{auth.authorizationNumber}</span>
        </div>
      )}

      <span className="text-xs text-green-700 leading-5">{t("priorAuth.approvedFootnote")}</span>
    </div>
  );
}

const DENIAL_REASON_KEY_MAP: Record<string, string> = {
  "Exclusion of the Plan": "exclusionOfThePlan",
  "Does not meet medical criteria": "doesNotMeetMedicalCriteria",
  "Reached the maximum benefit allowed": "reachedMaximumBenefit",
  Other: "other",
};

function DeniedPanel({ auth }: { auth: PriorAuthDetail }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  let denialText: string;
  if (auth.denialReason && DENIAL_REASON_KEY_MAP[auth.denialReason]) {
    denialText = t(`priorAuth.denialReason.${DENIAL_REASON_KEY_MAP[auth.denialReason]}`);
  } else if (auth.notes) {
    denialText = auth.notes;
  } else {
    denialText = t("priorAuth.deniedDefaultMessage");
  }

  // Reference number, date and provider only — never the diagnosis or procedure.
  const handleAskQuestion = () => {
    const params = new URLSearchParams({
      topic: "priorAuthorization",
      kind: "denialQuestion",
      priorAuthId: auth.displayId,
      ...(auth.dateNeeded ? { serviceDate: new Date(auth.dateNeeded).toLocaleDateString() } : {}),
      ...(auth.provider ? { providerName: auth.provider } : {}),
    });
    navigate(`/messages/compose?${params.toString()}`);
  };

  return (
    <div className="rounded-lg p-4 mb-4 border border-red-200" style={{ backgroundColor: colors.errorTint }}>
      <div className="flex-row items-center mb-3">
        <Icon name="close-circle" size={22} color={colors.tone.error.icon} />
        <span className="ml-2 text-base font-semibold text-red-800">{t("priorAuth.deniedTitle")}</span>
      </div>

      <span className="text-sm text-red-700 leading-5 mb-3">{denialText}</span>

      <Button
        label={t("priorAuth.askQuestionAboutDenial")}
        onPress={handleAskQuestion}
        variant="secondary"
        icon={<Icon name="chatbubble-ellipses-outline" size={18} color={colors.brand.accent} />}
        fullWidth
        accessibilityHint={t("priorAuth.denialQuestionHint")}
      />

      <button
        type="button"
        onClick={() => navigate("/contact")}
        className="flex-row items-center justify-center mt-2 py-1.5 active:opacity-80"
        aria-label={t("priorAuth.callDmba")}
      >
        <Icon name="call-outline" size={16} color={colors.brand.accent} />
        <span className="text-brand-accent font-semibold ml-1.5 text-sm">{t("priorAuth.callDmba")}</span>
      </button>
    </div>
  );
}

function ClosedPanel() {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg p-4 mb-4 border border-gray-200" style={{ backgroundColor: colors.tone.neutral.tint }}>
      <div className="flex-row items-center mb-3">
        <Icon name="archive" size={22} color={colors.tone.neutral.icon} />
        <span className="ml-2 text-base font-semibold text-gray-800">{t("priorAuth.closedTitle")}</span>
      </div>

      <span className="text-sm text-gray-700 leading-5">{t("priorAuth.closedBody")}</span>
    </div>
  );
}

function InProgressPanel() {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg p-4 mb-4 border border-amber-200" style={{ backgroundColor: colors.warningTint }}>
      <div className="flex-row items-center mb-3">
        <Icon name="time" size={22} color={colors.tone.warning.icon} />
        <span className="ml-2 text-base font-semibold text-amber-800">{t("priorAuth.underReviewTitle")}</span>
      </div>

      <span className="text-sm text-amber-700 leading-5">{t("priorAuth.underReviewBody")}</span>
    </div>
  );
}
