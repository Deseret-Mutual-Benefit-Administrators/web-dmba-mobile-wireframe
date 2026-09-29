/**
 * Port of `app/claim/[id].tsx`. Ids `processed`, `pending`, `processing`,
 * `denied`, `adjusted` reach each status; any other id shows the first claim.
 * `?state=loading|error` reaches the other two states.
 */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Card } from "@/src/shared/components/Card";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { getStatusBadgeTone } from "../services/claimsTransforms";
import { CostBreakdownCard } from "../components/CostBreakdownCard";
import { BenefitsAppliedCard } from "../components/BenefitsAppliedCard";
import { ServiceLineItem } from "../components/ServiceLineItem";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import type { ClaimStatus } from "../types";
import { Spinner } from "@/src/shared/components/Spinner";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Label, SectionTitle } from "@/src/shared/components/Typography";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { Badge } from "@/src/shared/components/Badge";
import { Button } from "@/src/shared/components/Button";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { useToast } from "@/src/shared/components/Toast";
import { placeholderClaimDetail, placeholderUser } from "../placeholder";
import { usePlaceholderState } from "../hooks/usePlaceholderState";

export function ClaimDetailRoute() {
  const { id = "" } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const state = usePlaceholderState();
  const isLoading = state === "loading";
  const isError = state === "error" || state === "empty";
  const claim = isLoading || isError ? null : placeholderClaimDetail(id);
  const user = placeholderUser;
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const handleDownloadEob = () => {
    if (!claim || !claim.eobDocumentId) return;
    // The app downloads and opens the share sheet; the wireframe has no files.
    setIsDownloading(true);
    window.setTimeout(() => {
      setIsDownloading(false);
      toast.show(t("claimDetail.eobErrorMessage"), { tone: "error" });
    }, 600);
  };

  const composeUrl = (params: Record<string, string>) => `/messages/compose?${new URLSearchParams(params).toString()}`;

  const handleContactSupport = () => {
    if (!claim) return;
    navigate(composeUrl({ topic: "claims", claimNumber: claim.claimNumber }));
  };

  const handleFileAppeal = () => {
    if (!claim) return;
    navigate(
      composeUrl({
        topic: "claims",
        claimNumber: claim.claimNumber,
        subject: t("claimDetail.appealSubject", { claimNumber: claim.claimNumber }),
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background h-full">
        <Spinner size="large" />
        <Label className="mt-2">{t("common.loading")}</Label>
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <div className="flex-1 items-center justify-center bg-brand-background h-full">
        <EmptyState
          icon={<Icon name="alert-circle-outline" size={48} color={colors.error} />}
          title={t("claims.loadError")}
          action={{ label: t("common.back"), onPress: () => navigate(-1) }}
        />
      </div>
    );
  }

  const status = claim.status;
  const isProcessed = status === "Processed";
  const isDenied = status === "Denied";

  return (
    <div className="flex-1 bg-brand-background h-full min-h-0">
      <ScreenHeader
        title={t("claimDetail.title")}
        rightElement={<Badge label={t(`claims.${status.toLowerCase()}`)} tone={getStatusBadgeTone(status)} />}
      />

      <ScreenScrollView contentContainerStyle={{ paddingTop: 16 }}>
        {/* Status Alert Banner */}
        <StatusAlertBanner status={status} />

        {/* Claim Info Card */}
        <Card variant="translucent" className="mb-4">
          <span className="text-lg font-bold text-brand-primary mb-1">{claim.provider}</span>
          <Label className="mb-1">{claim.serviceDescription}</Label>

          {/* Member Name Badge */}
          <div
            className="mt-2 self-start px-3 py-1.5 rounded-lg mb-3"
            style={{ backgroundColor: withAlpha(colors.searchSlate.light, 0.2) }}
          >
            <span className="text-sm text-slate-700">{user ? `${user.firstName} ${user.lastName}` : t("common.member")}</span>
          </div>

          <KeyValueRow label={t("claimDetail.claimNumber")} value={claim.claimNumber} />
          <KeyValueRow label={t("claims.dateOfService")} value={new Date(claim.dateOfService).toLocaleDateString()} />
          <KeyValueRow label={t("claimDetail.submittedDate")} value={new Date(claim.submittedDate).toLocaleDateString()} />
        </Card>

        {/* Cost Breakdown */}
        <CostBreakdownCard
          billedAmount={claim.billedAmount}
          allowedAmount={claim.allowedAmount}
          planPaid={claim.planPaid}
          memberResponsibility={claim.memberResponsibility}
        />

        {/* Benefits Applied — Processed claims only */}
        {isProcessed && claim.serviceLines.length > 0 && <BenefitsAppliedCard serviceLines={claim.serviceLines} />}

        {/* Service Lines */}
        {claim.serviceLines.length > 0 && (
          <div className="mb-4">
            <SectionTitle className="mb-2">{t("claimDetail.serviceLines")}</SectionTitle>
            {claim.serviceLines.map((line) => (
              <ServiceLineItem key={line.id} serviceLine={line} />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="gap-3 mt-2 mb-4">
          {claim.eobDocumentId !== null && (
            <Button
              onPress={handleDownloadEob}
              loading={isDownloading}
              label={isDownloading ? t("claimDetail.eobLoading") : t("claimDetail.downloadEob")}
              icon={<Icon name="download-outline" size={20} color={colors.brand.surface} />}
              fullWidth
              accessibilityHint={t("common.hints.opensShareSheet")}
            />
          )}

          <Button
            onPress={handleContactSupport}
            variant="secondary"
            label={t("claimDetail.contactSupport")}
            icon={<Icon name="chatbubble-ellipses-outline" size={20} color={colors.brand.accent} />}
            fullWidth
            accessibilityHint={t("common.hints.opensNewMessage")}
          />

          {isDenied && (
            <button
              type="button"
              onClick={handleFileAppeal}
              className="flex-row items-center justify-center bg-red-50 border border-red-200 py-3.5 rounded-xl active:opacity-80"
              aria-label={t("claimDetail.fileAppeal")}
            >
              <Icon name="flag-outline" size={20} color={colors.error} />
              <span className="text-error font-semibold ml-2">{t("claimDetail.fileAppeal")}</span>
            </button>
          )}
        </div>
      </ScreenScrollView>
    </div>
  );
}

/** Color-coded status alert banner. */
function StatusAlertBanner({ status }: { status: ClaimStatus }) {
  const { t } = useTranslation();

  const config: Record<ClaimStatus, { bg: string; border: string; icon: string; iconColor: string }> = {
    Pending: { bg: "bg-amber-50", border: "border-amber-200", icon: "time-outline", iconColor: colors.tone.warning.icon },
    Processing: { bg: "bg-blue-50", border: "border-blue-200", icon: "sync-outline", iconColor: colors.tone.info.icon },
    Processed: { bg: "bg-green-50", border: "border-green-200", icon: "checkmark-circle-outline", iconColor: colors.success },
    Denied: { bg: "bg-red-50", border: "border-red-200", icon: "close-circle-outline", iconColor: colors.error },
    Adjusted: { bg: "bg-gray-50", border: "border-gray-200", icon: "swap-horizontal-outline", iconColor: colors.brand.secondary },
  };

  const { bg, border, icon, iconColor } = config[status];

  return (
    <div className={`flex-row items-center p-3 rounded-xl mb-4 border ${bg} ${border}`}>
      <Icon name={icon} size={20} color={iconColor} />
      <span className="text-sm text-gray-700 ml-2 flex-1">{t(`claimDetail.statusMessage.${status.toLowerCase()}`)}</span>
    </div>
  );
}
