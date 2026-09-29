import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { financialCardGradient, gradientCss, oopMaxGradient } from "@/src/shared/theme/gradients";
import { colors } from "@/src/shared/theme/colors";
import { lines } from "../webText";
import { FullWidthProgressBar } from "./FullWidthProgressBar";
import { FamilyMemberDropdown } from "./FamilyMemberDropdown";
import type { AccumulatorDisplay, FamilyMember } from "../types";

/**
 * Collapsible card showing medical deductible and OOP progress.
 * Contains a network toggle (In-Network / Out-of-Network) and a family
 * member picker, both living inside the card per the Figma layout.
 */

type NetworkMode = "inNetwork" | "outOfNetwork";

interface CollapsibleDeductibleCardProps {
  planName: string;
  deductibleInNetwork: AccumulatorDisplay | null;
  oopMaxInNetwork: AccumulatorDisplay | null;
  /** True when the individual in-network OOP has the -1 "no cap" sentinel. */
  oopMaxInNetworkIsUnlimited?: boolean;
  deductibleOutOfNetwork: AccumulatorDisplay | null;
  oopMaxOutOfNetwork: AccumulatorDisplay | null;
  /** True when the individual OON OOP has the -1 "no cap" sentinel. */
  oopMaxOutOfNetworkIsUnlimited?: boolean;
  familyDeductibleInNetwork: AccumulatorDisplay | null;
  familyOopMaxInNetwork: AccumulatorDisplay | null;
  /** True when the family in-network OOP has the -1 "no cap" sentinel. */
  familyOopMaxInNetworkIsUnlimited?: boolean;
  familyMembers: FamilyMember[];
  /** Defaults to true. */
  familyBucketsAvailable?: boolean;
  selectedMemberId: string | undefined;
  onSelectMember: (memberId: string | undefined) => void;
  /** Display name for the logged-in user in the dropdown */
  selfName: string;
}

export function CollapsibleDeductibleCard({
  planName,
  deductibleInNetwork,
  oopMaxInNetwork,
  oopMaxInNetworkIsUnlimited = false,
  deductibleOutOfNetwork,
  oopMaxOutOfNetwork,
  oopMaxOutOfNetworkIsUnlimited = false,
  familyDeductibleInNetwork,
  familyOopMaxInNetwork,
  familyOopMaxInNetworkIsUnlimited = false,
  familyMembers,
  familyBucketsAvailable = true,
  selectedMemberId,
  onSelectMember,
  selfName,
}: CollapsibleDeductibleCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [networkMode, setNetworkMode] = useState<NetworkMode>("inNetwork");

  const isInNetwork = networkMode === "inNetwork";

  const isFamilySelected = selectedMemberId === "family" && familyBucketsAvailable;
  const deductibleData = isInNetwork ? (isFamilySelected ? familyDeductibleInNetwork : deductibleInNetwork) : deductibleOutOfNetwork;
  const oopData = isInNetwork ? (isFamilySelected ? familyOopMaxInNetwork : oopMaxInNetwork) : oopMaxOutOfNetwork;

  const currentOopIsUnlimited = isInNetwork
    ? isFamilySelected
      ? familyOopMaxInNetworkIsUnlimited
      : oopMaxInNetworkIsUnlimited
    : oopMaxOutOfNetworkIsUnlimited;

  const deductibleColors: [string, string] = [...financialCardGradient];
  const oopColors: [string, string] = [...oopMaxGradient];

  return (
    <div className="bg-brand-surface rounded-2xl mb-3 overflow-hidden shadow-sm">
      {/* ── Card Header ── */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 flex-row items-center justify-between border-b border-gray-100"
        aria-label={planName}
        aria-expanded={isExpanded}
      >
        <div className="flex-row items-center flex-1 mr-4">
          <div style={{ marginRight: 16 }}>
            <div
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", background: gradientCss(financialCardGradient, 90) }}
            >
              <Icon name="medical-outline" size={18} color={colors.brand.surface} />
            </div>
          </div>
          <p className="text-brand-primary font-semibold text-base flex-shrink flex-1" style={lines(1)}>
            {planName}
          </p>
        </div>
        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.financial.gradientStart} />
      </button>

      {/* ── Expandable Body ── */}
      {isExpanded && (
        <div className="px-4 pt-4 pb-2">
          {/* Network toggle */}
          <div className="flex-row rounded-lg p-1 mb-4 bg-gray-200" role="tablist">
            <button
              type="button"
              onClick={() => setNetworkMode("inNetwork")}
              className={`flex-1 py-2 rounded-md items-center ${isInNetwork ? "bg-brand-accent" : ""}`}
              role="tab"
              aria-label={t("dashboard.inNetwork")}
              aria-selected={isInNetwork}
            >
              <span className={`text-xs font-semibold ${isInNetwork ? "text-white" : "text-gray-600"}`}>{t("dashboard.inNetwork")}</span>
            </button>
            <button
              type="button"
              onClick={() => setNetworkMode("outOfNetwork")}
              className={`flex-1 py-2 rounded-md items-center ${!isInNetwork ? "bg-brand-accent" : ""}`}
              role="tab"
              aria-label={t("dashboard.outOfNetwork")}
              aria-selected={!isInNetwork}
            >
              <span className={`text-xs font-semibold ${!isInNetwork ? "text-white" : "text-gray-600"}`}>{t("dashboard.outOfNetwork")}</span>
            </button>
          </div>

          {/* Family member dropdown */}
          {familyMembers.length > 0 && (
            <FamilyMemberDropdown familyMembers={familyMembers} selectedMemberId={selectedMemberId} onSelect={onSelectMember} selfName={selfName} />
          )}

          {/* Progress bars */}
          {deductibleData && (
            <FullWidthProgressBar
              label={isInNetwork ? t("dashboard.inNetworkDeductible") : t("dashboard.outOfNetworkDeductible")}
              spent={deductibleData.used}
              remaining={Math.max(deductibleData.total - deductibleData.used, 0)}
              max={deductibleData.total}
              gradientColors={deductibleColors}
            />
          )}

          {oopData && (
            <FullWidthProgressBar
              label={isInNetwork ? t("dashboard.inNetworkOop") : t("dashboard.outOfNetworkOop")}
              spent={oopData.used}
              remaining={Math.max(oopData.total - oopData.used, 0)}
              max={oopData.total}
              gradientColors={oopColors}
            />
          )}

          {/* No OOP cap — plan has large-claims coverage instead of a dollar limit. */}
          {!oopData && currentOopIsUnlimited && (
            <div className="flex-row items-center py-2">
              <Icon name="shield-checkmark-outline" size={16} color={colors.success} />
              <span className="text-xs text-brand-secondary ml-2">{t("dashboard.largeClaimsCoverage")}</span>
            </div>
          )}

          {/* Empty state when no data for selected network */}
          {!deductibleData && !oopData && !currentOopIsUnlimited && (
            <p className="text-xs text-brand-secondary text-center py-4">
              {isInNetwork ? t("dashboard.inNetworkDeductible") : t("dashboard.outOfNetworkDeductible")}
              {" — "}
              {t("common.noResults")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
