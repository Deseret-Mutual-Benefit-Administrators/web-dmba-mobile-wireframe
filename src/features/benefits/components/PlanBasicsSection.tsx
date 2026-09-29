import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { useBenefitTopic } from "../api/benefitsQueries";
import { BenefitTopicBody } from "./BenefitTopicBody";
import { scrollToAnchor } from "../services/scrollToAnchor";
import type { BenefitTopicSummary } from "../types";

interface PlanBasicsSectionProps {
  basics: BenefitTopicSummary[];
  /** The plan the topics are read for — passed through to each row's lazy topic read. */
  planId: string | undefined;
  /** `true` when the citation/deep-link target is a Plan-basics row: opens the section without a tap. */
  forceExpanded?: boolean;
  /** The topic being landed on, if any — the matching row is force-expanded. */
  targetTopicKey?: string;
  /** Bumped per landing so a repeat citation re-opens a section/row the member has since collapsed. */
  targetSeq?: number;
}

/**
 * "Plan basics" — the sub-tab's concept and prose-only topics as expandable
 * prose rows with no cost columns. Starts collapsed; renders nothing when
 * the sub-tab has no such topics.
 */
export function PlanBasicsSection({
  basics,
  planId,
  forceExpanded = false,
  targetTopicKey,
  targetSeq,
}: PlanBasicsSectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(forceExpanded);

  useEffect(() => {
    if (forceExpanded) setIsExpanded(true);
  }, [forceExpanded, targetSeq]);

  if (basics.length === 0) return null;

  const title = t("benefits.planBasics");

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex-row items-center justify-between px-4 py-3 bg-info-tint rounded-xl"
        aria-label={
          isExpanded
            ? t("benefits.collapseCategory", { category: title })
            : t("benefits.expandCategory", { category: title })
        }
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-bold text-brand-primary flex-1 mr-2">{title}</span>
        <Icon name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} size={18} color={colors.brand.primary} />
      </button>

      {isExpanded && (
        <div className="mt-1">
          {basics.map((topic) => (
            <PlanBasicsRow
              key={topic.topicKey}
              topic={topic}
              planId={planId}
              forceExpanded={targetTopicKey !== undefined && topic.topicKey === targetTopicKey}
              targetSeq={targetSeq}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PlanBasicsRowProps {
  topic: BenefitTopicSummary;
  planId: string | undefined;
  forceExpanded: boolean;
  targetSeq?: number;
}

/** One expandable prose row — title only in the header, never a cost column. */
function PlanBasicsRow({ topic, planId, forceExpanded, targetSeq }: PlanBasicsRowProps) {
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

  const detail = useBenefitTopic(topic.topicKey, planId, { enabled: isExpanded, title: topic.title });

  return (
    <div ref={anchorRef} className="bg-brand-surface rounded-xl mb-2">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex-row items-center justify-between p-4 min-h-11"
        aria-label={t(isExpanded ? "benefits.collapseBenefit" : "benefits.expandBenefit", {
          name: topic.title,
        })}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-brand-primary flex-1 mr-2">{topic.title}</span>
        <Icon name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} size={18} color={colors.brand.secondary} />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <BenefitTopicBody topic={detail} showFactRows={false} />
        </div>
      )}
    </div>
  );
}
