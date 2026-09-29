import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/src/shared/i18n";
import { ChangePasswordScreen } from "../components/ChangePasswordScreen";
import { validatePassword } from "../services/passwordValidation";
import { placeholderUser } from "../placeholder";
import { useScreenState } from "../useScreenState";

/** Local stand-in for `useChangePassword` — form state only, no request. */
function useChangePassword() {
  const screenState = useScreenState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validationResult = validatePassword(newPassword, {
    username: placeholderUser.email.split("@")[0],
    firstName: placeholderUser.firstName,
    lastName: placeholderUser.lastName,
  });
  const confirmMatch = confirmPassword.length > 0 && confirmPassword === newPassword;
  const canSubmit = currentPassword.length > 0 && validationResult.isValid && confirmMatch;

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    serverError: screenState === "error" || submitted ? t("common.error") : null,
    validationResult,
    confirmMatch,
    canSubmit,
    isPending: false,
    handleSubmit: () => setSubmitted(true),
  };
}

export function ChangePasswordRoute() {
  const navigate = useNavigate();
  const props = useChangePassword();

  return <ChangePasswordScreen {...props} onBack={() => navigate(-1)} />;
}
