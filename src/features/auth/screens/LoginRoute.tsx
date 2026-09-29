import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { colors } from "@/src/shared/theme/colors";
import { LoginErrorBanner } from "../components/LoginErrorBanner";
import { APP_VERSION, placeholderFactors, type MfaFactor } from "../placeholder";

type LoginStep = "credentials" | "mfa-select" | "mfa-code" | "mfa-push";

/**
 * Sign-in screen (translated from `app/login.tsx`). No authentication happens:
 * Sign In with both fields filled goes to the dashboard; empty fields show the
 * app's validation error.
 *
 * Placeholder states:
 *  - `?step=mfa-select|mfa-code|mfa-push` opens that step directly
 *  - `?state=error` shows the error banner, `?state=loading` the busy button
 *  - `?biometric=1` shows the returning-user Face ID button
 *  - `?dev=1` shows the dev-mode badge
 */
export function LoginRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const initialStep = (params.get("step") as LoginStep | null) ?? "credentials";
  const hasBiometrics = params.get("biometric") === "1";
  const biometricEnabled = hasBiometrics;
  const showDevBadge = params.get("dev") === "1";

  const [language, setLanguage] = useState<"en" | "es">("en");

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(params.get("state") === "error" ? t("auth.authFailed") : "");
  const [isLoading, setIsLoading] = useState(params.get("state") === "loading");
  const biometricKey = "common.faceId";

  // MFA state
  const [loginStep, setLoginStep] = useState<LoginStep>(initialStep);
  const mfaFactors = placeholderFactors;
  const [selectedFactor, setSelectedFactor] = useState<MfaFactor | null>(initialStep === "mfa-code" ? placeholderFactors[1] : null);
  const [mfaCode, setMfaCode] = useState("");

  const handleSignIn = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError(t("auth.fillFields"));
      return;
    }
    navigate("/");
  };

  const handleSelectFactor = (factor: MfaFactor) => {
    setSelectedFactor(factor);
    setError("");
    setLoginStep(factor.factorType === "push" ? "mfa-push" : "mfa-code");
  };

  const handleVerifyCode = () => {
    if (!mfaCode.trim() || !selectedFactor) return;
    navigate("/");
  };

  const handleBackToCredentials = () => {
    setLoginStep("credentials");
    setMfaCode("");
    setError("");
    setIsLoading(false);
  };

  const handleBiometric = () => navigate("/");

  /** The app opens these in the browser; the wireframe links nowhere. */
  const handleForgotPassword = () => {};
  const handleNeedHelp = () => {};
  const handleRegister = () => {};

  const toggleLanguage = () => setLanguage(language === "en" ? "es" : "en");

  const biometricLabel = t(biometricKey);

  function getFactorLabel(factor: MfaFactor): string {
    switch (factor.factorType) {
      case "push":
        return t("auth.mfaFactorOktaVerify");
      case "sms":
        return t("auth.mfaFactorSms", { phoneNumber: factor.profile?.phoneNumber ?? "" });
      case "token:software:totp":
        return t("auth.mfaFactorAuthApp");
      case "email":
        return t("auth.mfaFactorEmail", { email: factor.profile?.email ?? "" });
      default:
        return factor.factorType;
    }
  }

  function getFactorIcon(factor: MfaFactor): string {
    switch (factor.factorType) {
      case "push":
        return "phone-portrait-outline";
      case "sms":
        return "chatbubble-outline";
      case "token:software:totp":
        return "key-outline";
      case "email":
        return "mail-outline";
      default:
        return "shield-checkmark-outline";
    }
  }

  return (
    <KeyboardAvoidingScreen>
      <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0 }}>
        <div className="flex-1" style={{ minHeight: "100%" }}>
          {/* Dev mode badge — only visible in development builds */}
          {showDevBadge && (
            <div className="items-center pt-3">
              <div className="bg-warning/90 px-4 py-1 rounded-full">
                <span className="text-brand-primary font-bold text-xs tracking-wide">{t("auth.devModeLabel")}</span>
              </div>
            </div>
          )}

          {/* Logo header */}
          <div className="items-center pt-8 pb-4">
            <img
              src="/images/dmba-logo.png"
              style={{ width: 200, height: 82, objectFit: "contain" }}
              alt={t("auth.logoAccessibilityLabel")}
            />
          </div>

          {/* Login card */}
          <div className="flex-1 justify-center px-6 py-4">
            <div className="bg-brand-surface rounded-2xl shadow-sm p-6">
              {/* ===== STEP: CREDENTIALS ===== */}
              {loginStep === "credentials" && (
                <>
                  <h2 className="text-brand-primary text-xl font-semibold text-center mb-6">{t("auth.login")}</h2>

                  {/* Username field */}
                  <div className="mb-4">
                    <label htmlFor="login-username" className="text-sm text-brand-primary mb-1.5">
                      {t("auth.username")}
                    </label>
                    <input
                      id="login-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t("auth.usernamePlaceholder")}
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoComplete="username"
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-brand-primary bg-brand-surface"
                      aria-label={t("auth.username")}
                    />
                  </div>

                  {/* Password field */}
                  <div className="mb-4">
                    <label htmlFor="login-password" className="text-sm text-brand-primary mb-1.5">
                      {t("auth.password")}
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                        placeholder={t("auth.passwordPlaceholder")}
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-brand-primary bg-brand-surface"
                        aria-label={t("auth.password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 p-1"
                        aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                      >
                        <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.neutral[500]} />
                      </button>
                    </div>
                  </div>

                  {/* Remember Me + Forgot Password */}
                  <div className="flex-row items-center justify-between mb-5">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className="flex-row items-center"
                      role="checkbox"
                      aria-checked={rememberMe}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 items-center justify-center mr-2 ${
                          rememberMe ? "bg-brand-accent border-brand-accent" : "border-gray-300 bg-brand-surface"
                        }`}
                      >
                        {rememberMe && <Icon name="checkmark" size={14} color={colors.brand.surface} />}
                      </div>
                      <span className="text-sm text-brand-primary">{t("auth.rememberMe")}</span>
                    </button>

                    <button type="button" onClick={handleForgotPassword} className="active:opacity-80">
                      <span className="text-sm text-brand-accent font-medium">{t("auth.forgotPassword")}</span>
                    </button>
                  </div>

                  {/* Error message */}
                  <LoginErrorBanner message={error} className="mb-4" />

                  {/* Sign In button */}
                  <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className={`w-full bg-brand-accent rounded-xl py-3.5 items-center active:opacity-80 ${isLoading ? "opacity-60" : ""}`}
                    aria-label={t("auth.login")}
                  >
                    {isLoading ? <Spinner size="small" tone="onDark" /> : <span className="text-white font-semibold text-base">{t("auth.signInButton")}</span>}
                  </button>

                  {/* Biometric login — only for returning users who enabled it */}
                  {hasBiometrics && biometricEnabled && (
                    <>
                      <div className="flex-row items-center my-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="px-3 text-sm text-gray-500">{t("auth.orSignInWith")}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <button
                        type="button"
                        onClick={handleBiometric}
                        disabled={isLoading}
                        className="w-full flex-row items-center justify-center border-2 border-brand-accent rounded-xl py-3 active:opacity-80"
                        aria-label={t("auth.signInWithBiometric", { biometricLabel })}
                      >
                        <Icon name="scan-outline" size={22} color={colors.brand.accent} />
                        <span className="text-brand-accent font-semibold text-base ml-2.5">{isLoading ? t("auth.authenticating") : biometricLabel}</span>
                      </button>
                    </>
                  )}

                  {/* Help links */}
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <button type="button" onClick={handleNeedHelp} className="py-2 items-center active:opacity-80">
                      <span className="text-sm text-brand-accent">{t("auth.needHelp")}</span>
                    </button>
                    <button type="button" onClick={handleRegister} className="py-2 items-center active:opacity-80">
                      <span className="text-sm text-brand-accent">{t("auth.registerAccount")}</span>
                    </button>
                  </div>
                </>
              )}

              {/* ===== STEP: MFA FACTOR SELECT ===== */}
              {loginStep === "mfa-select" && (
                <>
                  <button type="button" onClick={handleBackToCredentials} className="mb-4 self-start" aria-label={t("common.back")}>
                    <Icon name="arrow-back" size={24} color={colors.brand.primary} />
                  </button>

                  <h2 className="text-brand-primary text-lg font-semibold text-center mb-2">{t("auth.mfaVerifyTitle")}</h2>
                  <p className="text-brand-secondary text-sm text-center mb-6">{t("auth.mfaChooseMethod")}</p>

                  {mfaFactors.map((factor) => (
                    <button
                      type="button"
                      key={factor.id}
                      onClick={() => handleSelectFactor(factor)}
                      disabled={isLoading}
                      className="flex-row items-center p-4 mb-3 border border-gray-200 rounded-xl active:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 items-center justify-center mr-3">
                        <Icon name={getFactorIcon(factor)} size={20} color={colors.brand.accent} />
                      </div>
                      <span className="text-brand-primary font-medium flex-1">{getFactorLabel(factor)}</span>
                      <Icon name="chevron-forward" size={18} color={colors.neutral[500]} />
                    </button>
                  ))}

                  <LoginErrorBanner message={error} className="mt-2" />
                </>
              )}

              {/* ===== STEP: MFA CODE INPUT (SMS/TOTP/Email) ===== */}
              {loginStep === "mfa-code" && (
                <>
                  <button type="button" onClick={handleBackToCredentials} className="mb-4 self-start" aria-label={t("common.back")}>
                    <Icon name="arrow-back" size={24} color={colors.brand.primary} />
                  </button>

                  <h2 className="text-brand-primary text-lg font-semibold text-center mb-2">{t("auth.mfaEnterCode")}</h2>
                  <p className="text-brand-secondary text-sm text-center mb-6">
                    {selectedFactor?.factorType === "sms"
                      ? t("auth.mfaCodeSentToPhone", { phoneNumber: selectedFactor?.profile?.phoneNumber ?? "your phone" })
                      : t("auth.mfaCodeFromApp")}
                  </p>

                  <input
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                    placeholder={t("auth.mfaCodePlaceholder")}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-brand-primary bg-brand-surface text-center text-lg tracking-widest mb-4"
                    maxLength={6}
                  />

                  <LoginErrorBanner message={error} className="mb-4" />

                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading || mfaCode.length < 4}
                    className={`w-full bg-brand-accent rounded-xl py-3.5 items-center active:opacity-80 ${
                      isLoading || mfaCode.length < 4 ? "opacity-60" : ""
                    }`}
                  >
                    {isLoading ? <Spinner size="small" tone="onDark" /> : <span className="text-white font-semibold text-base">{t("auth.mfaVerifyButton")}</span>}
                  </button>
                </>
              )}

              {/* ===== STEP: MFA PUSH WAITING ===== */}
              {loginStep === "mfa-push" && (
                <>
                  <button type="button" onClick={handleBackToCredentials} className="mb-4 self-start" aria-label={t("common.back")}>
                    <Icon name="arrow-back" size={24} color={colors.brand.primary} />
                  </button>

                  <div className="items-center py-8">
                    <div className="w-16 h-16 rounded-full bg-brand-accent/10 items-center justify-center mb-4">
                      <Icon name="phone-portrait-outline" size={32} color={colors.brand.accent} />
                    </div>
                    <p className="text-brand-primary text-lg font-semibold mb-2">{t("auth.mfaCheckDevice")}</p>
                    <p className="text-brand-secondary text-sm text-center mb-6" style={{ whiteSpace: "pre-line" }}>
                      {t("auth.mfaPushMessage")}
                    </p>
                    <Spinner size="large" />
                  </div>

                  <LoginErrorBanner message={error} />
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="items-center pb-4 px-6">
            <button type="button" onClick={toggleLanguage} className="flex-row items-center py-2 active:opacity-80" aria-label={t("auth.toggleLanguage")}>
              <Icon name="globe-outline" size={16} color={colors.brand.secondary} />
              <span className="text-brand-secondary text-sm ml-1.5 font-medium">{language === "en" ? "EN" : "ES"}</span>
              <span className="text-brand-secondary/40 text-sm mx-1.5">|</span>
              <span className="text-brand-secondary/60 text-sm">{language === "en" ? "ES" : "EN"}</span>
            </button>

            <p className="text-brand-secondary/40 text-xs mt-1">v{APP_VERSION}</p>
            <p className="text-brand-secondary/40 text-xs mt-1 text-center">{t("auth.copyright")}</p>
          </div>
        </div>
      </div>
    </KeyboardAvoidingScreen>
  );
}
