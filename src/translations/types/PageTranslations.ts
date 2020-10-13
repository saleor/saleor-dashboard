/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageTranslations
// ====================================================

export interface PageTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface PageTranslations_translations_edges_node_PageTranslatableContent_page {
  __typename: "Page";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
}

export interface PageTranslations_translations_edges_node_PageTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface PageTranslations_translations_edges_node_PageTranslatableContent_translation {
  __typename: "PageTranslation";
  id: string;
  contentJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
  language: PageTranslations_translations_edges_node_PageTranslatableContent_translation_language;
}

export interface PageTranslations_translations_edges_node_PageTranslatableContent {
  __typename: "PageTranslatableContent";
  page: PageTranslations_translations_edges_node_PageTranslatableContent_page | null;
  translation: PageTranslations_translations_edges_node_PageTranslatableContent_translation | null;
}

export type PageTranslations_translations_edges_node = PageTranslations_translations_edges_node_ProductTranslatableContent | PageTranslations_translations_edges_node_PageTranslatableContent;

export interface PageTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: PageTranslations_translations_edges_node;
}

export interface PageTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: PageTranslations_translations_edges[];
  pageInfo: PageTranslations_translations_pageInfo;
}

export interface PageTranslations {
  translations: PageTranslations_translations | null;
}

export interface PageTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
