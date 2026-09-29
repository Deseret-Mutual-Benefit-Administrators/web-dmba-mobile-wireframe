import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { IconChip } from "@/src/shared/components/IconChip";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Caption, SectionTitle } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import type { EnrollmentInvalidationReason, EnrollmentState, OktaEnrollment } from "../types";

interface SignInVerificationScreenProps {
  state: EnrollmentState;
  enrollment: OktaEnrollment | null;
  /** Present only when the last failure was the enrollment being dropped server-side. */
  invalidationReason?: EnrollmentInvalidationReason;
  onSetUp: () => void;
  onRemove: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

/**
 * "Sign-in verification" — registering this phone as the approval factor for a
 * dmba.com sign-in (ADR-195). One state in, one explanation out. Shows no
 * member data.
 */
export function SignInVerificationScreen({
  state,
  enrollment,
  invalidationReason,
  onSetUp,
  onRemove,
  onRetry,
  onOpenSettings,
  onBack,
}: SignInVerificationScreenProps) {
  const { t } = useTranslation();

  /** Stand-in for the app's native confirm alert. */
  function confirmRemove() {
    if (window.confirm(`${t("deviceAuth.enroll.removeConfirmTitle")}\n\n${t("deviceAuth.enroll.removeConfirmMessage")}`)) {
      onRemove();
    }
  }

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      <ScreenHeader title={t("deviceAuth.enroll.title")} onBack={onBack} />

      <ScreenScrollView bottomExtra={8}>
        {state === "unsupported" ? (
          <EmptyState
            icon={<Icon name="phone-portrait-outline" size={40} color={colors.neutral[500]} />}
            title={t("deviceAuth.enroll.unsupportedTitle")}
            message={t("deviceAuth.enroll.unsupportedBody")}
          />
        ) : state === "error" ? (
          <InlineErrorState className="py-10" message={t("deviceAuth.enroll.errorBody")} onRetry={onRetry} />
        ) : (
          <div className="pt-4">
            <Card>
              <div className="flex-row items-start">
                <div className="mr-3">
                  <IconChip
                    size="sm"
                    tone={state === "enrolled" ? "success" : "info"}
                    icon={
                      <Icon
                        name={state === "enrolled" ? "shield-checkmark" : "shield-outline"}
                        size={20}
                        color={state === "enrolled" ? colors.tone.success.icon : colors.brand.accent}
                      />
                    }
                  />
                </div>
                <div className="flex-1">
                  <SectionTitle>{headingKey(state, invalidationReason, t)}</SectionTitle>
                  <p className="text-sm text-gray-600 mt-1">{bodyKey(state, invalidationReason, t)}</p>
                </div>
              </div>

              {state === "enrolled" && enrollment ? (
                <div className="mt-4">
                  <KeyValueRow label={t("deviceAuth.enroll.deviceLabel")} value={enrollment.deviceLabel} />
                  {formatSetUpDate(enrollment.createdAt) !== undefined ? (
                    <KeyValueRow label={t("deviceAuth.enroll.setUpOn")} value={formatSetUpDate(enrollment.createdAt) ?? ""} divider />
                  ) : null}
                  <Button
                    variant="secondary"
                    fullWidth
                    className="mt-4"
                    label={t("deviceAuth.enroll.removeButton")}
                    onPress={confirmRemove}
                    accessibilityLabel={t("deviceAuth.enroll.removeButton")}
                    accessibilityHint={t("deviceAuth.enroll.removeHint")}
                  />
                </div>
              ) : null}

              {state === "pushPermissionDenied" ? (
                <Button
                  fullWidth
                  className="mt-4"
                  label={t("deviceAuth.enroll.openSettingsButton")}
                  onPress={onOpenSettings}
                  accessibilityLabel={t("deviceAuth.enroll.openSettingsButton")}
                  accessibilityHint={t("deviceAuth.enroll.openSettingsHint")}
                />
              ) : null}

              {state === "notEnrolled" || state === "enrolling" || state === "invalidated" ? (
                <div className="mt-4">
                  <Button
                    fullWidth
                    loading={state === "enrolling"}
                    label={state === "invalidated" ? t("deviceAuth.enroll.setUpAgainButton") : t("deviceAuth.enroll.setUpButton")}
                    onPress={onSetUp}
                    accessibilityLabel={state === "invalidated" ? t("deviceAuth.enroll.setUpAgainButton") : t("deviceAuth.enroll.setUpButton")}
                    accessibilityHint={t("common.hints.opensBrowser")}
                  />
                  <Caption className="mt-3">{t("deviceAuth.enroll.browserNote")}</Caption>
                </div>
              ) : null}
            </Card>
          </div>
        )}
      </ScreenScrollView>
    </div>
  );
}

type Translate = (key: string) => string;

function headingKey(state: EnrollmentState, reason: EnrollmentInvalidationReason | undefined, t: Translate): string {
  switch (state) {
    case "enrolled":
      return t("deviceAuth.enroll.enrolledTitle");
    case "biometricsNotEnrolled":
      return t("deviceAuth.enroll.biometricsNotEnrolledTitle");
    case "pushPermissionDenied":
      return t("deviceAuth.enroll.pushDeniedTitle");
    case "invalidated":
      return reason === "biometricKeyInvalid" ? t("deviceAuth.enroll.invalidatedBiometricTitle") : t("deviceAuth.enroll.invalidatedRemovedTitle");
    default:
      return t("deviceAuth.enroll.notEnrolledTitle");
  }
}

function bodyKey(state: EnrollmentState, reason: EnrollmentInvalidationReason | undefined, t: Translate): string {
  switch (state) {
    case "enrolled":
      return t("deviceAuth.enroll.enrolledBody");
    case "biometricsNotEnrolled":
      return t("deviceAuth.enroll.biometricsNotEnrolledBody");
    case "pushPermissionDenied":
      return t("deviceAuth.enroll.pushDeniedBody");
    case "invalidated":
      return reason === "biometricKeyInvalid" ? t("deviceAuth.enroll.invalidatedBiometricBody") : t("deviceAuth.enroll.invalidatedRemovedBody");
    default:
      return t("deviceAuth.enroll.notEnrolledBody");
  }
}

function formatSetUpDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
