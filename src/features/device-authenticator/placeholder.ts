import type { OktaEnrollment } from "./types";

/** A generic device label and set-up date. */
export const placeholderEnrollment: OktaEnrollment = {
  deviceLabel: "iPhone",
  createdAt: "2026-09-10T00:00:00",
};

/** What the approval screen shows about a sign-in attempt — never member data. */
export const placeholderChallenge = {
  origin: "Safari on macOS · Salt Lake City, UT",
  issuedAtLabel: "Sep 29, 2026 at 9:41 AM",
  secondsRemaining: 45 as number | null,
};
