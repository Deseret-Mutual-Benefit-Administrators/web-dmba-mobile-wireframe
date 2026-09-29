import type { DocumentListData } from "./types";

export const placeholderDocuments: DocumentListData = {
  documents: [
    { id: "doc-1", title: "Form 1095-B — Health Coverage (Sample Tax Year)", category: "TaxForm", contentType: "text/html", createdDate: "2026-02-01T12:00:00Z", containsPhi: true },
    { id: "doc-2", title: "Certificate of Coverage", category: "PlanDocument", contentType: "text/html", createdDate: "2026-01-02T12:00:00Z", containsPhi: false },
    { id: "doc-3", title: "Summary of Benefits and Coverage", category: "PlanDocument", contentType: "application/pdf", createdDate: "2026-01-02T12:00:00Z", containsPhi: false },
  ],
};
