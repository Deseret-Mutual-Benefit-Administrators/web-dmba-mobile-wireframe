/**
 * Static placeholder data for the Find Care slice, shaped by `types.ts`.
 * Every provider, facility, pharmacy, address and phone number is invented.
 */
import type {
  FacilityDetail,
  PharmacySummary,
  ProviderDetail,
} from "./types";

/** Screen state requested by `?state=loading|empty|error`; anything else is the normal render. */
export type PlaceholderState = "loading" | "empty" | "error" | "results" | null;

export function readState(params: URLSearchParams): PlaceholderState {
  const s = params.get("state");
  return s === "loading" || s === "empty" || s === "error" || s === "results" ? s : null;
}

/** The "location" a ZIP or Use My Location resolves to in the wireframe. */
export const PLACEHOLDER_LOCATION = { lat: 40.17, lng: -111.61 };
export const PLACEHOLDER_ZIP = "84663";

export const SPECIALTIES: string[] = [
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Obstetrics & Gynecology",
  "Orthopedic Surgery",
  "Physical Therapy",
];

export const PROVIDERS: ProviderDetail[] = [
  {
    id: "p1", npi: "sample-provider", firstName: "Riley", lastName: "Harmon", credentials: "MD",
    specialty: "Family Medicine", isInNetwork: true, acceptingNewPatients: true,
    averageRating: 4.6, reviewCount: 48, distanceMiles: 1.2, phone: "(801) 000-0000",
    estimatedVisitCost: null, latitude: 40.166, longitude: -111.61,
    email: null, addressLine1: "100 Main St, Suite 200", city: "Springville", state: "UT", zip: "84663",
    boardCertifications: "American Board of Family Medicine", medicalSchool: "Riverside School of Medicine",
    yearsExperience: 14,
    about: "Riverside Family Medicine offers care for patients of all ages, from well-child visits to chronic-condition management.",
    languages: ["English", "Spanish"], hospitalAffiliations: ["Canyon View Regional Hospital"],
    conditionsTreated: [],
    officeHours: {
      Monday: "8:00 AM – 5:00 PM", Tuesday: "8:00 AM – 5:00 PM", Wednesday: "8:00 AM – 5:00 PM",
      Thursday: "8:00 AM – 5:00 PM", Friday: "8:00 AM – 12:00 PM", Saturday: "Closed", Sunday: "Closed",
    },
  },
  {
    id: "p2", npi: "sample-provider-2", firstName: "Morgan", lastName: "Ellery", credentials: "DO",
    specialty: "Internal Medicine", isInNetwork: true, acceptingNewPatients: false,
    averageRating: 4.2, reviewCount: 31, distanceMiles: 2.8, phone: "(801) 000-0001",
    estimatedVisitCost: null, latitude: 40.18, longitude: -111.62,
    email: null, addressLine1: "250 Center St", city: "Springville", state: "UT", zip: "84663",
    boardCertifications: null, medicalSchool: null, yearsExperience: 8, about: null,
    languages: ["English"], hospitalAffiliations: [], conditionsTreated: [], officeHours: null,
  },
  {
    id: "p3", npi: "sample-provider-3", firstName: "Casey", lastName: "Lindqvist", credentials: "MD",
    specialty: "Pediatrics", isInNetwork: false, acceptingNewPatients: true,
    averageRating: 4.8, reviewCount: 72, distanceMiles: 4.5, phone: "(801) 000-0002",
    estimatedVisitCost: null, latitude: 40.2, longitude: -111.65,
    email: null, addressLine1: "40 Orchard Ln", city: "Mapleton", state: "UT", zip: "84664",
    boardCertifications: "American Board of Pediatrics", medicalSchool: null, yearsExperience: null, about: null,
    languages: ["English"], hospitalAffiliations: [], conditionsTreated: [], officeHours: null,
  },
];

export const FACILITIES: FacilityDetail[] = [
  {
    id: "sample-facility", name: "Canyon View Regional Hospital", facilityType: "Hospital",
    isInNetwork: true, averageRating: 4.3, reviewCount: 120, distanceMiles: 3.1, phone: "(801) 000-0010",
    address: "900 Canyon Rd, Springville, UT 84663",
    services: ["Emergency", "Surgery", "Maternity", "Imaging", "Laboratory"],
    isOpen24Hours: true, latitude: 40.17, longitude: -111.6,
    addressLine1: "900 Canyon Rd", city: "Springville", state: "UT", zip: "84663",
    hours: null, beds: 180,
  },
  {
    id: "sample-facility-2", name: "Canyon View Imaging", facilityType: "Imaging Center",
    isInNetwork: true, averageRating: 4.5, reviewCount: 22, distanceMiles: 1.9, phone: "(801) 000-0011",
    address: "320 Main St, Springville, UT 84663",
    services: ["MRI", "CT", "X-Ray"], isOpen24Hours: false, latitude: 40.16, longitude: -111.61,
    addressLine1: "320 Main St", city: "Springville", state: "UT", zip: "84663",
    hours: { Monday: "7:00 AM – 7:00 PM", Tuesday: "7:00 AM – 7:00 PM", Wednesday: "7:00 AM – 7:00 PM", Thursday: "7:00 AM – 7:00 PM", Friday: "7:00 AM – 5:00 PM" },
    beds: null,
  },
  {
    id: "sample-facility-3", name: "Maple Creek Urgent Care", facilityType: "Urgent Care",
    isInNetwork: false, averageRating: 4.0, reviewCount: 15, distanceMiles: 5.6, phone: "(801) 000-0012",
    address: "12 Maple Creek Dr, Mapleton, UT 84664",
    services: ["Walk-in Care"], isOpen24Hours: false, latitude: 40.13, longitude: -111.58,
    addressLine1: "12 Maple Creek Dr", city: "Mapleton", state: "UT", zip: "84664",
    hours: null, beds: null,
  },
];

export const PHARMACIES: PharmacySummary[] = [
  {
    id: "rx1", name: "Main Street Pharmacy", phone: "(801) 000-0020", address: "150 Main St",
    city: "Springville", state: "UT", distanceMiles: 0.8, is24Hours: false, isInNetwork: true,
    hours: "Mon–Fri 9:00 AM – 7:00 PM",
  },
  {
    id: "rx2", name: "Hillside Drug & Wellness", phone: "(801) 000-0021", address: "75 Hillside Ave",
    city: "Springville", state: "UT", distanceMiles: 2.3, is24Hours: true, isInNetwork: true, hours: null,
  },
  {
    id: "rx3", name: "Orchard Corner Pharmacy", phone: "(801) 000-0022", address: "8 Orchard Ln",
    city: "Mapleton", state: "UT", distanceMiles: 4.1, is24Hours: false, isInNetwork: false,
    hours: "Mon–Sat 10:00 AM – 6:00 PM",
  },
];

export function findProvider(npi: string | undefined): ProviderDetail {
  return PROVIDERS.find((p) => p.npi === npi) ?? PROVIDERS[0];
}

export function findFacility(id: string | undefined): FacilityDetail {
  return FACILITIES.find((f) => f.id === id) ?? FACILITIES[0];
}
