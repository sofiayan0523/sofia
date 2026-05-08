import { zh, type TranslationKey } from "./zh";
import { en } from "./en";

export type Lang = "zh" | "en";

const dictionaries: Record<Lang, Record<TranslationKey, string>> = { zh, en };

export const DEFAULT_LANG: Lang = "zh";

/**
 * Get a translator bound to a specific language.
 * Usage in .astro file:
 *   const t = getTranslations("zh");
 *   {t("nav.home")}
 */
export function getTranslations(lang: Lang = DEFAULT_LANG) {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
  return (key: TranslationKey, vars?: Record<string, string | number>) => {
    let value = dict[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  };
}

export { zh, en };
export type { TranslationKey };
