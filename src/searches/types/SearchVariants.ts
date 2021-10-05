/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchVariants
// ====================================================

export interface SearchVariants_search_edges_node_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchVariants_search_edges_node_product {
  __typename: "Product";
  name: string;
  thumbnail: SearchVariants_search_edges_node_product_thumbnail | null;
}

export interface SearchVariants_search_edges_node {
  __typename: "ProductVariant";
  id: string;
  name: string;
  product: SearchVariants_search_edges_node_product;
}

export interface SearchVariants_search_edges {
  __typename: "ProductVariantCountableEdge";
  node: SearchVariants_search_edges_node;
}

export interface SearchVariants_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchVariants_search {
  __typename: "ProductVariantCountableConnection";
  edges: SearchVariants_search_edges[];
  pageInfo: SearchVariants_search_pageInfo;
}

export interface SearchVariants {
  search: SearchVariants_search | null;
}

export interface SearchVariantsVariables {
  after?: string | null;
  first: number;
  query: string;
}
