/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchAvailablePageAttributes
// ====================================================

export interface SearchAvailablePageAttributes_pageType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SearchAvailablePageAttributes_pageType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: SearchAvailablePageAttributes_pageType_availableAttributes_edges_node;
}

export interface SearchAvailablePageAttributes_pageType_availableAttributes_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchAvailablePageAttributes_pageType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: SearchAvailablePageAttributes_pageType_availableAttributes_edges[];
  pageInfo: SearchAvailablePageAttributes_pageType_availableAttributes_pageInfo;
}

export interface SearchAvailablePageAttributes_pageType {
  __typename: "PageType";
  id: string;
  availableAttributes: SearchAvailablePageAttributes_pageType_availableAttributes | null;
}

export interface SearchAvailablePageAttributes {
  pageType: SearchAvailablePageAttributes_pageType | null;
}

export interface SearchAvailablePageAttributesVariables {
  id: string;
  after?: string | null;
  first: number;
  query: string;
}
