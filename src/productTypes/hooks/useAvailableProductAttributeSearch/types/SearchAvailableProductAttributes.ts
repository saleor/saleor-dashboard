/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchAvailableProductAttributes
// ====================================================

export interface SearchAvailableProductAttributes_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SearchAvailableProductAttributes_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: SearchAvailableProductAttributes_productType_availableAttributes_edges_node;
}

export interface SearchAvailableProductAttributes_productType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchAvailableProductAttributes_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: SearchAvailableProductAttributes_productType_availableAttributes_edges[];
  pageInfo: SearchAvailableProductAttributes_productType_availableAttributes_pageInfo;
}

export interface SearchAvailableProductAttributes_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: SearchAvailableProductAttributes_productType_availableAttributes | null;
}

export interface SearchAvailableProductAttributes {
  productType: SearchAvailableProductAttributes_productType | null;
}

export interface SearchAvailableProductAttributesVariables {
  id: string;
  after?: string | null;
  first: number;
  query: string;
}
