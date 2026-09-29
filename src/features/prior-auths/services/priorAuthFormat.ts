/**
 * Web stand-in for the app's `priorAuthFormat.ts` (not in the UI extract).
 * Icons and tones follow the status-badge doc comment in PriorAuthStatusBadge.
 */
import type { BadgeTone } from "@/src/shared/components/Badge";
import { colors } from "@/src/shared/theme/colors";
import type { PriorAuthStatusBucket } from "../types";

export interface StatusDisplay {
  icon: string;
  iconColor: string;
  labelKey: string;
}

const DISPLAY: Record<PriorAuthStatusBucket, StatusDisplay> = {
  Submitted: { icon: "cloud-upload-outline", iconColor: colors.tone.neutral.icon, labelKey: "priorAuth.statusSubmitted" },
  "In Progress": { icon: "time-outline", iconColor: colors.tone.info.icon, labelKey: "priorAuth.statusInProgress" },
  Approved: { icon: "checkmark-circle-outline", iconColor: colors.tone.success.icon, labelKey: "priorAuth.statusApproved" },
  Denied: { icon: "close-circle-outline", iconColor: colors.tone.error.icon, labelKey: "priorAuth.statusDenied" },
  Closed: { icon: "archive-outline", iconColor: colors.tone.neutral.icon, labelKey: "priorAuth.statusClosed" },
};

export function getStatusDisplay(bucket: PriorAuthStatusBucket): StatusDisplay {
  return DISPLAY[bucket];
}

const TONES: Record<PriorAuthStatusBucket, BadgeTone> = {
  Submitted: "neutral",
  "In Progress": "info",
  Approved: "success",
  Denied: "error",
  Closed: "neutral",
};

export function getStatusBadgeTone(bucket: PriorAuthStatusBucket): BadgeTone {
  return TONES[bucket];
}

export const badgeToneIconColor: Record<BadgeTone, string> = {
  success: colors.tone.success.icon,
  warning: colors.tone.warning.icon,
  error: colors.tone.error.icon,
  info: colors.tone.info.icon,
  neutral: colors.tone.neutral.icon,
};

/** "Feb 9, 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
