import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { DocumentCard } from "@/src/features/documents/components/DocumentCard";
import { placeholderDocuments } from "@/src/features/documents/placeholder";
import { LoadingSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { CollapsibleSection } from "@/src/shared/components/CollapsibleSection";
import { InfoRow } from "@/src/shared/components/InfoRow";
import { Card } from "@/src/shared/components/Card";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Caption } from "@/src/shared/components/Typography";
import { Button } from "@/src/shared/components/Button";
import { useToast } from "@/src/shared/components/Toast";
import { DisclaimerCard } from "@/src/shared/components/DisclaimerCard";
import {
  placeholderAppVersion,
  placeholderFamilyMembers,
  placeholderMedicineCabinet,
  placeholderUser,
} from "../placeholder";
import type { MedicineCabinetItem, UserProfile } from "../placeholder";
import { useScreenState } from "../useScreenState";

type SubTab = "account" | "medicine-cabinet" | "settings";
type TFn = (key: string, params?: Record<string, string | number>) => string;

/** Stand-in for useFamilyPermissionsQuery().data?.viewerRole — `?view=dependent` flips it. */
function useViewerRole(): "contractHolder" | "dependent" {
  const [params] = useSearchParams();
  return params.get("view") === "dependent" ? "dependent" : "contractHolder";
}

/**
 * Profile screen with 3-tab sub-navigation matching the Figma design:
 * Account -- member info, coverage status, ID card access
 * Medicine Cabinet -- medications
 * Settings -- language toggle, documents & forms, preferences, logout
 *
 * Wireframe query params: `?tab=account|medicine-cabinet|settings`,
 * `?state=loading|empty`, `?view=dependent`.
 */
export function ProfileRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = placeholderUser;
  const logout = () => navigate("/login");
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: SubTab =
    tabParam === "medicine-cabinet" || tabParam === "settings" ? tabParam : "account";
  const [activeTab, setActiveTab] = useState<SubTab>(initialTab);

  useEffect(() => {
    if (tabParam === "medicine-cabinet" || tabParam === "settings" || tabParam === "account") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const tabs: { key: SubTab; label: string }[] = [
    { key: "account", label: t("profile.subTabs.account") },
    { key: "medicine-cabinet", label: t("profile.subTabs.medicineCabinet") },
    { key: "settings", label: t("profile.subTabs.settings") },
  ];

  return (
    <div className="flex-1 bg-brand-background">
      {/* Sub-navigation tabs */}
      <div className="flex-row bg-brand-surface border-b border-gray-200" role="tablist">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 items-center py-3"
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-label={tab.label}
          >
            <span
              className={`text-sm ${
                activeTab === tab.key ? "text-brand-accent font-semibold" : "text-gray-500"
              }`}
            >
              {tab.label}
            </span>
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "account" && <AccountTab user={user} t={t} />}
      {activeTab === "medicine-cabinet" && <MedicineCabinetTab />}
      {activeTab === "settings" && <SettingsTab t={t} logout={logout} />}
    </div>
  );
}

// --- Account Tab ---

