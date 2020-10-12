/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SaleTranslationUpdateFragment
// ====================================================

export interface SaleTranslationUpdateFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface SaleTranslationUpdateFragment_translation {
  __typename: "SaleTranslation";
  id: string;
  language: SaleTranslationUpdateFragment_translation_language;
  name: string | null;
}

export interface SaleTranslationUpdateFragment {
  __typename: "Sale";
  id: string;
  name: string;
  translation: SaleTranslationUpdateFragment_translation | null;
}
