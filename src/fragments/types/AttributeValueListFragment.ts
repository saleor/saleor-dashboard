/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AttributeValueListFragment
// ====================================================

export interface AttributeValueListFragment_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeValueListFragment_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeValueListFragment_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeValueListFragment_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface AttributeValueListFragment_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeValueListFragment_edges_node;
}

export interface AttributeValueListFragment {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeValueListFragment_pageInfo;
  edges: AttributeValueListFragment_edges[];
}
