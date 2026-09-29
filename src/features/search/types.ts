/**
 * Search feature types — Provider, Facility, Pharmacy.
 * These match the API DTOs exactly (same field names, same shapes).
 *
 * For .NET devs: these are the client-side equivalents of the API response DTOs
 * in DMBA.Mobile.Api/Models/SearchResponses.cs
 */

export interface ProviderSummary {
  id: string;
  npi: string;
  firstName: string;
  lastName: string;
  specialty: string;
  credentials: string;
  isInNetwork: boolean;
  acceptingNewPatients: boolean;
  averageRating: number;
  reviewCount: number;
  distanceMiles: number | null;
  phone: string;
  estimatedVisitCost: number | null;
  latitude: number;
  longitude: number;
}

export interface ProviderDetail extends ProviderSummary {
  email: string | null;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  boardCertifications: string | null;
  medicalSchool: string | null;
  yearsExperience: number | null;
  about: string | null;
  languages: string[];
  hospitalAffiliations: string[];
  conditionsTreated: string[];
  officeHours: Record<string, string> | null;
}

export interface FacilitySummary {
  id: string;
  name: string;
  facilityType: string;
  isInNetwork: boolean;
  averageRating: number;
  reviewCount: number;
  distanceMiles: number | null;
  phone: string;
  address: string;
  services: string[];
  isOpen24Hours: boolean;
  latitude: number;
  longitude: number;
}

export interface FacilityDetail extends FacilitySummary {
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  hours: Record<string, string> | null;
  beds: number | null;
}

export interface PharmacySummary {
  id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  distanceMiles: number | null;
  is24Hours: boolean;
  isInNetwork: boolean;
  hours: string | null;
}

export interface PaginatedResponse<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  items: T[];
}

// Search parameter interfaces
export interface ProviderSearchParams {
  q?: string;
  specialty?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  acceptingNewPatients?: boolean;
  isInNetwork?: boolean;
  gender?: string;
  language?: string;
}

export interface FacilitySearchParams {
  q?: string;
  type?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  isInNetwork?: boolean;
}

export interface PharmacySearchParams {
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  q?: string;
  zip?: string;
}

export type SearchTab = "providers" | "facilities" | "pharmacies";
export type ViewMode = "list" | "map";

/** Shared location props passed from SearchScreen to geo-enabled tabs */
export interface SharedLocationProps {
  zip: string;
  handleZipChange: (text: string) => void;
  location: { lat: number; lng: number } | null;
  isLocating: boolean;
  handleUseMyLocation: () => void;
  locationActive?: boolean;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
}
