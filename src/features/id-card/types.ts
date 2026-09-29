/**
 * ID Card types — DTOs matching the API response shape.
 *
 * For .NET devs: these are the TypeScript equivalents of
 * IdCardResponse and IdCardsResponse in the API project.
 */

export interface IdCardData {
  id: number;
  cardType: string;
  planDisplayName: string;
  network: string | null;
  cardholderName: string;
  policyId: string;
  groupNumber: string;
  cardIssueDate: string;
  isActive: boolean;
  frontImageBase64: string;
  backImageBase64: string;
}

export interface IdCardsResponse {
  cards: IdCardData[];
}

/**
 * Wireframe stand-in for `CachedIdCard` (shared/services/secureCache in the app):
 * the card's metadata plus the paths of its two encrypted images. Here a path
 * is only a marker that the face exists; `null` renders the unavailable state.
 */
export type CachedIdCard = Omit<IdCardData, "frontImageBase64" | "backImageBase64"> & {
  frontImagePath: string | null;
  backImagePath: string | null;
};
