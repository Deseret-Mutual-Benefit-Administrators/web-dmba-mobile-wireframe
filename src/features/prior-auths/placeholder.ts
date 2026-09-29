/**
 * Static placeholder data for the prior-auth slice — generic, fictitious,
 * shaped by `types.ts`. Detail ids: approved, denied, pending (In Progress),
 * submitted, closed. Any other id shows the approved one.
 */
import type { DeterminationLetterFields, PriorAuthDetail } from "./types";

const SELF = { memberId: "M-000001", member: "Jordan Avery" };
const SPOUSE = { memberId: "M-000002", member: "Sam Avery" };

export const placeholderPriorAuthDetails: PriorAuthDetail[] = [
  {
    id: "submitted", displayId: "PA-2026-001", service: "CT scan, abdomen", provider: "Lakeside Imaging Center",
    ...SELF, requestDate: "2026-02-28", dateNeeded: "2026-03-20", lineCount: 1, statusBucket: "Submitted",
    externalStatus: "Submitted", diagnosis: "Abdominal pain", requestingPhysician: "Dr. Casey Morgan, MD", lines: [],
  },
  {
    id: "approved", displayId: "PA-2026-002", service: "Physical therapy", provider: "Riverside Physical Therapy",
    ...SPOUSE, requestDate: "2026-02-09", dateNeeded: "2026-02-20", decisionDate: "2026-02-13", lineCount: 1,
    statusBucket: "Approved", externalStatus: "Approved", diagnosis: "Knee strain", requestingPhysician: "Dr. Taylor Brooks, MD",
    authorizationNumber: "AUTH-000123", validThrough: "2026-08-19", lines: [],
  },
  {
    id: "pending", displayId: "PA-2026-003", service: "Sleep study", provider: "Northside Sleep Center",
    ...SELF, requestDate: "2026-02-02", dateNeeded: "2026-03-01", lineCount: 1, statusBucket: "In Progress",
    externalStatus: "In Review", diagnosis: "Sleep disturbance", requestingPhysician: "Dr. Casey Morgan, MD", lines: [],
  },
  {
    id: "denied", displayId: "PA-2026-004", service: "Imaging, lower back", provider: "Dr. Alex Rivera, MD",
    ...SELF, requestDate: "2026-01-20", dateNeeded: "2026-02-05", decisionDate: "2026-01-27", lineCount: 2,
    statusBucket: "Denied", externalStatus: "Denied", diagnosis: "Back pain", requestingPhysician: "Dr. Alex Rivera, MD",
    denialReason: "Does not meet medical criteria", lines: [],
  },
  {
    id: "closed", displayId: "PA-2026-005", service: "Allergy testing", provider: "Valley Family Clinic",
    ...SPOUSE, requestDate: "2026-01-10", lineCount: 1, statusBucket: "Closed", externalStatus: "Closed",
    diagnosis: "Seasonal allergies", requestingPhysician: "Dr. Taylor Brooks, MD", lines: [],
  },
];

export function placeholderPriorAuthDetail(id: string): PriorAuthDetail {
  return placeholderPriorAuthDetails.find((a) => a.id === id) ?? placeholderPriorAuthDetails[1];
}

export function placeholderDeterminationLetter(id: string): DeterminationLetterFields | null {
  const auth = placeholderPriorAuthDetail(id);
  if (auth.statusBucket === "Approved") {
    return {
      authorizationId: auth.id, authorizationNumber: auth.authorizationNumber ?? null, decision: "Approved",
      generatedDate: "2026-02-13", memberName: auth.member, providerName: auth.requestingPhysician,
      procedureDescription: auth.service, summaryText: "Physical therapy sessions approved. Up to 12 visits authorized.",
      criteriaNotMetText: null, effectiveDates: { validFrom: "2026-02-13", validThrough: "2026-08-19" }, nextSteps: null,
    };
  }
  if (auth.statusBucket === "Denied") {
    return {
      authorizationId: auth.id, authorizationNumber: null, decision: "Not approved",
      generatedDate: "2026-01-27", memberName: auth.member, providerName: auth.requestingPhysician,
      procedureDescription: auth.service, summaryText: "The request was reviewed and was not approved.",
      criteriaNotMetText: "A trial of conservative treatment was not documented.", effectiveDates: null,
      nextSteps: "Talk with your provider about other options, or contact DMBA with questions.",
    };
  }
  return null;
}
