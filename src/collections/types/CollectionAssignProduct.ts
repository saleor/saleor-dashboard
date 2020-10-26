/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CollectionAssignProduct
// ====================================================

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_channelListing {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_channelListing_discountedPrice | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_channelListing_channel;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_productType;
  thumbnail: CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_thumbnail | null;
  channelListing: CollectionAssignProduct_collectionAddProducts_collection_products_edges_node_channelListing[] | null;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_edges {
  __typename: "ProductCountableEdge";
  node: CollectionAssignProduct_collectionAddProducts_collection_products_edges_node;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CollectionAssignProduct_collectionAddProducts_collection_products {
  __typename: "ProductCountableConnection";
  edges: CollectionAssignProduct_collectionAddProducts_collection_products_edges[];
  pageInfo: CollectionAssignProduct_collectionAddProducts_collection_products_pageInfo;
}

export interface CollectionAssignProduct_collectionAddProducts_collection {
  __typename: "Collection";
  id: string;
  products: CollectionAssignProduct_collectionAddProducts_collection_products | null;
}

export interface CollectionAssignProduct_collectionAddProducts_errors {
  __typename: "CollectionProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface CollectionAssignProduct_collectionAddProducts {
  __typename: "CollectionAddProducts";
  collection: CollectionAssignProduct_collectionAddProducts_collection | null;
  errors: CollectionAssignProduct_collectionAddProducts_errors[];
}

export interface CollectionAssignProduct {
  collectionAddProducts: CollectionAssignProduct_collectionAddProducts | null;
}

export interface CollectionAssignProductVariables {
  collectionId: string;
  productIds: string[];
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
