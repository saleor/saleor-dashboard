/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CollectionTranslations
// ====================================================

export interface CollectionTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface CollectionTranslations_translations_edges_node_CollectionTranslatableContent_collection {
  __typename: "Collection";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionTranslations_translations_edges_node_CollectionTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  language: string;
}

export interface CollectionTranslations_translations_edges_node_CollectionTranslatableContent_translation {
  __typename: "CollectionTranslation";
  id: string;
  descriptionJson: any;
  language: CollectionTranslations_translations_edges_node_CollectionTranslatableContent_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionTranslations_translations_edges_node_CollectionTranslatableContent {
  __typename: "CollectionTranslatableContent";
  collection: CollectionTranslations_translations_edges_node_CollectionTranslatableContent_collection | null;
  translation: CollectionTranslations_translations_edges_node_CollectionTranslatableContent_translation | null;
}

export type CollectionTranslations_translations_edges_node = CollectionTranslations_translations_edges_node_ProductTranslatableContent | CollectionTranslations_translations_edges_node_CollectionTranslatableContent;

export interface CollectionTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: CollectionTranslations_translations_edges_node;
}

export interface CollectionTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CollectionTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: CollectionTranslations_translations_edges[];
  pageInfo: CollectionTranslations_translations_pageInfo;
}

export interface CollectionTranslations {
  translations: CollectionTranslations_translations | null;
}

export interface CollectionTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
