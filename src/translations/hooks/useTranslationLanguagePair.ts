import { type LanguageCodeEnum, type LanguageFragment } from "@dashboard/graphql";

import { resolveTranslationSourceLanguage } from "./resolveTranslationSourceLanguage";

interface UseTranslationLanguagePairParams {
  languages: LanguageFragment[];
  targetLanguageCode: LanguageCodeEnum | string;
}

interface TranslationLanguagePair {
  sourceLanguage: LanguageFragment | null;
  sourceUsesOriginalLabel: boolean;
  targetLanguage: LanguageFragment;
}

export function useTranslationLanguagePair({
  languages,
  targetLanguageCode,
}: UseTranslationLanguagePairParams): TranslationLanguagePair | null {
  const targetLanguage = languages.find(language => language.code === targetLanguageCode);

  if (!targetLanguage) {
    return null;
  }

  const { language: sourceLanguage, useOriginalLabel: sourceUsesOriginalLabel } =
    resolveTranslationSourceLanguage(languages, targetLanguageCode);

  return {
    sourceLanguage,
    sourceUsesOriginalLabel,
    targetLanguage,
  };
}
