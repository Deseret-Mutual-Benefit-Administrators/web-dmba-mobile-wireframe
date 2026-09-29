/**
 * The sign-in approval screen (ADR-195 §7). No member data — only what the
 * identity provider said about the sign-in attempt. Deny is as reachable as
 * Approve.
 *
 * Placeholder states: `?result=approved|denied|expired|userVerificationCancelled|userVerificationFailed|failed`
 * opens the result view; `?state=loading` shows Approve busy; `?expires=none`
 * hides the countdown (the iOS SDK supplies no expiry).
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { IconChip } from "@/src/shared/components/IconChip";
import type { IconChipTone } from "@/src/shared/components/IconChip";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Caption, Label } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import { placeholderChallenge } from "../placeholder";
import type { VerifyResult } from "../types";

/** One heading style for both views. */
const HEADING_CLASS = "text-2xl font-semibold font-sans-bold text-brand-primary text-center mt-4";

const RESULT_APPEARANCE: Record<VerifyResult, { icon: string; tone: IconChipTone; color: string }> = {
  approved: { icon: "checkmark-circle", tone: "success", color: colors.tone.success.icon },
  denied: { icon: "shield-checkmark", tone: "success", color: colors.tone.success.icon },
  expired: { icon: "time-outline", tone: "neutral", color: colors.tone.neutral.icon },
  userVerificationCancelled: { icon: "close-circle", tone: "warning", color: colors.tone.warning.icon },
  userVerificationFailed: { icon: "alert-circle", tone: "warning", color: colors.tone.warning.icon },
  failed: { icon: "cloud-offline-outline", tone: "error", color: colors.tone.error.icon },
};

const RESULTS_OFFERING_PASSWORD_CHANGE: readonly VerifyResult[] = ["denied", "userVerificationCancelled", "userVerificationFailed"];

export function VerifyChallengeScreen() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const initialResult = params.get("result") as VerifyResult | null;
  const [view, setView] = useState<"prompt" | "result">(initialResult ? "result" : "prompt");
  const [result, setResult] = useState<VerifyResult | null>(initialResult);
  const isResolving = params.get("state") === "loading";
  const { origin, issuedAtLabel } = placeholderChallenge;
  const secondsRemaining = params.get("expires") === "none" ? null : placeholderChallenge.secondsRemaining;

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      <ScreenScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", minHeight: "100%" }}>
        {view === "prompt" ? (
          <PromptView
            origin={origin}
            issuedAtLabel={issuedAtLabel}
            secondsRemaining={secondsRemaining}
            isResolving={isResolving}
            onApprove={() => {
              setResult("approved");
              setView("result");
            }}
            onDeny={() => {
              setResult("denied");
              setView("result");
            }}
          />
        ) : (
          <ResultView result={result ?? "expired"} onDone={() => navigate("/")} onChangePassword={() => navigate("/settings/change-password")} />
        )}
      </ScreenScrollView>
    </div>
  );
}

function PromptView({
  origin,
  issuedAtLabel,
  secondsRemaining,
  isResolving,
  onApprove,
  onDeny,
}: {
  origin: string;
  issuedAtLabel: string;
  secondsRemaining: number | null;
  isResolving: boolean;
  onApprove: () => void;
  onDeny: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="items-center">
      <IconChip icon={<Icon name="shield-checkmark-outline" size={22} color={colors.tone.info.icon} />} />
      <h1 className={HEADING_CLASS}>{t("deviceAuth.verify.title")}</h1>
      <Label className="text-center mt-2">{t("deviceAuth.verify.body")}</Label>

      <Card className="w-full mt-6">
        <Caption>{t("deviceAuth.verify.originLabel")}</Caption>
        <p className="text-base font-sans text-brand-primary mt-1">{origin.length > 0 ? origin : t("deviceAuth.verify.unknownOrigin")}</p>

        {issuedAtLabel.length > 0 ? (
          <>
            <Caption className="mt-3">{t("deviceAuth.verify.issuedAtLabel")}</Caption>
            <p className="text-base font-sans text-brand-primary mt-1">{issuedAtLabel}</p>
          </>
        ) : null}

        {secondsRemaining !== null ? <Caption className="mt-3">{t("deviceAuth.verify.expiresIn", { count: secondsRemaining })}</Caption> : null}
      </Card>

      <Button
        label={t("deviceAuth.verify.approve")}
        onPress={onApprove}
        loading={isResolving}
        fullWidth
        className="mt-6"
        accessibilityLabel={t("deviceAuth.verify.approve")}
        accessibilityHint={t("deviceAuth.verify.approveHint")}
      />
      <Button
        label={t("deviceAuth.verify.deny")}
        onPress={onDeny}
        variant="secondary"
        disabled={isResolving}
        fullWidth
        className="mt-3"
        accessibilityLabel={t("deviceAuth.verify.deny")}
        accessibilityHint={t("deviceAuth.verify.denyHint")}
      />
    </div>
  );
}

function ResultView({ result, onDone, onChangePassword }: { result: VerifyResult; onDone: () => void; onChangePassword: () => void }) {
  const { t } = useTranslation();
  const appearance = RESULT_APPEARANCE[result] ?? RESULT_APPEARANCE.expired;
  const title = t(`deviceAuth.verify.result.${result}.title`);
  const message = t(`deviceAuth.verify.result.${result}.message`);

  return (
    <div className="items-center" role="alert" aria-live="polite">
      <IconChip tone={appearance.tone} icon={<Icon name={appearance.icon} size={22} color={appearance.color} />} />
      <h1 className={HEADING_CLASS}>{title}</h1>
      <Label className="text-center mt-2">{message}</Label>

      <Button label={t("deviceAuth.verify.done")} onPress={onDone} fullWidth className="mt-8" accessibilityLabel={t("deviceAuth.verify.done")} />
      {RESULTS_OFFERING_PASSWORD_CHANGE.includes(result) ? (
        <Button
          label={t("deviceAuth.verify.changePassword")}
          onPress={onChangePassword}
          variant="secondary"
          fullWidth
          className="mt-3"
          accessibilityLabel={t("deviceAuth.verify.changePassword")}
        />
      ) : null}
    </div>
  );
}
