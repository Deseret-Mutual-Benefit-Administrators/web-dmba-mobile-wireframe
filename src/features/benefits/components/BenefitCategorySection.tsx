import { useEffect, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { BenefitCard } from "./BenefitCard";
import type { BenefitCategoryGroup } from "../types";

interface BenefitCategorySectionProps {
  data: BenefitCategoryGroup;
  /** The plan the rows' facts belong to — passed through to each card's lazy topic read. */
  planId: string | undefined;
  /** `true` when the citation/deep-link target sits in this group: opens it without a tap. */
  forceExpanded?: boolean;
  /** The topic being landed on, if any — the matching card is force-expanded. */
  targetTopicKey?: string;
  /** Bumped per landing so a repeat citation re-opens a group the member has since collapsed. */
  targetSeq?: number;
}

/**
 * Collapsible section that groups benefits under the topic's curated
 * `group` header. Starts expanded. Network labels live inside each
 * BenefitCard, so no column header is needed here.
 */
export function BenefitCategorySection({
  data,
  planId,
  forceExpanded = false,
  targetTopicKey,
  targetSeq,
}: BenefitCategorySectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (forceExpanded) setIsExpanded(true);
  }, [forceExpanded, targetSeq]);

  return (
    <div className="mb-2">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex-row items-center justify-between px-4 py-3 bg-info-tint rounded-xl"
        aria-label={
          isExpanded
            ? t("benefits.collapseCategory", { category: data.category })
            : t("benefits.expandCategory", { category: data.category })
        }
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-bold text-brand-primary flex-1 mr-2">{data.category}</span>
        <Icon name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} size={18} color={colors.brand.primary} />
      </button>

      {/* Benefit cards */}
      {isExpanded && (
        <div className="mt-1">
          {data.benefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              planId={planId}
              forceExpanded={targetTopicKey !== undefined && benefit.topicKey === targetTopicKey}
              targetSeq={targetSeq}
            />
          ))}
        </div>
      )}
    </div>
  );
}
