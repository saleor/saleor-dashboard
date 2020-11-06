/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchCatalog
// ====================================================

export interface SearchCatalog_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SearchCatalog_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SearchCatalog_categories_edges_node;
}

export interface SearchCatalog_categories {
  __typename: "CategoryCountableConnection";
  edges: SearchCatalog_categories_edges[];
}

export interface SearchCatalog_collections_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface SearchCatalog_collections_edges_node_channelListings {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: SearchCatalog_collections_edges_node_channelListings_channel;
}

export interface SearchCatalog_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  channelListings: SearchCatalog_collections_edges_node_channelListings[] | null;
}

export interface SearchCatalog_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SearchCatalog_collections_edges_node;
}

export interface SearchCatalog_collections {
  __typename: "CollectionCountableConnection";
  edges: SearchCatalog_collections_edges[];
}

export interface SearchCatalog_products_edges_node_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SearchCatalog_products_edges_node {
  __typename: "Product";
  id: string;
  category: SearchCatalog_products_edges_node_category | null;
  name: string;
}

export interface SearchCatalog_products_edges {
  __typename: "ProductCountableEdge";
  node: SearchCatalog_products_edges_node;
}

export interface SearchCatalog_products {
  __typename: "ProductCountableConnection";
  edges: SearchCatalog_products_edges[];
}

export interface SearchCatalog {
  categories: SearchCatalog_categories | null;
  collections: SearchCatalog_collections | null;
  products: SearchCatalog_products | null;
}

export interface SearchCatalogVariables {
  first: number;
  query: string;
}
