/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SaleDetailsFragment
// ====================================================

export interface SaleDetailsFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleDetailsFragment_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleDetailsFragment_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleDetailsFragment_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface SaleDetailsFragment_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleDetailsFragment_products_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleDetailsFragment_products_edges_node_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: SaleDetailsFragment_products_edges_node_channelListings_channel;
}

export interface SaleDetailsFragment_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: SaleDetailsFragment_products_edges_node_productType;
  thumbnail: SaleDetailsFragment_products_edges_node_thumbnail | null;
  channelListings: SaleDetailsFragment_products_edges_node_channelListings[] | null;
}

export interface SaleDetailsFragment_products_edges {
  __typename: "ProductCountableEdge";
  node: SaleDetailsFragment_products_edges_node;
}

export interface SaleDetailsFragment_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetailsFragment_products {
  __typename: "ProductCountableConnection";
  edges: SaleDetailsFragment_products_edges[];
  pageInfo: SaleDetailsFragment_products_pageInfo;
  totalCount: number | null;
}

export interface SaleDetailsFragment_categories_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleDetailsFragment_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  products: SaleDetailsFragment_categories_edges_node_products | null;
}

export interface SaleDetailsFragment_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleDetailsFragment_categories_edges_node;
}

export interface SaleDetailsFragment_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetailsFragment_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleDetailsFragment_categories_edges[];
  pageInfo: SaleDetailsFragment_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleDetailsFragment_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleDetailsFragment_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  products: SaleDetailsFragment_collections_edges_node_products | null;
}

export interface SaleDetailsFragment_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleDetailsFragment_collections_edges_node;
}

export interface SaleDetailsFragment_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetailsFragment_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleDetailsFragment_collections_edges[];
  pageInfo: SaleDetailsFragment_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleDetailsFragment {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleDetailsFragment_channelListings[] | null;
  products: SaleDetailsFragment_products | null;
  categories: SaleDetailsFragment_categories | null;
  collections: SaleDetailsFragment_collections | null;
}
