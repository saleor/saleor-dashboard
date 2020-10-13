/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CategoryTranslations
// ====================================================

export interface CategoryTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface CategoryTranslations_translations_edges_node_CategoryTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CategoryTranslations_translations_edges_node_CategoryTranslatableContent_translation {
  __typename: "CategoryTranslation";
  id: string;
  descriptionJson: any;
  language: CategoryTranslations_translations_edges_node_CategoryTranslatableContent_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslations_translations_edges_node_CategoryTranslatableContent_category {
  __typename: "Category";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CategoryTranslations_translations_edges_node_CategoryTranslatableContent {
  __typename: "CategoryTranslatableContent";
  translation: CategoryTranslations_translations_edges_node_CategoryTranslatableContent_translation | null;
  category: CategoryTranslations_translations_edges_node_CategoryTranslatableContent_category | null;
}

export type CategoryTranslations_translations_edges_node = CategoryTranslations_translations_edges_node_ProductTranslatableContent | CategoryTranslations_translations_edges_node_CategoryTranslatableContent;

export interface CategoryTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: CategoryTranslations_translations_edges_node;
}

export interface CategoryTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CategoryTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: CategoryTranslations_translations_edges[];
  pageInfo: CategoryTranslations_translations_pageInfo;
}

export interface CategoryTranslations {
  translations: CategoryTranslations_translations | null;
}

export interface CategoryTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
