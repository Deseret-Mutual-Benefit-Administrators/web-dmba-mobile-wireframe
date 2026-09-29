import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Eyebrow } from "@/src/shared/components/Typography";
import { IconChip } from "@/src/shared/components/IconChip";

interface PrivacySecurityScreenProps {
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  biometricType: string;
  onToggleBiometric: () => void;
  onChangePassword: () => void;
  /** Is this device registered as the approval factor for a dmba.com sign-in (ADR-195). */
  signInVerificationOn: boolean;
  onSignInVerification: () => void;
  onSimulateSignInRequest?: () => void;
  onBack: () => void;
}

/**
 * Wireframe: the four legal rows open external documents in the app. They are
 * inert here (no DMBA URLs in the wireframe).
 */
function openExternalDocument() {
  // intentionally inert
}

export function PrivacySecurityScreen({
  biometricEnabled,
  biometricAvailable,
  biometricType,
  onToggleBiometric,
  onChangePassword,
  signInVerificationOn,
  onSignInVerification,
  onSimulateSignInRequest,
  onBack,
}: PrivacySecurityScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={t("settings.privacy.title")} onBack={onBack} />

      <ScreenScrollView padded={false} bottomExtra={8}>
        {/* Security section */}
        <div className="px-4 pt-4 pb-1">
          <Eyebrow>{t("settings.privacy.securitySection")}</Eyebrow>
        </div>

        <div className="bg-brand-surface rounded-2xl shadow-sm mx-4 mb-4 overflow-hidden">
          {/* Biometric toggle */}
          <div className={`flex-row items-center px-4 py-3 ${!biometricAvailable ? "opacity-50" : ""}`}>
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="finger-print" size={20} color={colors.brand.accent} />} />
            </div>
            <div className="flex-1 pr-3">
              <span className="text-sm font-medium text-brand-primary">
                {biometricType || t("settings.privacy.biometric")}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {biometricAvailable
                  ? t("settings.privacy.biometricDesc")
                  : t("settings.privacy.biometricNotAvailable")}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={biometricEnabled}
              aria-label={biometricType || t("settings.privacy.biometric")}
              disabled={!biometricAvailable}
              onClick={onToggleBiometric}
              style={{
                width: 51,
                height: 31,
                borderRadius: 999,
                backgroundColor: biometricEnabled ? colors.brand.accent : colors.border,
                transition: "background-color 150ms",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: biometricEnabled ? 22 : 2,
                  width: 27,
                  height: 27,
                  borderRadius: 999,
                  backgroundColor: colors.brand.surface,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "left 150ms",
                }}
              />
            </button>
          </div>

          {/* Sign-in verification — this phone as the approval factor for dmba.com (ADR-195) */}
          <button
            type="button"
            onClick={onSignInVerification}
            className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
            aria-label={t("settings.privacy.signInVerification")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="shield-checkmark-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <div className="flex-1 items-start">
              <span className="text-sm font-medium text-brand-primary">
                {t("settings.privacy.signInVerification")}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {signInVerificationOn
                  ? t("settings.privacy.signInVerificationOn")
                  : t("settings.privacy.signInVerificationOff")}
              </span>
            </div>
            <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
          </button>

          {/* Change password */}
          <button
            type="button"
            onClick={onChangePassword}
            className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
            aria-label={t("settings.privacy.changePassword")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="key-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <div className="flex-1 items-start">
              <span className="text-sm font-medium text-brand-primary">
                {t("settings.privacy.changePassword")}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {t("settings.privacy.changePasswordDesc")}
              </span>
            </div>
            <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
          </button>

          {onSimulateSignInRequest ? (
            <button
              type="button"
              onClick={onSimulateSignInRequest}
              className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
              aria-label={t("settings.privacy.simulateSignInRequest")}
            >
              <div className="mr-3">
                <IconChip size="sm" tone="neutral" icon={<Icon name="flask-outline" size={20} color={colors.brand.secondary} />} />
              </div>
              <span className="flex-1 text-sm font-medium text-brand-primary text-left">
                {t("settings.privacy.simulateSignInRequest")}
              </span>
            </button>
          ) : null}
        </div>

        {/* Legal section */}
        <div className="px-4 pb-1">
          <Eyebrow>{t("settings.privacy.legalSection")}</Eyebrow>
        </div>

        <div className="bg-brand-surface rounded-2xl shadow-sm mx-4 mb-4 overflow-hidden">
          <button
            type="button"
            onClick={openExternalDocument}
            className="flex-row items-center px-4 py-3 active:opacity-80"
            aria-label={t("settings.privacy.hipaaNotice")}
            aria-description={t("common.hints.opensBrowser")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="shield-checkmark-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <span className="flex-1 text-sm font-medium text-brand-primary text-left">
              {t("settings.privacy.hipaaNotice")}
            </span>
            <Icon name="open-outline" size={16} color={colors.brand.secondary} />
          </button>

          <button
            type="button"
            onClick={openExternalDocument}
            className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
            aria-label={t("settings.privacy.financialPrivacy")}
            aria-description={t("common.hints.opensBrowser")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="card-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <span className="flex-1 text-sm font-medium text-brand-primary text-left">
              {t("settings.privacy.financialPrivacy")}
            </span>
            <Icon name="open-outline" size={16} color={colors.brand.secondary} />
          </button>

          <button
            type="button"
            onClick={openExternalDocument}
            className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
            aria-label={t("settings.privacy.legalStatement")}
            aria-description={t("common.hints.opensBrowser")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="document-text-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <span className="flex-1 text-sm font-medium text-brand-primary text-left">
              {t("settings.privacy.legalStatement")}
            </span>
            <Icon name="open-outline" size={16} color={colors.brand.secondary} />
          </button>

          <button
            type="button"
            onClick={openExternalDocument}
            className="flex-row items-center px-4 py-3 border-t border-gray-100 active:opacity-80"
            aria-label={t("settings.privacy.otherNotices")}
            aria-description={t("common.hints.opensBrowser")}
          >
            <div className="mr-3">
              <IconChip size="sm" tone="info" icon={<Icon name="information-circle-outline" size={20} color={colors.brand.accent} />} />
            </div>
            <span className="flex-1 text-sm font-medium text-brand-primary text-left">
              {t("settings.privacy.otherNotices")}
            </span>
            <Icon name="open-outline" size={16} color={colors.brand.secondary} />
          </button>
        </div>
      </ScreenScrollView>
    </div>
  );
}
