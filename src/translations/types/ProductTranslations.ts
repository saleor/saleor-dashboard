/* tslint:disable */
/* eslint-disable */
// @generated
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
  description: any | null;
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
  seoTitle: string | null;
  seoDescription: string | null;
  name: string | null;
  description: any | null;
  language: ProductTranslations_translations_edges_node_ProductTranslatableContent_translation_language;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues_attributeValue {
  __typename: "AttributeValue";
  id: string;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
  language: ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues_translation_language;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues {
  __typename: "AttributeValueTranslatableContent";
  id: string;
  name: string;
  richText: any | null;
  attributeValue: ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues_attributeValue | null;
  translation: ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues_translation | null;
}

export interface ProductTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent";
  product: ProductTranslations_translations_edges_node_ProductTranslatableContent_product | null;
  translation: ProductTranslations_translations_edges_node_ProductTranslatableContent_translation | null;
  attributeValues: ProductTranslations_translations_edges_node_ProductTranslatableContent_attributeValues[];
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
