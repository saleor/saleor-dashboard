/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: AttributeTranslationDetailsFragment
// ====================================================

export interface AttributeTranslationDetailsFragment_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface AttributeTranslationDetailsFragment_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeTranslationDetailsFragment_attribute_choices_edges_node_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
}

export interface AttributeTranslationDetailsFragment_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  richText: any | null;
  inputType: AttributeInputTypeEnum | null;
  translation: AttributeTranslationDetailsFragment_attribute_choices_edges_node_translation | null;
}

export interface AttributeTranslationDetailsFragment_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeTranslationDetailsFragment_attribute_choices_edges_node;
}

export interface AttributeTranslationDetailsFragment_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeTranslationDetailsFragment_attribute_choices_pageInfo;
  edges: AttributeTranslationDetailsFragment_attribute_choices_edges[];
}

export interface AttributeTranslationDetailsFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  choices: AttributeTranslationDetailsFragment_attribute_choices | null;
}

export interface AttributeTranslationDetailsFragment {
  __typename: "AttributeTranslatableContent";
  translation: AttributeTranslationDetailsFragment_translation | null;
  attribute: AttributeTranslationDetailsFragment_attribute | null;
}
