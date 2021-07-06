/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: AttributeChoicesTranslationFragment
// ====================================================

export interface AttributeChoicesTranslationFragment_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeChoicesTranslationFragment_edges_node_translation {
  __typename: "AttributeValueTranslation";
  id: string;
  name: string;
  richText: any | null;
}

export interface AttributeChoicesTranslationFragment_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  richText: any | null;
  inputType: AttributeInputTypeEnum | null;
  translation: AttributeChoicesTranslationFragment_edges_node_translation | null;
}

export interface AttributeChoicesTranslationFragment_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeChoicesTranslationFragment_edges_node;
}

export interface AttributeChoicesTranslationFragment {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeChoicesTranslationFragment_pageInfo;
  edges: AttributeChoicesTranslationFragment_edges[];
}
