/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageTranslationFragment
// ====================================================

export interface PageTranslationFragment_page {
  __typename: "Page";
  id: string;
  content: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
}

export interface PageTranslationFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface PageTranslationFragment_translation {
  __typename: "PageTranslation";
  id: string;
  content: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  language: PageTranslationFragment_translation_language;
}

export interface PageTranslationFragment {
  __typename: "PageTranslatableContent";
  page: PageTranslationFragment_page | null;
  translation: PageTranslationFragment_translation | null;
}
