/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductTypeTranslationDetails
// ====================================================

export interface ProductTypeTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ProductTypeTranslationDetails_translation_AttributeTranslatableContent_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface ProductTypeTranslationDetails_translation_AttributeTranslatableContent_attribute_values_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
}

export interface ProductTypeTranslationDetails_translation_AttributeTranslatableContent_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  translation: ProductTypeTranslationDetails_translation_AttributeTranslatableContent_attribute_values_translation | null;
}

export interface ProductTypeTranslationDetails_translation_AttributeTranslatableContent_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductTypeTranslationDetails_translation_AttributeTranslatableContent_attribute_values | null)[] | null;
}

export interface ProductTypeTranslationDetails_translation_AttributeTranslatableContent {
  __typename: "AttributeTranslatableContent";
  translation: ProductTypeTranslationDetails_translation_AttributeTranslatableContent_translation | null;
  attribute: ProductTypeTranslationDetails_translation_AttributeTranslatableContent_attribute | null;
}

export type ProductTypeTranslationDetails_translation = ProductTypeTranslationDetails_translation_ProductTranslatableContent | ProductTypeTranslationDetails_translation_AttributeTranslatableContent;

export interface ProductTypeTranslationDetails {
  translation: ProductTypeTranslationDetails_translation | null;
}

export interface ProductTypeTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