function AccountTab({ user, t }: { user: UserProfile | null; t: TFn }) {
  const navigate = useNavigate();
  const screenState = useScreenState();
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(false);
  const [dependentsOpen, setDependentsOpen] = useState(false);

  const familyMembers = screenState === "empty" ? [] : placeholderFamilyMembers;
  const hasDependents = familyMembers != null && familyMembers.length > 0;

  const isContractHolder = useViewerRole() === "contractHolder";

  return (
    <ScreenScrollView className="pt-4" bottomExtra={8}>
      {/* Access ID Card button */}
      <button
        type="button"
        onClick={() => navigate("/id-card")}
        className="bg-brand-surface rounded-2xl p-4 shadow-sm mb-3 flex-row items-center active:opacity-80 text-left"
        aria-label={t("profile.accessIdCard")}
      >
        <div className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
          <Icon name="card-outline" size={24} color={colors.brand.accent} />
        </div>
        <div className="flex-1">
          <span className="text-brand-primary font-semibold text-base">{t("profile.accessIdCard")}</span>
          <span className="text-gray-500 text-xs mt-0.5">{t("profile.idCardSubLabel")}</span>
        </div>
        <Icon name="chevron-forward" size={20} color={colors.brand.secondary} />
      </button>

      {/* Coverage status badge */}
      <Card className="mb-3">
        <div className="flex-row items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">{t("profile.coverageStatus")}</span>
            <span className="text-brand-primary font-semibold mt-0.5">
              {t("profile.memberId")}: {user?.memberId ?? "—"}
            </span>
          </div>
          <div className="bg-green-100 rounded-full px-3 py-1">
            <span className="text-green-700 text-xs font-semibold">{t("profile.active")}</span>
          </div>
        </div>
      </Card>

      {/* Collapsible Personal Information */}
      <CollapsibleSection
        icon="person-outline"
        title={t("profile.personalInfo")}
        subtitle={t("profile.personalInfoDesc")}
        isOpen={personalInfoOpen}
        onToggle={() => setPersonalInfoOpen((prev) => !prev)}
      >
        <InfoRow icon="calendar-outline" label={t("profile.dateOfBirth")} value={user?.dateOfBirth ?? "—"} />
        <InfoRow icon="document-text-outline" label={t("idCard.plan")} value={user?.planName ?? "—"} />
        <InfoRow icon="people-outline" label={t("idCard.groupNumber")} value={user?.groupNumber ?? "—"} />
        <InfoRow icon="checkmark-circle-outline" label={t("idCard.effectiveDate")} value={user?.effectiveDate ?? "—"} />
      </CollapsibleSection>

      {/* Collapsible Contact Information */}
      <CollapsibleSection
        icon="call-outline"
        title={t("profile.contactInfo")}
        subtitle={t("profile.contactInfoDesc")}
        isOpen={contactInfoOpen}
        onToggle={() => setContactInfoOpen((prev) => !prev)}
      >
        <InfoRow icon="mail-outline" label={t("profile.emailAddress")} value={user?.email ?? "—"} />
        <InfoRow icon="call-outline" label={t("profile.phoneNumber")} value={user?.phone ?? "—"} />
        <InfoRow icon="home-outline" label={t("profile.mailingAddress")} value={user?.mailingAddress ?? "—"} />
        {/* The address is the employer's record, not something the app can edit (ADR-198). */}
        <DisclaimerCard textKey="profile.addressNote" />
      </CollapsibleSection>

      {/* Collapsible Dependents — hidden when member has no dependents */}
      {hasDependents && (
        <CollapsibleSection
          icon="people-outline"
          title={t("profile.dependents")}
          subtitle={t("profile.familyMemberCount", { count: familyMembers.length })}
          isOpen={dependentsOpen}
          onToggle={() => setDependentsOpen((prev) => !prev)}
        >
          {familyMembers.map((member) => (
            <InfoRow
              key={member.memberId}
              icon="person-outline"
              label={member.relationship}
              value={`${member.firstName} ${member.lastName}`}
            />
          ))}
          {isContractHolder && (
            <button
              type="button"
              onClick={() => navigate("/settings/family-permissions")}
              className="flex-row items-center justify-between py-3 border-t border-gray-100 active:opacity-80"
              aria-label={t("profile.managePermissions")}
            >
              <span className="text-sm text-brand-accent font-medium">{t("profile.managePermissions")}</span>
              <Icon name="chevron-forward" size={18} color={colors.brand.accent} />
            </button>
          )}
        </CollapsibleSection>
      )}
    </ScreenScrollView>
  );
}

// --- Medicine Cabinet Tab ---

function MedicineCabinetTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const screenState = useScreenState();
  const isLoading = screenState === "loading";
  const [items, setItems] = useState<MedicineCabinetItem[]>(
    screenState === "empty" ? [] : placeholderMedicineCabinet
  );

  const handleRemove = (medicationId: string) => {
    if (screenState === "error") {
      toast.show(t("common.error"), { tone: "error" });
      return;
    }
    setItems((prev) => prev.filter((item) => item.medicationId !== medicationId));
  };

  if (isLoading) {
    return (
      <div className="flex-1 px-4 pt-4">
        <LoadingSkeleton width="100%" height={80} borderRadius={16} className="mb-3" />
        <LoadingSkeleton width="100%" height={80} borderRadius={16} className="mb-3" />
        <LoadingSkeleton width="100%" height={80} borderRadius={16} />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex-1 justify-center">
        <EmptyState
          icon={
            <div className="w-16 h-16 rounded-full bg-teal-100 items-center justify-center">
              <Icon name="medkit-outline" size={32} color={colors.medication} />
            </div>
          }
          title={t("search.medicineCabinet.title")}
          message={t("search.medicineCabinet.empty")}
        />
      </div>
    );
  }

  return (
    <ScreenScrollView className="pt-4" bottomExtra={8}>
      {items.map((item) => (
        <Card key={item.medicationId} className="border border-gray-100 mb-3">
          {/* The whole row opens medication detail; Remove sits outside this pressable. */}
          <button
            type="button"
            onClick={() => navigate(`/medication/${encodeURIComponent(item.genericName ?? item.drugName)}`)}
            className="active:opacity-80 text-left"
            aria-label={item.drugName}
            aria-description={t("search.medicineCabinet.openHint")}
          >
            <div className="flex-row items-start justify-between">
              <div className="flex-1">
                <span className="text-base font-semibold text-brand-primary">{item.drugName}</span>
                {item.genericName && item.genericName !== item.drugName && (
                  <span className="text-sm text-gray-500 mt-0.5">{item.genericName}</span>
                )}
              </div>
              <div className={`px-2 py-0.5 rounded-full ${item.source === "RxHistory" ? "bg-blue-50" : "bg-teal-50"}`}>
                <span className={`text-xs font-medium ${item.source === "RxHistory" ? "text-blue-700" : "text-teal-700"}`}>
                  {item.source === "RxHistory"
                    ? t("search.medicineCabinet.rxBadge")
                    : t("search.medicineCabinet.manuallyAdded")}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100">
              <Caption>
                {item.source === "RxHistory"
                  ? t("search.medicineCabinet.rxHistory", { date: new Date(item.addedAt).toLocaleDateString() })
                  : `${t("search.medicineCabinet.manuallyAdded")} ${new Date(item.addedAt).toLocaleDateString()}`}
              </Caption>
            </div>
          </button>

          {/* Only a manually added medicine can be removed. */}
          {item.source === "ManualAdd" && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex-row justify-end">
              <Button
                variant="secondary"
                size="sm"
                label={t("search.medicineCabinet.remove")}
                onPress={() => handleRemove(item.medicationId)}
                accessibilityLabel={t("search.medicineCabinet.removeFromCabinet")}
              />
            </div>
          )}
        </Card>
      ))}
    </ScreenScrollView>
  );
}

// --- Settings Tab ---

