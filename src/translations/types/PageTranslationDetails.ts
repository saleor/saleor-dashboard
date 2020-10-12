/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageTranslationDetails
// ====================================================

export interface PageTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface PageTranslationDetails_translation_PageTranslatableContent_page {
  __typename: "Page";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
}

export interface PageTranslationDetails_translation_PageTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface PageTranslationDetails_translation_PageTranslatableContent_translation {
  __typename: "PageTranslation";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  language: PageTranslationDetails_translation_PageTranslatableContent_translation_language;
}

export interface PageTranslationDetails_translation_PageTranslatableContent {
  __typename: "PageTranslatableContent";
  page: PageTranslationDetails_translation_PageTranslatableContent_page | null;
  translation: PageTranslationDetails_translation_PageTranslatableContent_translation | null;
}

export type PageTranslationDetails_translation = PageTranslationDetails_translation_ProductTranslatableContent | PageTranslationDetails_translation_PageTranslatableContent;

export interface PageTranslationDetails {
  translation: PageTranslationDetails_translation | null;
}

export interface PageTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
