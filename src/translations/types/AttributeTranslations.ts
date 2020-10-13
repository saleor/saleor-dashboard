/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: AttributeTranslations
// ====================================================

export interface AttributeTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface AttributeTranslations_translations_edges_node_AttributeTranslatableContent_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  translation: AttributeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values_translation | null;
}

export interface AttributeTranslations_translations_edges_node_AttributeTranslatableContent_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (AttributeTranslations_translations_edges_node_AttributeTranslatableContent_attribute_values | null)[] | null;
}

export interface AttributeTranslations_translations_edges_node_AttributeTranslatableContent {
  __typename: "AttributeTranslatableContent";
  translation: AttributeTranslations_translations_edges_node_AttributeTranslatableContent_translation | null;
  attribute: AttributeTranslations_translations_edges_node_AttributeTranslatableContent_attribute | null;
}

export type AttributeTranslations_translations_edges_node = AttributeTranslations_translations_edges_node_ProductTranslatableContent | AttributeTranslations_translations_edges_node_AttributeTranslatableContent;

export interface AttributeTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: AttributeTranslations_translations_edges_node;
}

export interface AttributeTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: AttributeTranslations_translations_edges[];
  pageInfo: AttributeTranslations_translations_pageInfo;
}

export interface AttributeTranslations {
  translations: AttributeTranslations_translations | null;
}

export interface AttributeTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
