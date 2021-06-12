/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageType
// ====================================================

export interface PageType_pageType_attributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageType_pageType_attributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface PageType_pageType_attributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: PageType_pageType_attributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface PageType_pageType_attributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: PageType_pageType_attributes_choices_edges_node;
}

export interface PageType_pageType_attributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: PageType_pageType_attributes_choices_pageInfo;
  edges: PageType_pageType_attributes_choices_edges[];
}

export interface PageType_pageType_attributes {
  __typename: "Attribute";
  id: string;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  slug: string | null;
  name: string | null;
  valueRequired: boolean;
  choices: PageType_pageType_attributes_choices | null;
}

export interface PageType_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (PageType_pageType_attributes | null)[] | null;
}

export interface PageType {
  pageType: PageType_pageType | null;
}

export interface PageTypeVariables {
  id: string;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
