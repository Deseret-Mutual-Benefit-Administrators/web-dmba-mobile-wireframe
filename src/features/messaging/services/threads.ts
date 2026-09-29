/** Stand-in for the app's `messaging/services/threads.ts` (not in the extract). */
export interface RelativeTimeToken {
  unit: "justNow" | "minutes" | "hours" | "days" | "date";
  count?: number;
  isoTimestamp?: string;
}

export function relativeTimeToken(iso: string, now: number = Date.now()): RelativeTimeToken {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return { unit: "justNow" };
  if (minutes < 60) return { unit: "minutes", count: minutes };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { unit: "hours", count: hours };
  const days = Math.floor(hours / 24);
  if (days < 7) return { unit: "days", count: days };
  return { unit: "date", isoTimestamp: iso };
}

export function previewLine(preview: string | null): string {
  return (preview ?? "").replace(/\s+/g, " ").trim();
}
