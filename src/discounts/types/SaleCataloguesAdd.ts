/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CatalogueInput, DiscountErrorCode, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleCataloguesAdd
// ====================================================

export interface SaleCataloguesAdd_saleCataloguesAdd_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleCataloguesAdd_saleCataloguesAdd_sale_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_channelListings_channel;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_productType;
  thumbnail: SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_thumbnail | null;
  channelListings: SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node_channelListings[] | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges {
  __typename: "ProductCountableEdge";
  node: SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges_node;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_products {
  __typename: "ProductCountableConnection";
  edges: SaleCataloguesAdd_saleCataloguesAdd_sale_products_edges[];
  pageInfo: SaleCataloguesAdd_saleCataloguesAdd_sale_products_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_categories_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  products: SaleCataloguesAdd_saleCataloguesAdd_sale_categories_edges_node_products | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleCataloguesAdd_saleCataloguesAdd_sale_categories_edges_node;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleCataloguesAdd_saleCataloguesAdd_sale_categories_edges[];
  pageInfo: SaleCataloguesAdd_saleCataloguesAdd_sale_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  products: SaleCataloguesAdd_saleCataloguesAdd_sale_collections_edges_node_products | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleCataloguesAdd_saleCataloguesAdd_sale_collections_edges_node;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleCataloguesAdd_saleCataloguesAdd_sale_collections_edges[];
  pageInfo: SaleCataloguesAdd_saleCataloguesAdd_sale_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleCataloguesAdd_saleCataloguesAdd_sale_channelListings[] | null;
  products: SaleCataloguesAdd_saleCataloguesAdd_sale_products | null;
  categories: SaleCataloguesAdd_saleCataloguesAdd_sale_categories | null;
  collections: SaleCataloguesAdd_saleCataloguesAdd_sale_collections | null;
}

export interface SaleCataloguesAdd_saleCataloguesAdd {
  __typename: "SaleAddCatalogues";
  errors: SaleCataloguesAdd_saleCataloguesAdd_errors[];
  sale: SaleCataloguesAdd_saleCataloguesAdd_sale | null;
}

export interface SaleCataloguesAdd {
  saleCataloguesAdd: SaleCataloguesAdd_saleCataloguesAdd | null;
}

export interface SaleCataloguesAddVariables {
  input: CatalogueInput;
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
