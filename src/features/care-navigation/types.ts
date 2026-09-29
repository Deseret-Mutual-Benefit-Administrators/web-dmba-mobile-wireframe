/**
 * Care Navigation feature types.
 * See ADR-135 for the architecture decisions behind this feature.
 */

/** Ionicons name, resolved through `src/shared/icons.tsx` on the web. */
type IoniconName = string;
/** The app bundles a photo; the wireframe has none (initials avatar only). */
type ImageSourcePropType = string | null;
/** `messaging.topics.*` key — the messaging feature belongs to another slice. */
type MessageTopic = string;

/**
 * The 3-tab strip under Benefits > Navigation. Wellness was removed from the
 * strip 2026-08-21 (ADR-141 #5) — it returns only with a confirmed program.
 */
export type CareNavSubTab = "financial" | "mentalHealth" | "clinical";

export interface CareNavSubTabConfig {
  key: CareNavSubTab;
  labelKey: string;
  icon: IoniconName;
}

/**
 * A member of the Financial Planning team, shown in the "Meet the team"
 * strip. Slim by design — no bio modal, no route (ADR-135 #5 decisions).
 */
export interface Planner {
  id: string;
  name: string;
  credentials: string;
  /** Two-letter fallback shown by PlannerAvatar if the photo fails to load. */
  initials: string;
  photo: ImageSourcePropType;
}

/** An external resource link rendered in an expandable CollapsibleSection row. */
export interface ResourceLink {
  key: string;
  labelKey: string;
  descriptionKey: string;
  url: string;
}

/**
 * A generic checklist item definition. Definitions are a static registry
 * (i18n only); only completion state is server-side (ADR-135 #5).
 */
export interface ChecklistItem {
  key: string;
  labelKey: string;
  descriptionKey: string;
}

/** Visual tone of an InfoCard callout: info (blue), warning (amber), excluded (red). */
export type CalloutTone = "info" | "warning" | "excluded";

/**
 * A static informational card (ADR-141 #7). Pure data — every string is an
 * i18n key so the registry test can prove it resolves in en AND es.
 *
 * CTA kinds:
 *   - "seeCosts": switches BenefitsScreen to the Coverage tab — per-plan cost
 *     share lives there, never on a static pane (ADR-141 #3).
 *   - "message": opens compose pre-set to `topic` via `SendMessageCta`
 *     (Secure Messaging shipped v0.11, ADR-134; superseded ADR-141 #6).
 */
export interface InfoCardDef {
  key: string;
  icon: IoniconName;
  titleKey: string;
  summaryKey: string;
  bulletsHeadingKey?: string;
  bulletKeys?: string[];
  callouts?: { tone: CalloutTone; textKey: string }[];
  cta?: { kind: "seeCosts" } | { kind: "message"; labelKey: string; topic: MessageTopic };
}

/** A "when to reach out" scenario row on the Clinical pane. */
export interface ScenarioDef {
  key: string;
  titleKey: string;
  descriptionKey: string;
}
