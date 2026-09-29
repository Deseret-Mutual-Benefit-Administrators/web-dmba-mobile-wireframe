/**
 * Local stand-in for the app's `spending-claims/services/categoryGuidance.ts`:
 * our clearer label, examples and helper line per vendor service-category code,
 * falling back cleanly (null) for a code we have never seen.
 */
const KEY_BY_CODE: Record<string, string> = {
  MEDICAL: "medical",
  DENTAL: "dental",
  VISION: "vision",
  RX: "rx",
  SUPPLIES: "supplies",
  DAY: "day",
};

const HAS_LABEL = new Set(["supplies"]);
const HAS_HELPER = new Set(["medical", "supplies", "day"]);

const ICON_BY_KEY: Record<string, string> = {
  medical: "medkit-outline",
  dental: "happy-outline",
  vision: "eye-outline",
  rx: "flask-outline",
  supplies: "bandage-outline",
  day: "people-outline",
};

function keyFor(code: string): string | null {
  return KEY_BY_CODE[code.trim().toUpperCase()] ?? null;
}

export function getCategoryLabelKey(code: string): string | null {
  const key = keyFor(code);
  return key && HAS_LABEL.has(key) ? `spendingClaims.categories.${key}.label` : null;
}

export function getCategoryHelperKey(code: string): string | null {
  const key = keyFor(code);
  return key && HAS_HELPER.has(key) ? `spendingClaims.categories.${key}.helper` : null;
}

export function getCategoryExamplesKey(code: string): string | null {
  const key = keyFor(code);
  return key ? `spendingClaims.categories.${key}.examples` : null;
}

export function getCategoryIconName(code: string): string {
  const key = keyFor(code);
  return (key && ICON_BY_KEY[key]) || "receipt-outline";
}

/** Dependent Care pays only from what payroll has deducted so far. */
export function isPayrollFundedCategory(code: string): boolean {
  return keyFor(code) === "day";
}

export function getCategoryRequirementKeys(code: string): string[] {
  return keyFor(code) === "day"
    ? ["spendingClaims.whatYouNeed.day.providerTaxId", "spendingClaims.whatYouNeed.day.dependentDetails"]
    : [];
}
