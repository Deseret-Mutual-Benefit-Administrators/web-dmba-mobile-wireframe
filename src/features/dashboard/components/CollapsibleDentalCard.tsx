import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { financialCardGradient, gradientCss, oopMaxGradient, orthoGradient } from "@/src/shared/theme/gradients";
import { colors } from "@/src/shared/theme/colors";
import { FullWidthProgressBar } from "./FullWidthProgressBar";
import { FamilyMemberDropdown } from "./FamilyMemberDropdown";
import type { AccumulatorDisplay, FamilyMember } from "../types";

/**
 * Collapsible card showing dental benefit limit, deductible, and (if data
 * exists) lifetime ortho benefit. Family member picker lives inside the card.
 */

interface DentalAccumulatorDisplay extends AccumulatorDisplay {
  /** Optional — only present for ortho buckets */
  isOrtho?: boolean;
}

interface CollapsibleDentalCardProps {
  dentalAnnualMax: AccumulatorDisplay | null;
  dentalDeductible: AccumulatorDisplay | null;
  /** Ortho benefit — may not exist yet; only rendered when non-null */
  ortho?: DentalAccumulatorDisplay | null;
  familyMembers: FamilyMember[];
  selectedMemberId: string | undefined;
  onSelectMember: (memberId: string | undefined) => void;
  selfName: string;
}

export function CollapsibleDentalCard({
  dentalAnnualMax,
  dentalDeductible,
  ortho,
  familyMembers,
  selectedMemberId,
  onSelectMember,
  selfName,
}: CollapsibleDentalCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const benefitLimitColors: [string, string] = [...financialCardGradient];
  const deductibleColors: [string, string] = [...oopMaxGradient];
  const orthoColors: [string, string] = [...orthoGradient];

  const hasAnyData = dentalAnnualMax !== null || dentalDeductible !== null;

  return (
    <div className="bg-brand-surface rounded-2xl mb-3 overflow-hidden shadow-sm">
      {/* ── Card Header ── */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 flex-row items-center justify-between border-b border-gray-100"
        aria-label={t("dashboard.dentalBenefits")}
        aria-expanded={isExpanded}
      >
        <div className="flex-row items-center flex-1 mr-4">
          <div style={{ marginRight: 16 }}>
            <div
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", background: gradientCss(financialCardGradient, 90) }}
            >
              <Icon name="fitness-outline" size={18} color={colors.brand.surface} />
            </div>
          </div>
          <span className="text-brand-primary font-semibold text-base">{t("dashboard.dentalBenefits")}</span>
        </div>
        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.financial.gradientStart} />
      </button>

      {/* ── Expandable Body ── */}
      {isExpanded && (
        <div className="px-4 pt-4 pb-2">
          {familyMembers.length > 0 && (
            <FamilyMemberDropdown familyMembers={familyMembers} selectedMemberId={selectedMemberId} onSelect={onSelectMember} selfName={selfName} />
          )}

          {dentalAnnualMax && (
            <FullWidthProgressBar
              label={t("dashboard.annualBenefitLimit")}
              spent={dentalAnnualMax.used}
              remaining={Math.max(dentalAnnualMax.total - dentalAnnualMax.used, 0)}
              max={dentalAnnualMax.total}
              gradientColors={benefitLimitColors}
            />
          )}

          {dentalDeductible && (
            <FullWidthProgressBar
              label={t("dashboard.annualDeductible")}
              spent={dentalDeductible.used}
              remaining={Math.max(dentalDeductible.total - dentalDeductible.used, 0)}
              max={dentalDeductible.total}
              gradientColors={deductibleColors}
            />
          )}

          {ortho && (
            <FullWidthProgressBar
              label={t("dashboard.lifetimeOrtho")}
              spent={ortho.used}
              remaining={Math.max(ortho.total - ortho.used, 0)}
              max={ortho.total}
              gradientColors={orthoColors}
            />
          )}

          {!hasAnyData && <p className="text-xs text-brand-secondary text-center py-4">{t("common.noResults")}</p>}
        </div>
      )}
    </div>
  );
}
