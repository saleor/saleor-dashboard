/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CollectionTranslationDetails
// ====================================================

export interface CollectionTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface CollectionTranslationDetails_translation_CollectionTranslatableContent_collection {
  __typename: "Collection";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionTranslationDetails_translation_CollectionTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CollectionTranslationDetails_translation_CollectionTranslatableContent_translation {
  __typename: "CollectionTranslation";
  id: string;
  descriptionJson: any;
  language: CollectionTranslationDetails_translation_CollectionTranslatableContent_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionTranslationDetails_translation_CollectionTranslatableContent {
  __typename: "CollectionTranslatableContent";
  collection: CollectionTranslationDetails_translation_CollectionTranslatableContent_collection | null;
  translation: CollectionTranslationDetails_translation_CollectionTranslatableContent_translation | null;
}

export type CollectionTranslationDetails_translation = CollectionTranslationDetails_translation_ProductTranslatableContent | CollectionTranslationDetails_translation_CollectionTranslatableContent;

export interface CollectionTranslationDetails {
  translation: CollectionTranslationDetails_translation | null;
}

export interface CollectionTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
