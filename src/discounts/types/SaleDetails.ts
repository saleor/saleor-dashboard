/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SaleDetails
// ====================================================

export interface SaleDetails_sale_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleDetails_sale_channelListing {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleDetails_sale_channelListing_channel;
  discountValue: number;
  currency: string;
}

export interface SaleDetails_sale_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface SaleDetails_sale_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleDetails_sale_products_edges_node_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SaleDetails_sale_products_edges_node_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleDetails_sale_products_edges_node_channelListing {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: SaleDetails_sale_products_edges_node_channelListing_discountedPrice | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: SaleDetails_sale_products_edges_node_channelListing_channel;
}

export interface SaleDetails_sale_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: SaleDetails_sale_products_edges_node_productType;
  thumbnail: SaleDetails_sale_products_edges_node_thumbnail | null;
  channelListing: SaleDetails_sale_products_edges_node_channelListing[] | null;
}

export interface SaleDetails_sale_products_edges {
  __typename: "ProductCountableEdge";
  node: SaleDetails_sale_products_edges_node;
}

export interface SaleDetails_sale_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetails_sale_products {
  __typename: "ProductCountableConnection";
  edges: SaleDetails_sale_products_edges[];
  pageInfo: SaleDetails_sale_products_pageInfo;
  totalCount: number | null;
}

export interface SaleDetails_sale_categories_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleDetails_sale_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  products: SaleDetails_sale_categories_edges_node_products | null;
}

export interface SaleDetails_sale_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleDetails_sale_categories_edges_node;
}

export interface SaleDetails_sale_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetails_sale_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleDetails_sale_categories_edges[];
  pageInfo: SaleDetails_sale_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleDetails_sale_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleDetails_sale_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  products: SaleDetails_sale_collections_edges_node_products | null;
}

export interface SaleDetails_sale_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleDetails_sale_collections_edges_node;
}

export interface SaleDetails_sale_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetails_sale_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleDetails_sale_collections_edges[];
  pageInfo: SaleDetails_sale_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleDetails_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListing: SaleDetails_sale_channelListing[] | null;
  products: SaleDetails_sale_products | null;
  categories: SaleDetails_sale_categories | null;
  collections: SaleDetails_sale_collections | null;
}

export interface SaleDetails {
  sale: SaleDetails_sale | null;
}

export interface SaleDetailsVariables {
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
