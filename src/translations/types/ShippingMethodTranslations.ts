/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShippingMethodTranslations
// ====================================================

export interface ShippingMethodTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent_translation {
  __typename: "ShippingMethodTranslation";
  id: string;
  language: ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent_translation_language;
  name: string | null;
}

export interface ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent {
  __typename: "ShippingMethodTranslatableContent";
  shippingMethod: ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent_shippingMethod | null;
  id: string;
  name: string;
  translation: ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent_translation | null;
}

export type ShippingMethodTranslations_translations_edges_node = ShippingMethodTranslations_translations_edges_node_ProductTranslatableContent | ShippingMethodTranslations_translations_edges_node_ShippingMethodTranslatableContent;

export interface ShippingMethodTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: ShippingMethodTranslations_translations_edges_node;
}

export interface ShippingMethodTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ShippingMethodTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: ShippingMethodTranslations_translations_edges[];
  pageInfo: ShippingMethodTranslations_translations_pageInfo;
}

export interface ShippingMethodTranslations {
  translations: ShippingMethodTranslations_translations | null;
}

export interface ShippingMethodTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
