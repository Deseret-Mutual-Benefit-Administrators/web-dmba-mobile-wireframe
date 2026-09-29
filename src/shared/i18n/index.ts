/**
 * Minimal i18next-compatible `t()` over the app's own `en.json` (copied verbatim).
 *
 * - Dotted keys: `t("benefits.title")`.
 * - `{{name}}` interpolation from `params`.
 * - Plurals the i18next way: with `params.count`, `key_one` / `key_other` are
 *   tried before the bare key (`key_zero` too when count is 0).
 * - A missing key returns the key itself, so a wrong key is visible on screen
 *   and never crashes the page.
 *
 * `useTranslation()` returns `{ t }`, so ported components keep
 * `const { t } = useTranslation();` unchanged.
 */
import en from "./en.json";

type Params = Record<string, string | number>;
type Tree = { [key: string]: string | Tree };

const dictionary = en as unknown as Tree;

function lookup(key: string): unknown {
  let node: unknown = dictionary;
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

export function t(key: string, params?: Params): string {
  const candidates: string[] = [];
  const count = params?.count;
  if (typeof count === "number") {
    if (count === 0) candidates.push(`${key}_zero`);
    candidates.push(count === 1 ? `${key}_one` : `${key}_other`);
  }
  candidates.push(key);

  for (const candidate of candidates) {
    const value = lookup(candidate);
    if (typeof value === "string") return interpolate(value, params);
  }
  return key;
}

/** Drop-in for react-i18next's hook. `i18n.language` is fixed to English here. */
export function useTranslation() {
  return { t, i18n: { language: "en" } };
}

/** Mirrors the app's `import i18n from "@/src/shared/i18n"; i18n.t(...)` usage. */
const i18n = { t, language: "en" };
export default i18n;
