/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SaleTranslationDetails
// ====================================================

export interface SaleTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface SaleTranslationDetails_translation_SaleTranslatableContent_sale {
  __typename: "Sale";
  id: string;
  name: string;
}

export interface SaleTranslationDetails_translation_SaleTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface SaleTranslationDetails_translation_SaleTranslatableContent_translation {
  __typename: "SaleTranslation";
  id: string;
  language: SaleTranslationDetails_translation_SaleTranslatableContent_translation_language;
  name: string | null;
}

export interface SaleTranslationDetails_translation_SaleTranslatableContent {
  __typename: "SaleTranslatableContent";
  sale: SaleTranslationDetails_translation_SaleTranslatableContent_sale | null;
  translation: SaleTranslationDetails_translation_SaleTranslatableContent_translation | null;
}

export type SaleTranslationDetails_translation = SaleTranslationDetails_translation_ProductTranslatableContent | SaleTranslationDetails_translation_SaleTranslatableContent;

export interface SaleTranslationDetails {
  translation: SaleTranslationDetails_translation | null;
}

export interface SaleTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
