/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchProducts
// ====================================================

export interface SearchProducts_search_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchProducts_search_edges_node_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SearchProducts_search_edges_node_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  price: SearchProducts_search_edges_node_variants_channelListings_price | null;
}

export interface SearchProducts_search_edges_node_variants {
  __typename: "ProductVariant";
  channelListings: SearchProducts_search_edges_node_variants_channelListings[] | null;
}

export interface SearchProducts_search_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: SearchProducts_search_edges_node_thumbnail | null;
  variants: (SearchProducts_search_edges_node_variants | null)[] | null;
}

export interface SearchProducts_search_edges {
  __typename: "ProductCountableEdge";
  node: SearchProducts_search_edges_node;
}

export interface SearchProducts_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchProducts_search {
  __typename: "ProductCountableConnection";
  edges: SearchProducts_search_edges[];
  pageInfo: SearchProducts_search_pageInfo;
}

export interface SearchProducts {
  search: SearchProducts_search | null;
}

export interface SearchProductsVariables {
  first: number;
  query: string;
  after?: string | null;
}
