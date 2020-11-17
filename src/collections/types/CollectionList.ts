/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CollectionFilterInput, CollectionSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CollectionList
// ====================================================

export interface CollectionList_collections_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CollectionList_collections_edges_node_channelListings {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CollectionList_collections_edges_node_channelListings_channel;
}

export interface CollectionList_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface CollectionList_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  channelListings: CollectionList_collections_edges_node_channelListings[] | null;
  products: CollectionList_collections_edges_node_products | null;
}

export interface CollectionList_collections_edges {
  __typename: "CollectionCountableEdge";
  node: CollectionList_collections_edges_node;
}

export interface CollectionList_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CollectionList_collections {
  __typename: "CollectionCountableConnection";
  edges: CollectionList_collections_edges[];
  pageInfo: CollectionList_collections_pageInfo;
}

export interface CollectionList {
  collections: CollectionList_collections | null;
}

export interface CollectionListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: CollectionFilterInput | null;
  sort?: CollectionSortingInput | null;
}