function SettingsTab({ t, logout }: { t: TFn; logout: () => void }) {
  const navigate = useNavigate();
  const screenState = useScreenState();
  // The wireframe ships English only; the toggle still switches its highlight.
  const [currentLang, setLanguage] = useState<"en" | "es">("en");
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const documentsQuery = {
    isLoading: screenState === "loading",
    data: screenState === "loading" ? undefined : screenState === "empty" ? { documents: [] } : placeholderDocuments,
  };

  const familyPermissionsLabel =
    useViewerRole() === "dependent" ? t("profile.whoCanSeeYourInfo") : t("profile.familyPermissions");

  return (
    <ScreenScrollView className="pt-4" bottomExtra={8}>
      {/* Language toggle */}
      <Card className="mb-3">
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center">
            <div className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center mr-3">
              <Icon name="globe-outline" size={20} color={colors.medication} />
            </div>
            <span className="text-brand-primary">{t("profile.language")}</span>
          </div>
          <div className="flex-row bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-4 py-1.5 rounded-full ${currentLang === "en" ? "bg-brand-accent" : ""}`}
              aria-label={t("profile.english")}
              aria-pressed={currentLang === "en"}
            >
              <span className={`text-sm ${currentLang === "en" ? "text-white font-semibold" : "text-gray-600"}`}>
                {t("profile.english")}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage("es")}
              className={`px-4 py-1.5 rounded-full ${currentLang === "es" ? "bg-brand-accent" : ""}`}
              aria-label={t("profile.spanish")}
              aria-pressed={currentLang === "es"}
            >
              <span className={`text-sm ${currentLang === "es" ? "text-white font-semibold" : "text-gray-600"}`}>
                {t("profile.spanish")}
              </span>
            </button>
          </div>
        </div>
      </Card>

      {/* Collapsible Documents & Forms */}
      <CollapsibleSection
        icon="document-outline"
        title={t("profile.documentsAndForms")}
        subtitle={t("profile.documentsDesc")}
        isOpen={documentsOpen}
        onToggle={() => setDocumentsOpen((prev) => !prev)}
      >
        {documentsQuery.isLoading && (
          <>
            <LoadingSkeleton width="100%" height={60} borderRadius={12} className="mb-2" />
            <LoadingSkeleton width="100%" height={60} borderRadius={12} />
          </>
        )}
        {documentsQuery.data?.documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
        {!documentsQuery.isLoading && !documentsQuery.data?.documents.length && (
          <span className="text-sm text-gray-500 text-center py-3">{t("benefits.documents.noDocuments")}</span>
        )}
      </CollapsibleSection>

      {/* Collapsible Preferences */}
      <CollapsibleSection
        icon="settings-outline"
        title={t("profile.preferencesSettings")}
        subtitle={t("profile.preferencesDesc")}
        isOpen={preferencesOpen}
        onToggle={() => setPreferencesOpen((prev) => !prev)}
      >
        <PreferenceRow icon="notifications-outline" label={t("profile.notifications")} onPress={() => navigate("/settings/notifications")} />
        <PreferenceRow icon="people-outline" label={familyPermissionsLabel} onPress={() => navigate("/settings/family-permissions")} />
        <PreferenceRow icon="lock-closed-outline" label={t("profile.privacySecurity")} onPress={() => navigate("/settings/privacy")} />
        <PreferenceRow icon="help-circle-outline" label={t("profile.helpSupport")} onPress={() => navigate("/settings/help")} />
      </CollapsibleSection>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="bg-brand-surface border-2 border-red-200 rounded-2xl p-4 flex-row items-center justify-center active:opacity-80 mb-4"
        aria-label={t("auth.logout")}
        aria-description={t("common.hints.signsOut")}
      >
        <Icon name="log-out-outline" size={20} color={colors.error} />
        <span className="text-error font-semibold ml-2">{t("auth.logout")}</span>
      </button>

      {/* App version */}
      <div className="items-center py-4">
        <Caption>{t("profile.appName")}</Caption>
        <Caption className="mt-1">
          {t("profile.appVersion")} {placeholderAppVersion}
        </Caption>
      </div>
    </ScreenScrollView>
  );
}

/**
 * The source repeats this Pressable inline four times with identical classes;
 * factored here only to keep the port short. Classes are the source's.
 */
function PreferenceRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex-row items-center justify-between py-3 border-t border-gray-100 active:opacity-80"
      aria-label={label}
    >
      <div className="flex-row items-center flex-1">
        <Icon name={icon} size={20} color={colors.brand.secondary} />
        <span className="text-sm text-brand-primary ml-3">{label}</span>
      </div>
      <Icon name="chevron-forward" size={18} color={colors.brand.secondary} />
    </button>
  );
}
