import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import type { PasswordValidationResult } from "../services/passwordValidation";

interface ChangePasswordScreenProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: (value: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  serverError: string | null;
  validationResult: PasswordValidationResult;
  confirmMatch: boolean;
  canSubmit: boolean;
  isPending: boolean;
  handleSubmit: () => void;
  onBack: () => void;
}

export function ChangePasswordScreen({
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
  serverError,
  validationResult,
  confirmMatch,
  canSubmit,
  isPending,
  handleSubmit,
  onBack,
}: ChangePasswordScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={t("settings.changePassword.title")} onBack={onBack} />

      <KeyboardAvoidingScreen className="flex-1">
        <ScreenScrollView padded={false} bottomExtra={16}>
        {/* Server error banner */}
        {serverError !== null && (
          <div
            className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            role="alert"
            aria-label={t("settings.changePassword.errorBanner")}
          >
            <span className="text-sm text-red-700">{serverError}</span>
          </div>
        )}

        {/* Current password field */}
        <Card className="mx-4 mt-4 mb-3">
          <span className="text-sm font-medium text-brand-primary mb-1">
            {t("settings.changePassword.currentPassword")}
          </span>
          <div className="relative">
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type={showCurrentPassword ? "text" : "password"}
              placeholder={t("settings.changePassword.currentPasswordPlaceholder")}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="current-password"
              className="text-base text-brand-primary pr-10 py-1 bg-transparent outline-none placeholder:text-brand-secondary"
              aria-label={t("settings.changePassword.currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-0 top-0 bottom-0 justify-center px-1"
              aria-label={
                showCurrentPassword
                  ? t("settings.changePassword.hidePassword")
                  : t("settings.changePassword.showPassword")
              }
            >
              <Icon
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.brand.secondary}
              />
            </button>
          </div>
        </Card>

        {/* New password field */}
        <Card className="mx-4 mb-3">
          <span className="text-sm font-medium text-brand-primary mb-1">
            {t("settings.changePassword.newPassword")}
          </span>
          <div className="relative">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={showNewPassword ? "text" : "password"}
              placeholder={t("settings.changePassword.newPasswordPlaceholder")}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="new-password"
              className="text-base text-brand-primary pr-10 py-1 bg-transparent outline-none placeholder:text-brand-secondary"
              aria-label={t("settings.changePassword.newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-0 top-0 bottom-0 justify-center px-1"
              aria-label={
                showNewPassword
                  ? t("settings.changePassword.hidePassword")
                  : t("settings.changePassword.showPassword")
              }
            >
              <Icon
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.brand.secondary}
              />
            </button>
          </div>

          {/* Validation checklist — only shown when there's input */}
          {newPassword.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {validationResult.rules.map((rule) => (
                <div key={rule.key} className="flex-row items-center mb-1">
                  <Icon
                    name={rule.passed ? "checkmark-circle" : "close-circle-outline"}
                    size={16}
                    color={rule.passed ? colors.success : colors.brand.secondary}
                  />
                  <span
                    className={`text-xs ml-2 ${
                      rule.passed ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {t(rule.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Confirm password field */}
        <Card className="mx-4 mb-3">
          <span className="text-sm font-medium text-brand-primary mb-1">
            {t("settings.changePassword.confirmPassword")}
          </span>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("settings.changePassword.confirmPasswordPlaceholder")}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="new-password"
              className="text-base text-brand-primary pr-10 py-1 bg-transparent outline-none placeholder:text-brand-secondary"
              aria-label={t("settings.changePassword.confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-0 bottom-0 justify-center px-1"
              aria-label={
                showConfirmPassword
                  ? t("settings.changePassword.hidePassword")
                  : t("settings.changePassword.showPassword")
              }
            >
              <Icon
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.brand.secondary}
              />
            </button>
          </div>

          {/* Confirm match indicator */}
          {confirmPassword.length > 0 && (
            <div className="flex-row items-center mt-2">
              <Icon
                name={confirmMatch ? "checkmark-circle" : "close-circle-outline"}
                size={16}
                color={confirmMatch ? colors.success : colors.error}
              />
              <span
                className={`text-xs ml-2 ${
                  confirmMatch ? "text-green-600" : "text-error"
                }`}
              >
                {confirmMatch
                  ? t("settings.changePassword.rules.match")
                  : t("settings.changePassword.rules.noMatch")}
              </span>
            </div>
          )}
        </Card>

        {/* Submit button */}
        <Button
          label={t("settings.changePassword.submit")}
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={isPending}
          fullWidth
          className="mx-4 mt-2"
          // Wireframe: the shared Button's `w-full` plus `mx-4` overflows in CSS; let the column stretch it instead.
          style={{ width: "auto" }}
        />
        </ScreenScrollView>
      </KeyboardAvoidingScreen>
    </div>
  );
}
