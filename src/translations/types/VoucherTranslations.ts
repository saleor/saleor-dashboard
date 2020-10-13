/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: VoucherTranslations
// ====================================================

export interface VoucherTranslations_translations_edges_node_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "MenuItemTranslatableContent";
}

export interface VoucherTranslations_translations_edges_node_VoucherTranslatableContent_voucher {
  __typename: "Voucher";
  id: string;
  name: string | null;
}

export interface VoucherTranslations_translations_edges_node_VoucherTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface VoucherTranslations_translations_edges_node_VoucherTranslatableContent_translation {
  __typename: "VoucherTranslation";
  id: string;
  language: VoucherTranslations_translations_edges_node_VoucherTranslatableContent_translation_language;
  name: string | null;
}

export interface VoucherTranslations_translations_edges_node_VoucherTranslatableContent {
  __typename: "VoucherTranslatableContent";
  voucher: VoucherTranslations_translations_edges_node_VoucherTranslatableContent_voucher | null;
  translation: VoucherTranslations_translations_edges_node_VoucherTranslatableContent_translation | null;
}

export type VoucherTranslations_translations_edges_node = VoucherTranslations_translations_edges_node_ProductTranslatableContent | VoucherTranslations_translations_edges_node_VoucherTranslatableContent;

export interface VoucherTranslations_translations_edges {
  __typename: "TranslatableItemEdge";
  node: VoucherTranslations_translations_edges_node;
}

export interface VoucherTranslations_translations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherTranslations_translations {
  __typename: "TranslatableItemConnection";
  edges: VoucherTranslations_translations_edges[];
  pageInfo: VoucherTranslations_translations_pageInfo;
}

export interface VoucherTranslations {
  translations: VoucherTranslations_translations | null;
}

export interface VoucherTranslationsVariables {
  language: LanguageCodeEnum;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
