/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductVariantTranslationFragment
// ====================================================

export interface ProductVariantTranslationFragment_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantTranslationFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductVariantTranslationFragment_translation {
  __typename: "ProductVariantTranslation";
  id: string;
  name: string;
  language: ProductVariantTranslationFragment_translation_language;
}

export interface ProductVariantTranslationFragment_attributeValues_attributeValue {
  __typename: "AttributeValue";
  id: string;
}

export interface ProductVariantTranslationFragment_attributeValues_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductVariantTranslationFragment_attributeValues_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
  language: ProductVariantTranslationFragment_attributeValues_translation_language;
}

export interface ProductVariantTranslationFragment_attributeValues {
  __typename: "AttributeValueTranslatableContent";
  id: string;
  name: string;
  richText: any | null;
  attributeValue: ProductVariantTranslationFragment_attributeValues_attributeValue | null;
  translation: ProductVariantTranslationFragment_attributeValues_translation | null;
}

export interface ProductVariantTranslationFragment {
  __typename: "ProductVariantTranslatableContent";
  productVariant: ProductVariantTranslationFragment_productVariant | null;
  name: string;
  translation: ProductVariantTranslationFragment_translation | null;
  attributeValues: ProductVariantTranslationFragment_attributeValues[];
}
