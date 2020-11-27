/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchShippingProducts
// ====================================================

export interface SearchShippingProducts_search_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchShippingProducts_search_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
}

export interface SearchShippingProducts_search_edges_node_channelListings {
  __typename: "ProductChannelListing";
  channel: SearchShippingProducts_search_edges_node_channelListings_channel;
}

export interface SearchShippingProducts_search_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: SearchShippingProducts_search_edges_node_thumbnail | null;
  channelListings: SearchShippingProducts_search_edges_node_channelListings[] | null;
}

export interface SearchShippingProducts_search_edges {
  __typename: "ProductCountableEdge";
  node: SearchShippingProducts_search_edges_node;
}

export interface SearchShippingProducts_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchShippingProducts_search {
  __typename: "ProductCountableConnection";
  edges: SearchShippingProducts_search_edges[];
  pageInfo: SearchShippingProducts_search_pageInfo;
}

export interface SearchShippingProducts {
  search: SearchShippingProducts_search | null;
}

export interface SearchShippingProductsVariables {
  first: number;
  query: string;
  after?: string | null;
}
