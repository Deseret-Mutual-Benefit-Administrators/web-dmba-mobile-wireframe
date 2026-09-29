import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import type { ServiceLine } from "../types";
import { formatClaimAmount } from "../services/claimsTransforms";
import { colors } from "@/src/shared/theme/colors";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";

interface ServiceLineItemProps {
  serviceLine: ServiceLine;
}

/**
 * Expandable service line row for the claim detail screen.
 * Collapsed: CPT badge, description, billed amount.
 * Expanded: deductible, coinsurance, copay breakdown.
 */
export function ServiceLineItem({ serviceLine }: ServiceLineItemProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-brand-surface rounded-xl mb-2 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex-row items-center p-3 active:opacity-80 text-left"
        aria-label={`${serviceLine.description}, ${formatClaimAmount(serviceLine.billedAmount)}`}
        title={t("claimDetail.tapToExpand")}
        aria-expanded={expanded}
      >
        {/* CPT Badge */}
        <div className="bg-blue-100 rounded-md px-2 py-1 mr-3">
          <span className="text-xs font-semibold text-blue-800">{serviceLine.procedureCode}</span>
        </div>

        {/* Description + Amount */}
        <div className="flex-1 mr-2 min-w-0">
          <span className={`text-sm text-brand-primary font-medium ${expanded ? "" : "truncate"}`}>
            {serviceLine.description}
          </span>
        </div>

        <span className="text-sm font-semibold text-brand-primary mr-2">{formatClaimAmount(serviceLine.billedAmount)}</span>

        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.brand.secondary} />
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100">
          <KeyValueRow label={t("claimDetail.allowed")} value={formatClaimAmount(serviceLine.allowedAmount)} />
          <KeyValueRow label={t("claimDetail.deductible")} value={formatClaimAmount(serviceLine.deductible)} />
          <KeyValueRow label={t("claimDetail.coinsurance")} value={formatClaimAmount(serviceLine.coinsurance)} />
          <KeyValueRow label={t("claimDetail.copay")} value={formatClaimAmount(serviceLine.copay)} divider />
          <KeyValueRow
            label={t("claimDetail.yourResponsibility")}
            value={formatClaimAmount(serviceLine.memberResponsibility)}
            prominent
          />
        </div>
      )}
    </div>
  );
}
