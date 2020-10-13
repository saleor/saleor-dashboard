/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CategoryTranslationDetails
// ====================================================

export interface CategoryTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface CategoryTranslationDetails_translation_CategoryTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CategoryTranslationDetails_translation_CategoryTranslatableContent_translation {
  __typename: "CategoryTranslation";
  id: string;
  descriptionJson: any;
  language: CategoryTranslationDetails_translation_CategoryTranslatableContent_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslationDetails_translation_CategoryTranslatableContent_category {
  __typename: "Category";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslationDetails_translation_CategoryTranslatableContent {
  __typename: "CategoryTranslatableContent";
  translation: CategoryTranslationDetails_translation_CategoryTranslatableContent_translation | null;
  category: CategoryTranslationDetails_translation_CategoryTranslatableContent_category | null;
}

export type CategoryTranslationDetails_translation = CategoryTranslationDetails_translation_ProductTranslatableContent | CategoryTranslationDetails_translation_CategoryTranslatableContent;

export interface CategoryTranslationDetails {
  translation: CategoryTranslationDetails_translation | null;
}

export interface CategoryTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
