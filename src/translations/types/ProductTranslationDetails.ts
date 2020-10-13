/* tslint:disable */
/* eslint-disable */
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
  descriptionJson: any;
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
  descriptionJson: any;
  language: ProductTranslationDetails_translation_ProductTranslatableContent_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface ProductTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent";
  product: ProductTranslationDetails_translation_ProductTranslatableContent_product | null;
  translation: ProductTranslationDetails_translation_ProductTranslatableContent_translation | null;
}

export type ProductTranslationDetails_translation = ProductTranslationDetails_translation_CollectionTranslatableContent | ProductTranslationDetails_translation_ProductTranslatableContent;

export interface ProductTranslationDetails {
  translation: ProductTranslationDetails_translation | null;
}

export interface ProductTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
