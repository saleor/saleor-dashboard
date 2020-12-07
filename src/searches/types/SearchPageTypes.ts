/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SearchPageTypes
// ====================================================

export interface SearchPageTypes_search_edges_node_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SearchPageTypes_search_edges_node_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SearchPageTypes_search_edges_node_attributes_values_file | null;
}

export interface SearchPageTypes_search_edges_node_attributes {
  __typename: "Attribute";
  id: string;
  inputType: AttributeInputTypeEnum | null;
  slug: string | null;
  name: string | null;
  valueRequired: boolean;
  values: (SearchPageTypes_search_edges_node_attributes_values | null)[] | null;
}

export interface SearchPageTypes_search_edges_node {
  __typename: "PageType";
  id: string;
  name: string;
  attributes: (SearchPageTypes_search_edges_node_attributes | null)[] | null;
}

export interface SearchPageTypes_search_edges {
  __typename: "PageTypeCountableEdge";
  node: SearchPageTypes_search_edges_node;
}

export interface SearchPageTypes_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchPageTypes_search {
  __typename: "PageTypeCountableConnection";
  edges: SearchPageTypes_search_edges[];
  pageInfo: SearchPageTypes_search_pageInfo;
}

export interface SearchPageTypes {
  search: SearchPageTypes_search | null;
}

export interface SearchPageTypesVariables {
  after?: string | null;
  first: number;
  query: string;
}
