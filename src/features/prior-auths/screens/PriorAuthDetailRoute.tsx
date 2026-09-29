/**
 * Port of `app/prior-auth/[id].tsx`. Ids: approved, denied, pending (In Progress),
 * submitted, closed. `?state=loading|error` reaches the other states.
 */
import { useParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Card } from "@/src/shared/components/Card";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { PriorAuthStatusBadge } from "../components/PriorAuthStatusBadge";
import { RequestInfoSection } from "../components/RequestInfoSection";
import { TimelineSection } from "../components/TimelineSection";
import { StatusPanel } from "../components/StatusPanel";
import { DeterminationLetterSection } from "../components/DeterminationLetterSection";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import { gradientCss } from "@/src/shared/theme/gradients";
import { usePlaceholderState } from "@/src/features/claims/hooks/usePlaceholderState";
import { placeholderPriorAuthDetail } from "../placeholder";

export function PriorAuthDetailRoute() {
  const { id = "" } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const state = usePlaceholderState();
  const isLoading = state === "loading";
  const isError = state === "error" || state === "empty";
  const auth = isLoading || isError ? null : placeholderPriorAuthDetail(id);
  const refetch = () => {};

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background h-full">
        <Spinner size="large" tone="accent" />
        <span className="mt-2 text-gray-500">{t("common.loading")}</span>
      </div>
    );
  }

  if (isError || !auth) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <ScreenHeader title={t("priorAuth.detailTitle")} />
        <div className="flex-1 items-center justify-center px-6">
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <span className="text-base text-center mt-3 mb-4" style={{ color: colors.error }}>
            {t("priorAuth.loadError")}
          </span>
          <Button label={t("common.retry")} onPress={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-background h-full min-h-0">
      <ScreenHeader title={t("priorAuth.detailTitle")} rightElement={<PriorAuthStatusBadge bucket={auth.statusBucket} />} />

      <ScreenScrollView bottomExtra={8} contentContainerStyle={{ paddingTop: 16 }}>
        {/* Member + Display ID header card */}
        <Card variant="translucent" className="mb-4">
          <span className="text-lg font-bold text-brand-primary mb-1">{auth.service}</span>

          {/* Member pill — gradient per Figma */}
          <div
            style={{
              background: gradientCss([withAlpha(colors.searchSlate.light, 0.2), withAlpha(colors.searchSlate.base, 0.2)], 90),
              alignSelf: "flex-start",
              borderRadius: 9999,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: withAlpha(colors.searchSlate.light, 0.3),
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 6,
              paddingBottom: 6,
              marginBottom: 8,
            }}
          >
            <span className="text-sm text-slate-700">{auth.member}</span>
          </div>

          {/* Display ID */}
          <span className="text-xs text-gray-500">{auth.displayId}</span>
        </Card>

        {/* Status-specific contextual panel */}
        <StatusPanel auth={auth} />

        {/* Determination letter — inline structured fields (Approved/Denied only) */}
        <DeterminationLetterSection authorizationId={auth.id} statusBucket={auth.statusBucket} />

        {/* Request Information */}
        <RequestInfoSection auth={auth} />

        {/* Timeline */}
        <TimelineSection auth={auth} />
      </ScreenScrollView>
    </div>
  );
}
