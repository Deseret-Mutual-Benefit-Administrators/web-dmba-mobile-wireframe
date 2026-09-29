/** Static placeholder data for the Submit-a-Claim wizard — generic and fictitious. */
import type { ClaimSubmissionPatientOption } from "./types";

export const placeholderPatientOptions: ClaimSubmissionPatientOption[] = [
  { memberId: "M-000001", label: "Jordan Avery", isSelf: true },
  { memberId: "M-000002", label: "Sam Avery", secondary: "Spouse", isSelf: false },
  { memberId: "M-000003", label: "Riley Avery", secondary: "Child", isSelf: false },
];

/** File names the wireframe "attaches" when a capture/library/PDF button is pressed. */
export const placeholderAttachmentFiles = {
  camera: { fileName: "photo-0001.jpg", contentType: "image/jpeg", sizeBytes: 820_000 },
  library: { fileName: "IMG_0042.jpg", contentType: "image/jpeg", sizeBytes: 1_400_000 },
  pdf: { fileName: "itemized-bill.pdf", contentType: "application/pdf", sizeBytes: 96_000 },
} as const;
