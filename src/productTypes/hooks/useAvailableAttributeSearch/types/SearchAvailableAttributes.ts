/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchAvailableAttributes
// ====================================================

export interface SearchAvailableAttributes_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SearchAvailableAttributes_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: SearchAvailableAttributes_productType_availableAttributes_edges_node;
}

export interface SearchAvailableAttributes_productType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchAvailableAttributes_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: SearchAvailableAttributes_productType_availableAttributes_edges[];
  pageInfo: SearchAvailableAttributes_productType_availableAttributes_pageInfo;
}

export interface SearchAvailableAttributes_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: SearchAvailableAttributes_productType_availableAttributes | null;
}

export interface SearchAvailableAttributes {
  productType: SearchAvailableAttributes_productType | null;
}

export interface SearchAvailableAttributesVariables {
  id: string;
  after?: string | null;
  first: number;
  query: string;
}
