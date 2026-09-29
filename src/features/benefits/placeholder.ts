/**
 * Static sample data for the Benefits slice, shaped by `types.ts`. Every row is
 * obviously sample content — nothing here states a real plan benefit.
 * `?state=loading|empty|error` on the URL drives the screen's non-happy states.
 */
import { useSearchParams } from "react-router-dom";
import type {
  BenefitCategoryGroup,
  BenefitTopicDetail,
  BenefitTopicSummary,
  DentalBenefitsData,
  MedicalBenefitsData,
  PharmacyBenefitsData,
  ProcedureCode,
} from "./types";

export type PlaceholderState = "loading" | "empty" | "error" | undefined;

/** Reads `?state=` — the switch every placeholder-backed hook in this slice obeys. */
export function usePlaceholderState(): PlaceholderState {
  const [params] = useSearchParams();
  const state = params.get("state");
  return state === "loading" || state === "empty" || state === "error" ? state : undefined;
}

const DISCLAIMER =
  "Sample disclaimer text. This wireframe shows sample coverage rows only — it does not describe any real plan.";

function benefit(
  planId: string,
  category: string,
  topicKey: string,
  name: string,
  extra: Partial<BenefitCategoryGroup["benefits"][number]> = {}
): BenefitCategoryGroup["benefits"][number] {
  return {
    id: `${topicKey}#planFacts:${planId}`,
    topicKey,
    category,
    planId,
    name,
    inNetworkCost: "Sample cost",
    outOfNetworkCost: "Sample cost",
    requiresPreauth: null,
    notes: "Sample detail text",
    copay: null,
    covered: null,
    aliases: [],
    ...extra,
  };
}

function basics(prefix: string): BenefitTopicSummary[] {
  return [
    { topicKey: `${prefix}-basic-1`, title: "Sample plan concept one", category: prefix, aliases: [] },
    { topicKey: `${prefix}-basic-2`, title: "Sample plan concept two", category: prefix, aliases: [] },
  ];
}

export const medicalData: MedicalBenefitsData = {
  planId: "sample-medical",
  planName: "Sample Medical Plan",
  coinsuranceInNetwork: 70,
  coinsuranceOutOfNetwork: 50,
  hasInNetworkDeductible: true,
  hasOutOfNetworkDeductible: true,
  planCategory: "PPO",
  basics: basics("medical"),
  disclaimer: DISCLAIMER,
  governingDocumentId: "sample-document",
  categories: [
    {
      category: "Sample coverage group A",
      benefits: [
        benefit("sample-medical", "medical", "medical-topic-1", "Sample coverage topic"),
        benefit("sample-medical", "medical", "medical-topic-2", "Sample topic that needs approval", {
          requiresPreauth: true,
        }),
        benefit("sample-medical", "medical", "medical-topic-3", "Sample topic with a copay", {
          copay: "Sample copay",
          notes: null,
        }),
      ],
    },
    {
      category: "Sample coverage group B",
      benefits: [
        benefit("sample-medical", "medical", "medical-topic-4", "Sample topic with no stated cost", {
          outOfNetworkCost: "",
        }),
        benefit("sample-medical", "medical", "medical-topic-5", "Sample excluded topic", {
          covered: false,
          notes: null,
        }),
      ],
    },
  ],
};

export const dentalData: DentalBenefitsData = {
  planId: "sample-dental",
  planName: "Sample Dental Plan",
  annualMax: 1000,
  deductible: 50,
  basics: basics("dental"),
  disclaimer: DISCLAIMER,
  governingDocumentId: "sample-document",
  categories: [
    {
      category: "Sample dental group",
      benefits: [
        benefit("sample-dental", "dental", "dental-topic-1", "Sample coverage topic"),
        benefit("sample-dental", "dental", "dental-topic-2", "Another sample coverage topic"),
      ],
    },
  ],
};

export const pharmacyData: PharmacyBenefitsData = {
  planId: "sample-pharmacy",
  planName: "Sample Pharmacy Benefit",
  pharmacyManager: "Sample pharmacy benefit manager",
  // Blank: the only phone numbers a wireframe may show are en.json's own.
  pharmacyPhone: "",
  basics: basics("pharmacy"),
  disclaimer: DISCLAIMER,
  governingDocumentId: null,
  categories: [
    {
      category: "Sample pharmacy group",
      benefits: [
        benefit("sample-pharmacy", "pharmacy", "pharmacy-topic-1", "Sample coverage topic"),
        benefit("sample-pharmacy", "pharmacy", "pharmacy-topic-2", "Sample specialty topic", {
          requiresPreauth: true,
        }),
      ],
    },
  ],
};

/** The lazy `GET /benefits/topics/{topicKey}` read, as sample data. */
export function topicDetailFor(topicKey: string, title: string, planId: string | undefined): BenefitTopicDetail {
  const isBasic = topicKey.includes("-basic-");
  return {
    topicKey,
    title,
    category: "medical",
    planId: planId ?? "sample-plan",
    sections: [
      {
        id: `${topicKey}#whatItIs`,
        kind: "whatItIs",
        planId: null,
        markdown: "Sample detail text explaining what this topic is. **Wireframe content only.**",
      },
      {
        id: `${topicKey}#needToKnow`,
        kind: "needToKnow",
        planId: null,
        markdown: "- Sample point one\n- Sample point two\n- Sample point three",
      },
      {
        id: `${topicKey}#planFacts:${planId}`,
        kind: "planFacts",
        planId: planId ?? null,
        markdown: "Not rendered on the page (the typed columns are).",
      },
    ],
    planFact: isBasic
      ? null
      : {
          covered: null,
          inNetworkCost: "Sample cost",
          outOfNetworkCost: "Sample cost",
          copay: null,
          deductible: "Sample deductible text",
          oopMax: "Sample out-of-pocket text",
          requiresPreauth: null,
          notes: null,
        },
  };
}

export const procedureCodes: ProcedureCode[] = [
  { id: "pc-1", code: "X0001", codeType: "CPT", category: "Sample", description: "Sample procedure description one", requiresPreauth: false },
  { id: "pc-2", code: "X0002", codeType: "CPT", category: "Sample", description: "Sample procedure description two", requiresPreauth: true },
  { id: "pc-3", code: "Y0003", codeType: "HCPCS", category: "Sample", description: "Sample supply description", requiresPreauth: false },
  { id: "pc-4", code: "Z0004", codeType: "ICD-10", category: "Sample", description: "Sample diagnosis description", requiresPreauth: false },
];
