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
  seoTitle: string | null;
  seoDescription: string | null;
  name: string | null;
  description: any | null;
  language: ProductTranslationFragment_translation_language;
}

export interface ProductTranslationFragment_attributeValues_attributeValue {
  __typename: "AttributeValue";
  id: string;
}

export interface ProductTranslationFragment_attributeValues_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductTranslationFragment_attributeValues_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
  language: ProductTranslationFragment_attributeValues_translation_language;
}

export interface ProductTranslationFragment_attributeValues {
  __typename: "AttributeValueTranslatableContent";
  id: string;
  name: string;
  richText: any | null;
  attributeValue: ProductTranslationFragment_attributeValues_attributeValue | null;
  translation: ProductTranslationFragment_attributeValues_translation | null;
}

export interface ProductTranslationFragment {
  __typename: "ProductTranslatableContent";
  product: ProductTranslationFragment_product | null;
  translation: ProductTranslationFragment_translation | null;
  attributeValues: ProductTranslationFragment_attributeValues[];
}
