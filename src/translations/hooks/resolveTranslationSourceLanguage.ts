import { type LanguageCodeEnum, type LanguageFragment } from "@dashboard/graphql";

export interface TranslationSourceLanguage {
  language: LanguageFragment | null;
  useOriginalLabel: boolean;
}

/**
 * Base translatable fields come from the entity itself — Saleor stores them without
 * a language code ("original translatable fields" in the API). Shop languages only
 * define which translations exist, not which language content was authored in.
 */
export function resolveTranslationSourceLanguage(
  _languages: LanguageFragment[],
  _targetLanguageCode: LanguageCodeEnum | string,
): TranslationSourceLanguage {
  return { language: null, useOriginalLabel: true };
}
