import type { ReactNode } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Caption } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import { sectionKindLabelKey } from "../services/benefitsTarget";
import type { TopicQuery } from "../api/benefitsQueries";

interface BenefitTopicBodyProps {
  /** The lazy `useBenefitTopic` result the owning card/row holds. */
  topic: TopicQuery;
  /** `true` on a benefit card (adds deductible / OOP-max lines); `false` on a Plan-basics row. */
  showFactRows: boolean;
}

/**
 * The expanded half of a benefit card or Plan-basics row: the topic's prose
 * sections rendered as Markdown under a small kind label, plus the typed plan
 * fact's explicit answers. The `planFacts` Markdown section is not rendered.
 */
export function BenefitTopicBody({ topic, showFactRows }: BenefitTopicBodyProps) {
  const { t } = useTranslation();

  if (topic.isPending) {
    return (
      <div className="items-center py-3">
        <Spinner size="small" tone="accent" />
      </div>
    );
  }

  if (topic.isError) {
    return (
      <InlineErrorState className="py-3" message={t("benefits.topicLoadError")} onRetry={() => void topic.refetch()} />
    );
  }

  const data = topic.data;
  const proseSections = data.sections.filter((section) => section.kind !== "planFacts");
  const fact = data.planFact;
  const notCovered = fact?.covered === false;
  const factRows = showFactRows
    ? [
        { label: t("benefits.deductible"), value: fact?.deductible },
        { label: t("benefits.outOfPocketMax"), value: fact?.oopMax },
      ].filter((row): row is { label: string; value: string } => !!row.value)
    : [];

  if (proseSections.length === 0 && !notCovered && factRows.length === 0) {
    return <Caption className="py-2">{t("benefits.noAdditionalDetails")}</Caption>;
  }

  return (
    <div className="pt-1">
      {notCovered && (
        <div className="flex-row items-center mb-2">
          <Icon name="close-circle-outline" size={16} color={colors.error} />
          <span className="ml-1.5 text-sm font-semibold text-error">{t("benefits.notCoveredOnYourPlan")}</span>
        </div>
      )}

      {factRows.map((row) => (
        <div key={row.label} className="flex-row justify-between mb-1">
          <span className="text-xs text-brand-secondary flex-1">{row.label}</span>
          <span className="text-xs text-brand-primary font-medium ml-2 text-right">{row.value}</span>
        </div>
      ))}

      {proseSections.map((section) => (
        <div key={section.id} className="mt-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            {t(sectionKindLabelKey(section.kind))}
          </span>
          <MiniMarkdown source={section.markdown} />
        </div>
      ))}
    </div>
  );
}

/**
 * Web stand-in for `react-native-markdown-display` with the card-scale styles
 * the app passes (14/21 body, 8px paragraph gap, bullets, **bold**).
 */
function MiniMarkdown({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/);
  return (
    <div style={{ color: colors.brand.primary, fontSize: 14, lineHeight: "21px" }}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} style={{ marginBottom: 8, paddingLeft: 0 }}>
              {lines.map((l, j) => (
                <li key={j} style={{ flexDirection: "row", marginBottom: 2, lineHeight: "20px" }}>
                  <span style={{ marginRight: 6 }}>•</span>
                  <span>{inline(l.replace(/^\s*[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} style={{ marginTop: 0, marginBottom: 8 }}>
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} style={{ fontWeight: 700, color: colors.brand.primary }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}
