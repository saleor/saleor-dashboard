/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CatalogueInput, DiscountErrorCode, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleCataloguesRemove
// ====================================================

export interface SaleCataloguesRemove_saleCataloguesRemove_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleCataloguesRemove_saleCataloguesRemove_sale_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_channelListings_channel;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_productType;
  thumbnail: SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_thumbnail | null;
  channelListings: SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node_channelListings[] | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges {
  __typename: "ProductCountableEdge";
  node: SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges_node;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_products {
  __typename: "ProductCountableConnection";
  edges: SaleCataloguesRemove_saleCataloguesRemove_sale_products_edges[];
  pageInfo: SaleCataloguesRemove_saleCataloguesRemove_sale_products_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  products: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node_products | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges[];
  pageInfo: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  products: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node_products | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges[];
  pageInfo: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleCataloguesRemove_saleCataloguesRemove_sale_channelListings[] | null;
  products: SaleCataloguesRemove_saleCataloguesRemove_sale_products | null;
  categories: SaleCataloguesRemove_saleCataloguesRemove_sale_categories | null;
  collections: SaleCataloguesRemove_saleCataloguesRemove_sale_collections | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove {
  __typename: "SaleRemoveCatalogues";
  errors: SaleCataloguesRemove_saleCataloguesRemove_errors[];
  sale: SaleCataloguesRemove_saleCataloguesRemove_sale | null;
}

export interface SaleCataloguesRemove {
  saleCataloguesRemove: SaleCataloguesRemove_saleCataloguesRemove | null;
}

export interface SaleCataloguesRemoveVariables {
  input: CatalogueInput;
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
