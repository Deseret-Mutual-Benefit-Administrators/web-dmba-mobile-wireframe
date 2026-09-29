/**
 * List-row card for a single prior authorization.
 *   Row 1: Family-member pill (top-left) + ChevronRight (top-right)
 *   Row 2: Status icon (left) + 3-line stack: service / provider / diagnosis
 *   Row 3: "Requested: {date}" (bottom-left) + status pill (bottom-right)
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import type { PriorAuth } from "../types";
import { PriorAuthStatusBadge } from "./PriorAuthStatusBadge";
import { StatusIcon } from "./StatusIcon";
import { formatDate, getStatusDisplay } from "../services/priorAuthFormat";
import { cardShadowStyle } from "@/src/shared/components/Card";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import { gradientCss } from "@/src/shared/theme/gradients";

interface PriorAuthCardProps {
  auth: PriorAuth;
  onPress: (authId: string) => void;
}

export function PriorAuthCard({ auth, onPress }: PriorAuthCardProps) {
  const { t } = useTranslation();
  const statusDisplay = getStatusDisplay(auth.statusBucket);
  const serviceLabel = auth.lineCount > 1 ? t("priorAuth.multipleServices") : auth.service;

  return (
    <button
      type="button"
      onClick={() => onPress(auth.id)}
      className="active:opacity-80 text-left"
      style={{
        backgroundColor: withAlpha(colors.brand.surface, 0.85),
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        ...cardShadowStyle,
      }}
      aria-label={t("priorAuth.cardLabel", {
        service: serviceLabel,
        provider: auth.provider,
        status: t(statusDisplay.labelKey),
        date: formatDate(auth.requestDate),
      })}
    >
      {/* Row 1: Family-member pill (top-left) + ChevronRight (top-right) */}
      <div style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div
          style={{
            background: gradientCss([withAlpha(colors.searchSlate.light, 0.2), withAlpha(colors.searchSlate.base, 0.2)], 90),
            borderRadius: 9999,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: withAlpha(colors.searchSlate.light, 0.3),
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, color: colors.neutral[700] }}>{auth.member}</span>
        </div>

        <Icon name="chevron-forward" size={20} color={colors.neutral[500]} />
      </div>

      {/* Row 2: Status icon (left) + service / provider / diagnosis stack (right) */}
      <div style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ marginTop: 1, marginRight: 8, display: "inline-flex" }}>
          <StatusIcon name={statusDisplay.icon} size={20} color={statusDisplay.iconColor} />
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="line-clamp-2" style={{ fontSize: 15, fontWeight: 600, color: colors.neutral[900], marginBottom: 2 }}>
            {serviceLabel}
          </span>
          <span className="truncate" style={{ fontSize: 13, color: colors.neutral[600], marginBottom: 2 }}>
            {auth.provider}
          </span>
          {auth.diagnosis ? (
            <span className="truncate" style={{ fontSize: 12, color: colors.neutral[500] }}>
              {auth.diagnosis}
            </span>
          ) : null}
        </div>
      </div>

      {/* Row 3: "Requested: {date}" (bottom-left) + status pill (bottom-right) */}
      <div style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: colors.neutral[500] }}>
          {t("priorAuth.requestedLabel")}
          {": "}
          {formatDate(auth.requestDate)}
        </span>
        <PriorAuthStatusBadge bucket={auth.statusBucket} />
      </div>
    </button>
  );
}
