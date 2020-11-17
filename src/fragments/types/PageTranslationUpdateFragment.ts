/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageTranslationUpdateFragment
// ====================================================

export interface PageTranslationUpdateFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface PageTranslationUpdateFragment_translation {
  __typename: "PageTranslation";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  language: PageTranslationUpdateFragment_translation_language;
}

export interface PageTranslationUpdateFragment {
  __typename: "Page";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  translation: PageTranslationUpdateFragment_translation | null;
}
