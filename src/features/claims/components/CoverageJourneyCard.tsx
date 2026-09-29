import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { CollapsibleSection } from "@/src/shared/components/CollapsibleSection";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { LoadingSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { Badge, type BadgeTone } from "@/src/shared/components/Badge";
import { Label } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import { formatClaimAmount } from "../services/claimsTransforms";
import { placeholderJourney, type Accumulator } from "../placeholder";
import { usePlaceholderState } from "../hooks/usePlaceholderState";
import type {
  CoverageJourneyPhase,
  JourneyPhaseKey,
  JourneyPhaseState,
  JourneyPhaseView,
} from "../services/coverageJourney";

interface CoverageJourneyCardProps {
  /** The claims screen's member-selection value — "family", undefined (self), or a member id. */
  selectedMember: string | undefined;
}

/**
 * Status key for the protection-status banner. `deductibleIsWaived` takes
 * precedence over `oopMaxIsUnlimited`.
 */
function statusKey(phase: CoverageJourneyPhase, oopMaxIsUnlimited: boolean, deductibleIsWaived: boolean): string | null {
  if (phase === "unknown") return null;
  if (phase === "costSharing" && deductibleIsWaived) return "claims.journey.status.noDeductiblePlan";
  if (phase === "costSharing" && oopMaxIsUnlimited) return "claims.journey.status.costSharingUnlimited";
  return `claims.journey.status.${phase}`;
}

/** Stand-in for `useCoverageJourney(selectedMember)`. */
function useCoverageJourney(_selectedMember: string | undefined) {
  const state = usePlaceholderState();
  return {
    ...placeholderJourney,
    isLoading: state === "loading",
    isError: state === "error",
    refetch: () => {},
  };
}

export function CoverageJourneyCard({ selectedMember }: CoverageJourneyCardProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { journey, phases, memberCoinsurancePct, isLoading, isError, refetch } = useCoverageJourney(selectedMember);

  const subtitleStatusKey = statusKey(journey.phase, journey.oopMaxIsUnlimited, journey.deductibleIsWaived);
  const subtitle = isError
    ? t("common.unavailable")
    : isLoading
    ? t("common.loading")
    : t(
        `claims.journey.bandStatus.${
          journey.deductibleIsWaived && journey.phase === "costSharing" ? "noDeductiblePlan" : journey.phase
        }`
      );

  return (
    <CollapsibleSection
      variant="dark"
      icon="map"
      title={t("claims.journey.title")}
      subtitle={isOpen ? t("claims.journey.subtitleOpen") : subtitle}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
    >
      {isLoading && (
        <div>
          <LoadingSkeleton width="100%" height={16} className="mb-2" />
          <LoadingSkeleton width="100%" height={24} borderRadius={12} className="mb-2" />
          <LoadingSkeleton width="80%" height={16} />
        </div>
      )}

      {!isLoading && isError && <InlineErrorState message={t("common.unavailable")} onRetry={refetch} />}

      {!isLoading && !isError && (
        <div>
          <StatusBanner
            statusKey={subtitleStatusKey}
            isSuccessToned={journey.phase === "costSharing" || journey.phase === "fullyCovered"}
          />
          <JourneyTimeline phases={phases} memberCoinsurancePct={memberCoinsurancePct} />
          {journey.phase === "unknown" && <Label>{t("claims.journey.explainer.unknown")}</Label>}
        </div>
      )}
    </CollapsibleSection>
  );
}

function StatusBanner({ statusKey: key, isSuccessToned }: { statusKey: string | null; isSuccessToned: boolean }) {
  const { t } = useTranslation();
  if (key === null) return null;
  const statusText = t(key);

  return (
    <div
      className={`rounded-xl px-3 py-3 mb-4 border ${
        isSuccessToned ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-100"
      }`}
      aria-label={statusText}
    >
      <span className={`text-sm font-medium ${isSuccessToned ? "text-green-700" : "text-blue-800"}`}>{statusText}</span>
    </div>
  );
}

interface JourneyTimelineProps {
  phases: [JourneyPhaseView, JourneyPhaseView, JourneyPhaseView];
  memberCoinsurancePct: number | null;
}

function JourneyTimeline({ phases, memberCoinsurancePct }: JourneyTimelineProps) {
  return (
    <div>
      {phases.map((phase, index) => (
        <PhaseStop
          key={phase.key}
          phase={phase}
          isLast={index === phases.length - 1}
          memberCoinsurancePct={memberCoinsurancePct}
        />
      ))}
    </div>
  );
}

interface StateStyle {
  markerColor: string;
  markerIcon: string;
  cardClasses: string;
  titleClasses: string;
  fillColor: string;
  badgeTone: BadgeTone | null;
}

const STATE_STYLES: Record<JourneyPhaseState, StateStyle> = {
  complete: {
    markerColor: colors.tone.success.icon,
    markerIcon: "checkmark",
    cardClasses: "bg-brand-surface border-green-200",
    titleClasses: "text-brand-primary",
    fillColor: colors.tone.success.icon,
    badgeTone: "success",
  },
  current: {
    markerColor: colors.brand.accent,
    markerIcon: "navigate",
    cardClasses: "bg-brand-surface border-brand-accent",
    titleClasses: "text-brand-primary",
    fillColor: colors.brand.accent,
    badgeTone: "info",
  },
  upcoming: {
    markerColor: colors.neutral[500],
    markerIcon: "ellipse-outline",
    cardClasses: "bg-brand-background border-brand-border",
    titleClasses: "text-brand-secondary",
    fillColor: colors.neutral[500],
    badgeTone: "neutral",
  },
  waived: {
    markerColor: colors.neutral[500],
    markerIcon: "remove",
    cardClasses: "bg-brand-background border-brand-border",
    titleClasses: "text-brand-secondary",
    fillColor: colors.neutral[500],
    badgeTone: "neutral",
  },
  unlimited: {
    markerColor: colors.neutral[500],
    markerIcon: "alert-circle-outline",
    cardClasses: "bg-brand-surface border-brand-border",
    titleClasses: "text-brand-primary",
    fillColor: colors.neutral[500],
    badgeTone: "neutral",
  },
  unknown: {
    markerColor: colors.neutral[500],
    markerIcon: "help",
    cardClasses: "bg-brand-surface border-brand-border",
    titleClasses: "text-brand-primary",
    fillColor: colors.neutral[500],
    badgeTone: null,
  },
};

function descriptionKey(key: JourneyPhaseKey, state: JourneyPhaseState): string {
  if (key === "deductible" && state === "waived") return "claims.journey.phases.deductible.waivedDescription";
  if (key === "oopMax" && state === "unlimited") return "claims.journey.largeClaimsCoverage";
  return `claims.journey.phases.${key}.description`;
}

function titleKey(key: JourneyPhaseKey, state: JourneyPhaseState): string {
  if (key === "oopMax" && state === "unlimited") return "claims.journey.phases.oopMax.unlimitedTitle";
  return `claims.journey.phases.${key}.title`;
}

interface PhaseStopProps {
  phase: JourneyPhaseView;
  isLast: boolean;
  memberCoinsurancePct: number | null;
}

function PhaseStop({ phase, isLast, memberCoinsurancePct }: PhaseStopProps) {
  const { t } = useTranslation();
  const style = STATE_STYLES[phase.state];
  const title = t(titleKey(phase.key, phase.state));
  const badgeLabel = style.badgeTone !== null ? t(`claims.journey.phaseState.${phase.state}`) : null;

  const description =
    phase.key === "coinsurance" && memberCoinsurancePct !== null
      ? t("claims.journey.phases.coinsurance.descriptionWithRate", { pct: memberCoinsurancePct })
      : t(descriptionKey(phase.key, phase.state));

  const progressCaption =
    phase.accumulator !== null
      ? t("claims.journey.progressCaption", {
          used: formatClaimAmount(phase.accumulator.used),
          total: formatClaimAmount(phase.accumulator.total),
        })
      : null;

  const accessibilityLabel = [title, badgeLabel, description, progressCaption]
    .filter((part): part is string => part !== null)
    .join(". ");

  return (
    <div className="flex-row" aria-label={accessibilityLabel}>
      {/* Marker column: circle + connector down to the next stop. */}
      <div className="items-center mr-3" style={{ width: 28 }} aria-hidden="true">
        <div className="w-7 h-7 rounded-full items-center justify-center" style={{ backgroundColor: style.markerColor }}>
          {style.markerIcon === "help" ? (
            <CircleHelp size={16} color={colors.brand.surface} />
          ) : (
            <Icon name={style.markerIcon} size={16} color={colors.brand.surface} />
          )}
        </div>
        {!isLast && <div className="flex-1 w-0.5 bg-gray-200 my-1" />}
      </div>

      <div className={`flex-1 rounded-xl border p-3 ${isLast ? "" : "mb-3"} ${style.cardClasses}`}>
        <div className="flex-row items-start justify-between mb-1">
          <span className={`text-sm font-semibold flex-1 mr-2 ${style.titleClasses}`}>{title}</span>
          {badgeLabel !== null && style.badgeTone !== null && <Badge label={badgeLabel} tone={style.badgeTone} />}
        </div>
        <span className="text-xs text-brand-secondary">{description}</span>

        {phase.accumulator !== null && progressCaption !== null && (
          <PhaseProgressBar accumulator={phase.accumulator} caption={progressCaption} fillColor={style.fillColor} />
        )}
      </div>
    </div>
  );
}

interface PhaseProgressBarProps {
  accumulator: Accumulator;
  caption: string;
  fillColor: string;
}

function PhaseProgressBar({ accumulator, caption, fillColor }: PhaseProgressBarProps) {
  const pct = accumulator.total > 0 ? Math.min(100, Math.max(0, (accumulator.used / accumulator.total) * 100)) : 0;

  return (
    <div className="mt-2">
      <span className="text-xs text-brand-secondary mb-1">{caption}</span>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.financial.track }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: fillColor }} />
      </div>
    </div>
  );
}
