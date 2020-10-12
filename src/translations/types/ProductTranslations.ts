/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductTranslations
// ====================================================

export interface ProductTranslations_translations_edges_node_CollectionTranslatableContent {
  __typename: "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_product {
  __typename: "Product";
  id: string;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_translation {
  __typename: "ProductTranslation";
  id: string;
  descriptionJson: any;
  language: ProductTranslations_translations_edges_node_ProductTranslatableContent_translation_language;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent";
  product: ProductTranslations_translations_edges_node_ProductTranslatableContent_product | null;
  translation: ProductTranslations_translations_edges_node_ProductTranslatableContent_translation | null;
}

export type ProductTranslations_translations_edges_node = ProductTranslations_translations_edges_node_CollectionTranslatableContent | ProductTranslations_translations_edges_node_ProductTranslatableContent;

export interface ProductTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: ProductTranslations_translations_edges_node;
}

export interface ProductTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: ProductTranslations_translations_edges[];
  pageInfo: ProductTranslations_translations_pageInfo;
}

export interface ProductTranslations {
  translations: ProductTranslations_translations | null;
}

export interface ProductTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
