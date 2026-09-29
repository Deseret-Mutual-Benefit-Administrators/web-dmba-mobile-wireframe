import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignInVerificationScreen } from "../components/SignInVerificationScreen";
import { placeholderEnrollment } from "../placeholder";
import type { EnrollmentInvalidationReason, EnrollmentState } from "../types";

const STATES: EnrollmentState[] = [
  "unsupported",
  "notEnrolled",
  "pushPermissionDenied",
  "biometricsNotEnrolled",
  "enrolling",
  "enrolled",
  "invalidated",
  "error",
];

/**
 * Route host for Profile › Sign-in verification. The app's enrollment hook is
 * replaced by local state: Set up → enrolled, Remove → not enrolled, Retry →
 * not enrolled.
 *
 * `?state=<EnrollmentState>` opens any state (loading = `enrolling`, empty =
 * `notEnrolled`); `?reason=biometricKeyInvalid|removed` picks the invalidated copy.
 */
export function SignInVerificationRoute() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const requested = params.get("state");
  const initial: EnrollmentState =
    requested === "loading" ? "enrolling" : requested === "empty" ? "notEnrolled" : STATES.includes(requested as EnrollmentState) ? (requested as EnrollmentState) : "notEnrolled";
  const reason = (params.get("reason") as EnrollmentInvalidationReason | null) ?? "removed";
  const [state, setState] = useState<EnrollmentState>(initial);

  return (
    <SignInVerificationScreen
      state={state}
      enrollment={state === "enrolled" ? placeholderEnrollment : null}
      invalidationReason={state === "invalidated" ? reason : undefined}
      onSetUp={() => setState("enrolled")}
      onRemove={() => setState("notEnrolled")}
      onRetry={() => setState("notEnrolled")}
      onOpenSettings={() => {}}
      onBack={() => navigate(-1)}
    />
  );
}
