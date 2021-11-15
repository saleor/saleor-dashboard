/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchProducts
// ====================================================

export interface SearchProducts_search_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchProducts_search_edges_node_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  currencyCode: string;
}

export interface SearchProducts_search_edges_node_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SearchProducts_search_edges_node_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SearchProducts_search_edges_node_variants_channelListings_channel;
  price: SearchProducts_search_edges_node_variants_channelListings_price | null;
}

export interface SearchProducts_search_edges_node_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string | null;
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
  after?: string | null;
  first: number;
  query: string;
}
