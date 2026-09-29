/**
 * Documents feature types. The app re-exports DocumentMetadata/DocumentListData
 * from benefits/types; they are copied here verbatim so this slice does not
 * depend on another agent's folder.
 */

export interface DocumentMetadata {
  id: string;
  title: string;
  category: string;
  contentType: string;
  fileSize?: number;
  createdDate: string;
  containsPhi: boolean;
}

export interface DocumentListData {
  documents: DocumentMetadata[];
}

/**
 * Category values returned by the API for DocumentMetadata.category.
 * Use this union for display logic rather than comparing raw strings.
 */
export type DocumentCategory = "PlanDocument" | "TaxForm" | "Legal" | string;
