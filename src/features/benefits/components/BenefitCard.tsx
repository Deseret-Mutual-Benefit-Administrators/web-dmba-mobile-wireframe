import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Badge } from "@/src/shared/components/Badge";
import { colors } from "@/src/shared/theme/colors";
import { useBenefitTopic } from "../api/benefitsQueries";
import { displayCost, isBenefitNotCovered } from "../services/benefitsTransforms";
import { BenefitTopicBody } from "./BenefitTopicBody";
import { scrollToAnchor } from "../services/scrollToAnchor";
import type { Benefit } from "../types";

interface BenefitCardProps {
  benefit: Benefit;
  /** The plan the row's fact belongs to — passed through to the lazy topic read. */
  planId: string | undefined;
  /** `true` when this card is the citation/deep-link target. */
  forceExpanded?: boolean;
  /** Bumped per landing so a repeat citation re-opens a card the member has since collapsed. */
  targetSeq?: number;
}

/**
 * Single benefit row card — header (name, prior-auth badge, in/out-of-network
 * costs, copay, notes) always visible; tapping it expands the topic's prose
 * sections. A `covered: false` row shows "Not covered on your plan" in place
 * of the cost columns.
 */
export function BenefitCard({ benefit, planId, forceExpanded = false, targetSeq }: BenefitCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(forceExpanded);

  // Stand-in for the app's useScrollToAnchor: a landing scrolls the card into view.
  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!forceExpanded) return;
    setIsExpanded(true);
    const id = setTimeout(() => scrollToAnchor(anchorRef.current), 50);
    return () => clearTimeout(id);
  }, [forceExpanded, targetSeq]);

  const topic = useBenefitTopic(benefit.topicKey, planId, { enabled: isExpanded, title: benefit.name });

  const notCovered = isBenefitNotCovered(benefit.covered);
  const hasCopay = !notCovered && benefit.copay != null && benefit.copay !== "";
  const notStated = t("benefits.notStated");
  const inNetworkDisplay = displayCost(benefit.inNetworkCost, notStated);
  const outOfNetworkDisplay = displayCost(benefit.outOfNetworkCost, notStated);

  const costSummary = notCovered
    ? t("benefits.notCoveredOnYourPlan")
    : hasCopay
      ? `${t("benefits.inNetwork")}: ${inNetworkDisplay}, ${t("benefits.outOfNetwork")}: ${outOfNetworkDisplay}, ${t("benefits.copay")}: ${benefit.copay}`
      : `${t("benefits.inNetwork")}: ${inNetworkDisplay}, ${t("benefits.outOfNetwork")}: ${outOfNetworkDisplay}`;

  const a11yLabel = `${t(isExpanded ? "benefits.collapseBenefit" : "benefits.expandBenefit", {
    name: benefit.name,
  })}. ${costSummary}`;

  return (
    <div ref={anchorRef} className="bg-brand-surface rounded-xl mb-2">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 min-h-11"
        aria-label={a11yLabel}
        aria-expanded={isExpanded}
      >
        {/* Top row: name + prior auth badge + chevron */}
        <div className="flex-row items-start justify-between mb-2">
          <span className="text-sm font-semibold text-brand-primary flex-1 mr-2">{benefit.name}</span>
          {benefit.requiresPreauth === true && <Badge tone="warning" label={t("benefits.priorAuthRequired")} />}
          <div className="ml-2" aria-hidden="true">
            <Icon name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} size={18} color={colors.brand.secondary} />
          </div>
        </div>

        {/* Cost columns — or the not-covered line in their place */}
        {notCovered ? (
          <div className="flex-row items-center">
            <Icon name="close-circle-outline" size={16} color={colors.error} />
            <span className="ml-1.5 text-sm font-semibold text-error">{t("benefits.notCoveredOnYourPlan")}</span>
          </div>
        ) : (
          <div className="flex-row">
            <div className="flex-1 mr-2">
              <span className="text-xs text-brand-secondary mb-0.5">{t("benefits.inNetwork")}</span>
              <span
                className={
                  inNetworkDisplay === notStated ? "text-sm text-gray-500" : "text-sm text-brand-primary font-medium"
                }
              >
                {inNetworkDisplay}
              </span>
            </div>
            <div className="flex-1">
              <span className="text-xs text-brand-secondary mb-0.5">{t("benefits.outOfNetwork")}</span>
              <span
                className={
                  outOfNetworkDisplay === notStated ? "text-sm text-gray-500" : "text-sm text-brand-primary font-medium"
                }
              >
                {outOfNetworkDisplay}
              </span>
            </div>
          </div>
        )}

        {/* Inline copay label — only shown for PPO plans where copay is non-null */}
        {hasCopay && (
          <p className="text-xs text-brand-secondary mt-2">
            {t("benefits.copay")}: <span className="font-medium text-brand-primary">{benefit.copay}</span>
          </p>
        )}

        {benefit.requiresPreauth === true && (
          <span className="text-xs text-amber-700 mt-2">{t("benefits.priorAuthRequiredDetail")}</span>
        )}

        {/* Optional notes */}
        {benefit.notes ? <span className="text-xs text-gray-500 mt-2">{benefit.notes}</span> : null}
      </button>

      {/* Expanded topic detail — mounted only while open. */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <BenefitTopicBody topic={topic} showFactRows />
        </div>
      )}
    </div>
  );
}
