/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductTranslationDetails
// ====================================================

export interface ProductTranslationDetails_translation_CollectionTranslatableContent {
  __typename: "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_product {
  __typename: "Product";
  id: string;
  name: string;
  description: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_translation {
  __typename: "ProductTranslation";
  id: string;
  seoTitle: string | null;
  seoDescription: string | null;
  name: string | null;
  description: any | null;
  language: ProductTranslationDetails_translation_ProductTranslatableContent_translation_language;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues_attributeValue {
  __typename: "AttributeValue";
  id: string;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
  language: ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues_translation_language;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues {
  __typename: "AttributeValueTranslatableContent";
  id: string;
  name: string;
  richText: any | null;
  attributeValue: ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues_attributeValue | null;
  translation: ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues_translation | null;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent";
  product: ProductTranslationDetails_translation_ProductTranslatableContent_product | null;
  translation: ProductTranslationDetails_translation_ProductTranslatableContent_translation | null;
  attributeValues: ProductTranslationDetails_translation_ProductTranslatableContent_attributeValues[];
}

export type ProductTranslationDetails_translation = ProductTranslationDetails_translation_CollectionTranslatableContent | ProductTranslationDetails_translation_ProductTranslatableContent;

export interface ProductTranslationDetails {
  translation: ProductTranslationDetails_translation | null;
}

export interface ProductTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
