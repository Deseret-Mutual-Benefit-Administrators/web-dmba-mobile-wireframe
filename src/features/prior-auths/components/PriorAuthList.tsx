/**
 * Prior Auth list — cards with loading, error, empty, and a client-side
 * family-member filter on `auth.memberId`. `?state=loading|empty|error`.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { PriorAuthCard } from "./PriorAuthCard";
import { LoadingSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { Button } from "@/src/shared/components/Button";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { FamilyMemberDropdown } from "@/src/features/claims/components/FamilyMemberDropdown";
import { placeholderFamilyMembers, placeholderUser } from "@/src/features/claims/placeholder";
import { usePlaceholderState } from "@/src/features/claims/hooks/usePlaceholderState";
import { colors } from "@/src/shared/theme/colors";
import { placeholderPriorAuthDetails } from "../placeholder";

export function PriorAuthList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const state = usePlaceholderState();
  const isLoading = state === "loading";
  const isError = state === "error";
  const auths = state === "empty" ? [] : placeholderPriorAuthDetails;
  const refetch = () => {};
  const familyMembers = placeholderFamilyMembers;
  const user = placeholderUser;
  const selfName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || t("dashboard.self");

  // Default to "family" — the aggregated household view.
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>("family");

  const filteredAuths = useMemo(() => {
    if (!auths) return [];
    if (selectedMemberId === "family") return auths;
    const targetMemberId = selectedMemberId ?? user?.memberId;
    if (!targetMemberId) return auths;
    return auths.filter((a) => a.memberId === targetMemberId);
  }, [auths, selectedMemberId, user?.memberId]);

  const handleCardPress = (authId: string) => {
    navigate(`/prior-auth/${authId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-background px-4 pt-4">
        <LoadingSkeleton width="100%" height={120} borderRadius={16} className="mb-3" />
        <LoadingSkeleton width="100%" height={120} borderRadius={16} className="mb-3" />
        <LoadingSkeleton width="100%" height={120} borderRadius={16} className="mb-3" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background px-6">
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <span className="text-base text-center mt-3 mb-4" style={{ color: colors.error }}>
          {t("priorAuth.loadError")}
        </span>
        <Button label={t("common.retry")} onPress={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-background min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 24 }}>
          {familyMembers.length > 0 ? (
            <div className="px-4 pt-4 pb-1">
              <FamilyMemberDropdown
                familyMembers={familyMembers}
                selectedMemberId={selectedMemberId}
                onSelect={setSelectedMemberId}
                selfName={selfName}
              />
            </div>
          ) : null}

          {filteredAuths.map((item) => (
            <PriorAuthCard key={item.id} auth={item} onPress={handleCardPress} />
          ))}

          {filteredAuths.length === 0 && (
            <EmptyState
              icon={<Icon name="shield-checkmark-outline" size={48} color={colors.neutral[500]} />}
              title={t("priorAuth.noPriorAuths")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
