/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CollectionDetails
// ====================================================

export interface CollectionDetails_collection_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CollectionDetails_collection_channelListing {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CollectionDetails_collection_channelListing_channel;
}

export interface CollectionDetails_collection_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionDetails_collection_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionDetails_collection_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CollectionDetails_collection_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface CollectionDetails_collection_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CollectionDetails_collection_products_edges_node_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CollectionDetails_collection_products_edges_node_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CollectionDetails_collection_products_edges_node_channelListing {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: CollectionDetails_collection_products_edges_node_channelListing_discountedPrice | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: CollectionDetails_collection_products_edges_node_channelListing_channel;
}

export interface CollectionDetails_collection_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: CollectionDetails_collection_products_edges_node_productType;
  thumbnail: CollectionDetails_collection_products_edges_node_thumbnail | null;
  channelListing: CollectionDetails_collection_products_edges_node_channelListing[] | null;
}

export interface CollectionDetails_collection_products_edges {
  __typename: "ProductCountableEdge";
  node: CollectionDetails_collection_products_edges_node;
}

export interface CollectionDetails_collection_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CollectionDetails_collection_products {
  __typename: "ProductCountableConnection";
  edges: CollectionDetails_collection_products_edges[];
  pageInfo: CollectionDetails_collection_products_pageInfo;
}

export interface CollectionDetails_collection {
  __typename: "Collection";
  id: string;
  name: string;
  channelListing: CollectionDetails_collection_channelListing[] | null;
  metadata: (CollectionDetails_collection_metadata | null)[];
  privateMetadata: (CollectionDetails_collection_privateMetadata | null)[];
  backgroundImage: CollectionDetails_collection_backgroundImage | null;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  products: CollectionDetails_collection_products | null;
}

export interface CollectionDetails {
  collection: CollectionDetails_collection | null;
}

export interface CollectionDetailsVariables {
  id: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
