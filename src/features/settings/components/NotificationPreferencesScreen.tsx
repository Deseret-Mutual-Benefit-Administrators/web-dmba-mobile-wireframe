import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { LoadingSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Label } from "@/src/shared/components/Typography";
import { ToggleRow } from "@/src/shared/components/ToggleRow";
import type { NotificationPreferences, NotificationPreferenceKey, NotificationCategory } from "../types";

const CATEGORIES: NotificationCategory[] = [
  { key: "eobNotifications", labelKey: "settings.notifications.categories.eob.label", descriptionKey: "settings.notifications.categories.eob.description" },
  { key: "wellnessReminders", labelKey: "settings.notifications.categories.wellness.label", descriptionKey: "settings.notifications.categories.wellness.description" },
  { key: "productInfo", labelKey: "settings.notifications.categories.productInfo.label", descriptionKey: "settings.notifications.categories.productInfo.description" },
  { key: "benefitsUpdates", labelKey: "settings.notifications.categories.benefitsUpdates.label", descriptionKey: "settings.notifications.categories.benefitsUpdates.description" },
  { key: "claimsStatusChanges", labelKey: "settings.notifications.categories.claimsStatus.label", descriptionKey: "settings.notifications.categories.claimsStatus.description" },
  { key: "policyChanges", labelKey: "settings.notifications.categories.policyChanges.label", descriptionKey: "settings.notifications.categories.policyChanges.description" },
  { key: "paymentReminders", labelKey: "settings.notifications.categories.paymentReminders.label", descriptionKey: "settings.notifications.categories.paymentReminders.description" },
  { key: "preventiveCareReminders", labelKey: "settings.notifications.categories.preventiveCare.label", descriptionKey: "settings.notifications.categories.preventiveCare.description" },
  { key: "prescriptionRefillReminders", labelKey: "settings.notifications.categories.prescriptionRefill.label", descriptionKey: "settings.notifications.categories.prescriptionRefill.description" },
  { key: "promotionalCommunications", labelKey: "settings.notifications.categories.promotional.label", descriptionKey: "settings.notifications.categories.promotional.description" },
];

interface NotificationPreferencesScreenProps {
  preferences: NotificationPreferences;
  isLoading: boolean;
  onToggle: (key: NotificationPreferenceKey) => void;
  onBack: () => void;
}

export function NotificationPreferencesScreen({
  preferences,
  isLoading,
  onToggle,
  onBack,
}: NotificationPreferencesScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={t("settings.notifications.title")} onBack={onBack} />

      <ScreenScrollView padded={false} bottomExtra={8}>
        {/* Subtitle */}
        <div className="px-4 pt-4 pb-2">
          <Label>{t("settings.notifications.subtitle")}</Label>
        </div>

        {/* Skeletons while the query is in flight, never live switches over defaults. */}
        {isLoading ? (
          <div className="bg-brand-surface rounded-2xl shadow-sm mx-4 mb-4 overflow-hidden">
            {CATEGORIES.map((category, index) => (
              <div
                key={category.key}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  index > 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <div className="flex-1 pr-3">
                  <LoadingSkeleton width="60%" height={14} borderRadius={4} />
                  <div className="mt-1.5">
                    <LoadingSkeleton width="85%" height={11} borderRadius={4} />
                  </div>
                </div>
                <LoadingSkeleton width={48} height={28} borderRadius={14} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-brand-surface rounded-2xl shadow-sm mx-4 mb-4 overflow-hidden">
            {CATEGORIES.map((category, index) => (
              <ToggleRow
                key={category.key}
                label={t(category.labelKey)}
                description={t(category.descriptionKey)}
                value={preferences[category.key]}
                onValueChange={() => onToggle(category.key)}
                divider={index > 0}
              />
            ))}
          </div>
        )}

        {/* Info note */}
        <div className="mx-4 mb-6 bg-info-tint rounded-xl p-4 flex-row items-start">
          <Icon name="information-circle-outline" size={18} color={colors.brand.accent} />
          <span className="text-xs text-brand-secondary ml-2 flex-1">
            {t("settings.notifications.requiredNote")}
          </span>
        </div>
      </ScreenScrollView>
    </div>
  );
}
