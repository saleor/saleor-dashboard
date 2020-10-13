/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductTypeTranslations
// ====================================================

export interface ProductTypeTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
}

export interface ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  translation: ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values_translation | null;
}

export interface ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values | null)[] | null;
}

export interface ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent {
  __typename: "AttributeTranslatableContent";
  translation: ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_translation | null;
  attribute: ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent_attribute | null;
}

export type ProductTypeTranslations_translations_edges_node = ProductTypeTranslations_translations_edges_node_ProductTranslatableContent | ProductTypeTranslations_translations_edges_node_AttributeTranslatableContent;

export interface ProductTypeTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: ProductTypeTranslations_translations_edges_node;
}

export interface ProductTypeTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductTypeTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: ProductTypeTranslations_translations_edges[];
  pageInfo: ProductTypeTranslations_translations_pageInfo;
}

export interface ProductTypeTranslations {
  translations: ProductTypeTranslations_translations | null;
}

export interface ProductTypeTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
