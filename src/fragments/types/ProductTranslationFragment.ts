/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductTranslationFragment
// ====================================================

export interface ProductTranslationFragment_product {
  __typename: "Product";
  id: string;
  name: string;
  description: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface ProductTranslationFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductTranslationFragment_translation {
  __typename: "ProductTranslation";
  id: string;
  description: any | null;
  language: ProductTranslationFragment_translation_language;
  name: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface ProductTranslationFragment {
  __typename: "ProductTranslatableContent";
  product: ProductTranslationFragment_product | null;
  translation: ProductTranslationFragment_translation | null;
}
