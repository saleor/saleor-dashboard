/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SaleTranslations
// ====================================================

export interface SaleTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface SaleTranslations_translations_edges_node_SaleTranslatableContent_sale {
  __typename: "Sale";
  id: string;
  name: string;
}

export interface SaleTranslations_translations_edges_node_SaleTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface SaleTranslations_translations_edges_node_SaleTranslatableContent_translation {
  __typename: "SaleTranslation";
  id: string;
  language: SaleTranslations_translations_edges_node_SaleTranslatableContent_translation_language;
  name: string | null;
}

export interface SaleTranslations_translations_edges_node_SaleTranslatableContent {
  __typename: "SaleTranslatableContent";
  sale: SaleTranslations_translations_edges_node_SaleTranslatableContent_sale | null;
  translation: SaleTranslations_translations_edges_node_SaleTranslatableContent_translation | null;
}

export type SaleTranslations_translations_edges_node = SaleTranslations_translations_edges_node_ProductTranslatableContent | SaleTranslations_translations_edges_node_SaleTranslatableContent;

export interface SaleTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: SaleTranslations_translations_edges_node;
}

export interface SaleTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: SaleTranslations_translations_edges[];
  pageInfo: SaleTranslations_translations_pageInfo;
}

export interface SaleTranslations {
  translations: SaleTranslations_translations | null;
}

export interface SaleTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
