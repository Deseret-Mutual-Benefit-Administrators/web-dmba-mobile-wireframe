import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import type { Claim, ClaimType } from "../types";
import { formatClaimAmount, getStatusBadgeTone } from "../services/claimsTransforms";
import { Badge } from "@/src/shared/components/Badge";
import { Label } from "@/src/shared/components/Typography";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { colors } from "@/src/shared/theme/colors";

interface ClaimCardProps {
  claim: Claim;
  onPress: (claimId: string) => void;
}

const CLAIM_TYPE_ICON: Record<ClaimType, string> = {
  Medical: "medical-outline",
  Dental: "bandage-outline",
  Pharmacy: "medkit-outline",
};

export function ClaimCard({ claim, onPress }: ClaimCardProps) {
  const { t } = useTranslation();

  const claimTypeIcon = CLAIM_TYPE_ICON[claim.claimType];

  return (
    <button
      type="button"
      onClick={() => onPress(claim.id)}
      className="bg-brand-surface rounded-2xl p-4 mb-3 shadow-sm active:opacity-80 text-left"
      aria-label={`${t(`claims.type.${claim.claimType.toLowerCase()}`)}, ${claim.provider}, ${formatClaimAmount(claim.billedAmount)}, ${claim.status}`}
    >
      <div className="flex-row justify-between items-start mb-2">
        <div className="flex-row items-center flex-1 mr-2">
          <span style={{ marginRight: 6, display: "inline-flex" }}>
            <Icon name={claimTypeIcon} size={20} color={colors.brand.accent} />
          </span>
          <span className="text-brand-primary font-semibold text-base flex-1">{claim.provider}</span>
        </div>
        <Badge label={t(`claims.${claim.status.toLowerCase()}`)} tone={getStatusBadgeTone(claim.status)} />
      </div>

      <Label className="mb-1">{claim.serviceDescription}</Label>

      <KeyValueRow
        label={new Date(claim.dateOfService).toLocaleDateString()}
        value={formatClaimAmount(claim.billedAmount)}
        emphasize
      />
    </button>
  );
}
