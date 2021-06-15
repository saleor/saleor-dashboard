/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum, AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: AttributeTranslationDetails
// ====================================================

export interface AttributeTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "VoucherTranslatableContent" | "MenuItemTranslatableContent";
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_edges_node_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  richText: any | null;
  inputType: AttributeInputTypeEnum | null;
  translation: AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_edges_node_translation | null;
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_edges_node;
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_pageInfo;
  edges: AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices_edges[];
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  choices: AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute_choices | null;
}

export interface AttributeTranslationDetails_translation_AttributeTranslatableContent {
  __typename: "AttributeTranslatableContent";
  translation: AttributeTranslationDetails_translation_AttributeTranslatableContent_translation | null;
  attribute: AttributeTranslationDetails_translation_AttributeTranslatableContent_attribute | null;
}

export type AttributeTranslationDetails_translation = AttributeTranslationDetails_translation_ProductTranslatableContent | AttributeTranslationDetails_translation_AttributeTranslatableContent;

export interface AttributeTranslationDetails {
  translation: AttributeTranslationDetails_translation | null;
}

export interface AttributeTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
