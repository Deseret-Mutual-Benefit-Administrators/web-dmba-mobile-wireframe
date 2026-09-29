import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { LoadingSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Badge } from "@/src/shared/components/Badge";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { SectionTitle, Caption } from "@/src/shared/components/Typography";
import { ToggleRow } from "@/src/shared/components/ToggleRow";
import { useToast } from "@/src/shared/components/Toast";
import { colors } from "@/src/shared/theme/colors";
import { useFamilyPermissions, useFamilyPermissionToggle } from "../useFamilyPermissions";
import {
  availableSectionsInGroup,
  formatDateOnly,
  relationshipLabelKey,
  sectionDefinition,
} from "../services/familyPermissions";
import type {
  FamilyPermissionGrant,
  FamilyPermissionSection,
  HipaaAuthorizedViewer,
} from "../types";

/**
 * Family permissions screen. Two renders by `viewerRole`, per the plan:
 *
 * - **Contract holder**: one card per dependent, six toggle rows grouped
 *   Health / Financial, saved on each toggle (optimistic).
 * - **Dependent**: read-only "Who can see your information" — the sections
 *   granted to them by their holder, plus the HIPAA-authorized-viewers block.
 * - **Individual**: an empty state — there is no household to manage.
 */
export function FamilyPermissionsScreen() {
  const { t } = useTranslation();
  const { role, members, hipaaAuthorizedViewers, availableSections, isLoading, isError, refetch } =
    useFamilyPermissions();

  // A neutral title until `role` resolves — the holder-flavoured "Family
  // permissions" title used to show for every member during the load, then
  // flip to "Who can see your information" for a dependent once the response
  // landed, which read as the screen changing its mind about what it was.
  const title =
    role === null
      ? t("familyPermissions.neutralTitle")
      : role === "dependent"
      ? t("familyPermissions.whoCanSee")
      : t("familyPermissions.title");

  return (
    <div className="flex-1 bg-brand-background">
      <ScreenHeader title={title} />

      <ScreenScrollView padded={false} bottomExtra={8}>
        {isLoading ? (
          <LoadingRows />
        ) : isError ? (
          <div className="px-6 py-12">
            <InlineErrorState message={t("familyPermissions.loadError")} onRetry={refetch} />
          </div>
        ) : role === "contractHolder" ? (
          <HolderView members={members} availableSections={availableSections} />
        ) : role === "dependent" ? (
          <DependentView
            member={members[0] ?? null}
            hipaaAuthorizedViewers={hipaaAuthorizedViewers}
          />
        ) : (
          <div className="px-4 pt-8">
            <EmptyState
              icon={
                <Icon name="people-outline" size={40} color={colors.neutral[500]} />
              }
              title={t("familyPermissions.individual.title")}
              message={t("familyPermissions.individual.message")}
            />
          </div>
        )}
      </ScreenScrollView>
    </div>
  );
}

/** The raw server relationship string, translated when recognized — falls back to the raw value. */
function relationshipLabel(t: (key: string) => string, relationship: string): string {
  const key = relationshipLabelKey(relationship);
  return key ? t(key) : relationship;
}

// ---------------------------------------------------------------------------
// Contract holder — one card per dependent, toggles grouped Health / Financial
// ---------------------------------------------------------------------------

