/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductVariantTranslationDetails
// ====================================================

export interface ProductVariantTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_translation {
  __typename: "ProductVariantTranslation";
  id: string;
  name: string;
  language: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_translation_language;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues_attributeValue {
  __typename: "AttributeValue";
  id: string;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
  language: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues_translation_language;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues {
  __typename: "AttributeValueTranslatableContent";
  id: string;
  name: string;
  richText: any | null;
  attributeValue: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues_attributeValue | null;
  translation: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues_translation | null;
}

export interface ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent {
  __typename: "ProductVariantTranslatableContent";
  productVariant: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_productVariant | null;
  name: string;
  translation: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_translation | null;
  attributeValues: ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent_attributeValues[];
}

export type ProductVariantTranslationDetails_translation = ProductVariantTranslationDetails_translation_ProductTranslatableContent | ProductVariantTranslationDetails_translation_ProductVariantTranslatableContent;

export interface ProductVariantTranslationDetails {
  translation: ProductVariantTranslationDetails_translation | null;
}

export interface ProductVariantTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
