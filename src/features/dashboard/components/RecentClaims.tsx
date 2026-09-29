import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { lines } from "../webText";
import type { ClaimSummary } from "../types";

/**
 * Recent claims list shown on the dashboard.
 * Shows the 5 most recent claims with status badges.
 */

const STATUS_CONFIG: Record<string, { color: string; bgColor: string; icon: string }> = {
  Processed: { color: colors.success, bgColor: `${colors.success}/10`, icon: "checkmark-circle" },
  Pending: { color: colors.warning, bgColor: `${colors.warning}/10`, icon: "time" },
  Processing: { color: colors.info, bgColor: `${colors.info}/10`, icon: "sync" },
  Denied: { color: colors.error, bgColor: `${colors.error}/10`, icon: "close-circle" },
  Adjusted: { color: colors.searchSlate.base, bgColor: `${colors.searchSlate.base}/10`, icon: "swap-horizontal" },
};

function ClaimRow({ claim }: { claim: ClaimSummary }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const config = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG.Pending;

  const formattedDate = new Date(claim.dateOfService).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <button
      type="button"
      onClick={() => navigate(`/claim/${claim.id}`)}
      className="flex-row items-center py-3 border-b border-gray-50 active:bg-gray-50"
      aria-label={t("dashboard.claimRowLabel", {
        provider: claim.provider,
        status: claim.status,
        amount: claim.billedAmount.toFixed(0),
      })}
    >
      {/* Status icon */}
      <div className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${config.color}15` }}>
        <Icon name={config.icon} size={18} color={config.color} />
      </div>

      {/* Claim info */}
      <div className="flex-1 mr-3">
        <p className="text-sm text-brand-primary font-medium" style={lines(1)}>
          {claim.provider}
        </p>
        <p className="text-xs text-brand-secondary mt-0.5">
          {formattedDate} · {claim.serviceDescription}
        </p>
      </div>

      {/* Amount + status */}
      <div className="items-end">
        <span className="text-sm text-brand-primary font-semibold">${claim.billedAmount.toFixed(0)}</span>
        <p className="text-[10px] font-medium mt-0.5" style={{ color: config.color }}>
          {claim.status}
        </p>
      </div>
    </button>
  );
}

interface RecentClaimsProps {
  claims: ClaimSummary[];
}

export function RecentClaims({ claims }: RecentClaimsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (claims.length === 0) {
    return (
      <div className="bg-brand-surface rounded-xl p-6 items-center shadow-sm">
        <Icon name="receipt-outline" size={32} color={colors.brand.secondary} />
        <p className="text-brand-secondary text-sm mt-2">{t("dashboard.noClaims")}</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-xl px-4 shadow-sm">
      {/* Header */}
      <div className="flex-row items-center justify-between py-3 border-b border-gray-100">
        <span className="text-base font-semibold text-brand-primary">{t("dashboard.recentClaims")}</span>
        <button
          type="button"
          onClick={() => navigate("/activity")}
          className="flex-row items-center active:opacity-80"
          aria-label={t("dashboard.viewAllClaims")}
        >
          <span className="text-sm text-brand-accent font-medium mr-1">{t("dashboard.viewAll")}</span>
          <Icon name="chevron-forward" size={14} color={colors.brand.accent} />
        </button>
      </div>

      {/* Claims list */}
      {claims.map((claim) => (
        <ClaimRow key={claim.id} claim={claim} />
      ))}
    </div>
  );
}
