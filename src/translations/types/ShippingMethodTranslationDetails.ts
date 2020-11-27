/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShippingMethodTranslationDetails
// ====================================================

export interface ShippingMethodTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent_translation {
  __typename: "ShippingMethodTranslation";
  id: string;
  language: ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent_translation_language;
  name: string | null;
}

export interface ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent {
  __typename: "ShippingMethodTranslatableContent";
  shippingMethod: ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent_shippingMethod | null;
  id: string;
  name: string;
  translation: ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent_translation | null;
}

export type ShippingMethodTranslationDetails_translation = ShippingMethodTranslationDetails_translation_ProductTranslatableContent | ShippingMethodTranslationDetails_translation_ShippingMethodTranslatableContent;

export interface ShippingMethodTranslationDetails {
  translation: ShippingMethodTranslationDetails_translation | null;
}

export interface ShippingMethodTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
