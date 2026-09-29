/** FAQ entries built from the `settings.help.faq.*` keys in en.json (the app's faq.ts was not in the extract). */
export interface FaqEntry {
  id: string;
  questionKey: string;
  answerKey: string;
}

const IDS = [
  "viewIdCard",
  "findProvider",
  "fileClaim",
  "checkDeductible",
  "contactDmba",
  "changeLanguage",
  "enableBiometric",
  "emergency",
] as const;

export const FAQ_ENTRIES: FaqEntry[] = IDS.map((id) => ({
  id,
  questionKey: `settings.help.faq.${id}.question`,
  answerKey: `settings.help.faq.${id}.answer`,
}));
