/**
 * Stand-in for the app's `messaging/services/requestContext.ts` — turns a typed
 * thread's `contextJson` into the "About this request" card's rows.
 */
import type { MessageThreadKind } from "../types";

export interface RequestContextRow {
  labelKey: string;
  value?: string;
  valueKey?: string;
}

export interface RequestContextDescription {
  titleKey: string;
  rows: RequestContextRow[];
}

export function parseContextJson(json: string | null): Record<string, unknown> | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function row(labelKey: string, value: unknown): RequestContextRow[] {
  return typeof value === "string" && value !== "" ? [{ labelKey, value }] : [];
}

export function describeRequestContext(
  kind: MessageThreadKind,
  context: Record<string, unknown> | null
): RequestContextDescription | null {
  if (!context) return null;
  const k = "messaging.requestContext";
  if (kind === "claimSubmission") {
    return {
      titleKey: `${k}.claimSubmission.title`,
      rows: [
        ...row(`${k}.patientName`, context.patientName),
        ...row(`${k}.providerName`, context.providerName),
        ...row(`${k}.serviceDate`, context.serviceDate),
        ...row(`${k}.amountBilled`, context.amountBilled),
        ...row(`${k}.serviceDescription`, context.serviceDescription),
        ...(typeof context.alreadyPaid === "boolean"
          ? [{ labelKey: `${k}.alreadyPaid`, valueKey: context.alreadyPaid ? `${k}.alreadyPaidYes` : `${k}.alreadyPaidNo` }]
          : []),
      ],
    };
  }
  if (kind === "denialQuestion") {
    return {
      titleKey: `${k}.denialQuestion.title`,
      rows: [
        ...row(`${k}.priorAuthId`, context.priorAuthId),
        ...row(`${k}.serviceDate`, context.serviceDate),
        ...row(`${k}.providerName`, context.providerName),
      ],
    };
  }
  if (kind === "chatHandoff") {
    return {
      titleKey: `${k}.chatHandoff.title`,
      rows: [
        ...(typeof context.turnCount === "number" ? [{ labelKey: `${k}.chatHandoff.turnCount`, value: String(context.turnCount) }] : []),
        ...(Array.isArray(context.citedTopics)
          ? [{ labelKey: `${k}.chatHandoff.citedTopics`, value: (context.citedTopics as string[]).join(", ") }]
          : []),
      ],
    };
  }
  return null;
}