function HolderView({
  members,
  availableSections,
}: {
  members: FamilyPermissionGrant[];
  availableSections: FamilyPermissionSection[];
}) {
  const { t } = useTranslation();

  if (members.length === 0) {
    // Distinct from the individual-role empty state below: a holder with no
    // dependents still has a household (a policy that *can* cover more than
    // one person) — "no family to manage" reads as if the app got the
    // member's coverage wrong, when nothing here is unexpected.
    return (
      <div className="px-4 pt-8">
        <EmptyState
          icon={
            <Icon name="people-outline" size={40} color={colors.neutral[500]} />
          }
          title={t("familyPermissions.holderEmpty.title")}
          message={t("familyPermissions.holderEmpty.message")}
        />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      {members.map((member) => (
        <DependentCard key={member.memberId} member={member} availableSections={availableSections} />
      ))}
    </div>
  );
}

/**
 * One dependent's card. Owns its own `useFamilyPermissionToggle(member.memberId)`
 * instance — see that hook's doc comment for why saving is per-card rather than
 * centralized: it's what lets `useMutation`'s `scope` serialize this dependent's
 * rapid toggles without also queuing an unrelated dependent's behind them.
 */
function DependentCard({
  member,
  availableSections,
}: {
  member: FamilyPermissionGrant;
  availableSections: FamilyPermissionSection[];
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const { toggle } = useFamilyPermissionToggle(member.memberId);
  // Narrowed to what the server currently accepts — see `availableSectionsInGroup`'s
  // doc comment. `SECTIONS` (the label/description source) stays the single source
  // of truth for how each toggle reads; this only decides which ones render.
  const healthSections = availableSectionsInGroup("health", availableSections);
  const financialSections = availableSectionsInGroup("financial", availableSections);

  const handleToggle = (section: FamilyPermissionSection) => {
    toggle(section, {
      onError: () => toast.show(t("familyPermissions.toast.saveFailed"), { tone: "error" }),
    });
  };

  return (
    <div className="bg-brand-surface rounded-2xl shadow-sm mb-4 overflow-hidden">
      <div className="flex-row items-center px-4 pt-4 pb-2">
        <span className="text-base font-semibold text-brand-primary flex-1 mr-2">
          {member.firstName} {member.lastName}
        </span>
        <Badge label={relationshipLabel(t, member.relationship)} tone="neutral" />
      </div>

      {healthSections.length > 0 && (
        <>
          <div className="px-4 pb-1 pt-2">
            <SectionTitle>{t("familyPermissions.groups.health")}</SectionTitle>
          </div>
          {healthSections.map((section, index) => (
            <ToggleRow
              key={section.key}
              label={t(section.labelKey)}
              description={t(section.descriptionKey)}
              value={member.grantedSections.includes(section.key)}
              onValueChange={() => handleToggle(section.key)}
              accessibilityLabel={t("familyPermissions.sections.toggleLabel", {
                section: t(section.labelKey),
                name: `${member.firstName} ${member.lastName}`,
              })}
              divider={index > 0}
            />
          ))}
        </>
      )}

      {financialSections.length > 0 && (
        <div className="px-4 pb-1 pt-3">
          <SectionTitle>{t("familyPermissions.groups.financial")}</SectionTitle>
        </div>
      )}
      {financialSections.map((section, index) => (
        <ToggleRow
          key={section.key}
          label={t(section.labelKey)}
          description={t(section.descriptionKey)}
          value={member.grantedSections.includes(section.key)}
          onValueChange={() => handleToggle(section.key)}
          accessibilityLabel={t("familyPermissions.sections.toggleLabel", {
            section: t(section.labelKey),
            name: `${member.firstName} ${member.lastName}`,
          })}
          divider={index > 0}
        />
      ))}

      {member.lastUpdated && formatDateOnly(member.lastUpdated) !== "" && (
        <div className="px-4 pb-3 pt-1">
          <Caption>
            {t("familyPermissions.lastUpdated", { date: formatDateOnly(member.lastUpdated) })}
          </Caption>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dependent — read-only "who can see your information"
// ---------------------------------------------------------------------------

function DependentView({
  member,
  hipaaAuthorizedViewers,
}: {
  member: FamilyPermissionGrant | null;
  hipaaAuthorizedViewers: HipaaAuthorizedViewer[];
}) {
  const { t } = useTranslation();

  return (
    <div className="px-4 pt-4">
      <div className="bg-brand-surface rounded-2xl shadow-sm mb-4 px-4 py-2 overflow-hidden">
        <div className="pt-2 pb-1">
          <SectionTitle>{t("familyPermissions.whoCanSee")}</SectionTitle>
          {member?.grantedByName && (
            <Caption className="mt-1">
              {t("familyPermissions.grantedBy", { name: member.grantedByName })}
            </Caption>
          )}
        </div>

        {member && member.grantedSections.length > 0 ? (
          member.grantedSections.map((key) => {
            const definition = sectionDefinition(key);
            if (!definition) return null;
            return (
              <KeyValueRow
                key={key}
                label={t(definition.labelKey)}
                value={t("familyPermissions.granted")}
                divider
              />
            );
          })
        ) : (
          <div className="py-3">
            <span className="text-sm text-gray-500">{t("familyPermissions.noGrants")}</span>
          </div>
        )}
      </div>

      <div className="bg-brand-surface rounded-2xl shadow-sm mb-4 px-4 py-2 overflow-hidden">
        <div className="pt-2 pb-1">
          <SectionTitle>{t("familyPermissions.hipaa.title")}</SectionTitle>
        </div>

        {hipaaAuthorizedViewers.length > 0 ? (
          hipaaAuthorizedViewers.map((viewer) => {
            const formattedExpiry = formatDateOnly(viewer.expiryDate);
            return (
              <KeyValueRow
                key={viewer.memberId}
                label={`${viewer.firstName} ${viewer.lastName} (${relationshipLabel(
                  t,
                  viewer.relationship
                )})`}
                value={
                  formattedExpiry !== ""
                    ? t("familyPermissions.hipaa.expires", { date: formattedExpiry })
                    : t("familyPermissions.hipaa.onFile")
                }
                divider
              />
            );
          })
        ) : (
          <div className="py-3">
            <span className="text-sm text-gray-500">{t("familyPermissions.hipaa.none")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton — never live switches over defaults while the query is in
// flight (same reasoning as NotificationPreferencesScreen).
// ---------------------------------------------------------------------------

function LoadingRows() {
  return (
    <div className="px-4 pt-4">
      <div className="bg-brand-surface rounded-2xl shadow-sm mb-4 overflow-hidden">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
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
    </div>
  );
}
