/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: AttributeValueTranslatableContentFragment
// ====================================================

export interface AttributeValueTranslatableContentFragment_translation {
  __typename: "AttributeTranslation";
  id: string;
  name: string;
}

export interface AttributeValueTranslatableContentFragment_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeValueTranslatableContentFragment_attribute_choices_edges_node_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
}

export interface AttributeValueTranslatableContentFragment_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  richText: any | null;
  inputType: AttributeInputTypeEnum | null;
  translation: AttributeValueTranslatableContentFragment_attribute_choices_edges_node_translation | null;
}

export interface AttributeValueTranslatableContentFragment_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeValueTranslatableContentFragment_attribute_choices_edges_node;
}

export interface AttributeValueTranslatableContentFragment_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeValueTranslatableContentFragment_attribute_choices_pageInfo;
  edges: AttributeValueTranslatableContentFragment_attribute_choices_edges[];
}

export interface AttributeValueTranslatableContentFragment_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  choices: AttributeValueTranslatableContentFragment_attribute_choices | null;
}

export interface AttributeValueTranslatableContentFragment {
  __typename: "AttributeTranslatableContent";
  translation: AttributeValueTranslatableContentFragment_translation | null;
  attribute: AttributeValueTranslatableContentFragment_attribute | null;
}
