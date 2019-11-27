/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PageTranslatableFragment
// ====================================================

export interface PageTranslatableFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface PageTranslatableFragment_translation {
  __typename: "PageTranslation";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  language: PageTranslatableFragment_translation_language;
}

export interface PageTranslatableFragment {
  __typename: "PageTranslatableContent";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  translation: PageTranslatableFragment_translation | null;
}
