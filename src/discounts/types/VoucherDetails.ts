/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DiscountValueTypeEnum, VoucherTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: VoucherDetails
// ====================================================

export interface VoucherDetails_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherDetails_voucher_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherDetails_voucher_channelListings_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherDetails_voucher_channelListings {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherDetails_voucher_channelListings_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherDetails_voucher_channelListings_minSpent | null;
}

export interface VoucherDetails_voucher_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface VoucherDetails_voucher_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VoucherDetails_voucher_products_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherDetails_voucher_products_edges_node_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: VoucherDetails_voucher_products_edges_node_channelListings_channel;
}

export interface VoucherDetails_voucher_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: VoucherDetails_voucher_products_edges_node_productType;
  thumbnail: VoucherDetails_voucher_products_edges_node_thumbnail | null;
  channelListings: VoucherDetails_voucher_products_edges_node_channelListings[] | null;
}

export interface VoucherDetails_voucher_products_edges {
  __typename: "ProductCountableEdge";
  node: VoucherDetails_voucher_products_edges_node;
}

export interface VoucherDetails_voucher_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherDetails_voucher_products {
  __typename: "ProductCountableConnection";
  edges: VoucherDetails_voucher_products_edges[];
  totalCount: number | null;
  pageInfo: VoucherDetails_voucher_products_pageInfo;
}

export interface VoucherDetails_voucher_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface VoucherDetails_voucher_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  products: VoucherDetails_voucher_collections_edges_node_products | null;
}

export interface VoucherDetails_voucher_collections_edges {
  __typename: "CollectionCountableEdge";
  node: VoucherDetails_voucher_collections_edges_node;
}

export interface VoucherDetails_voucher_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherDetails_voucher_collections {
  __typename: "CollectionCountableConnection";
  edges: VoucherDetails_voucher_collections_edges[];
  totalCount: number | null;
  pageInfo: VoucherDetails_voucher_collections_pageInfo;
}

export interface VoucherDetails_voucher_categories_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface VoucherDetails_voucher_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  products: VoucherDetails_voucher_categories_edges_node_products | null;
}

export interface VoucherDetails_voucher_categories_edges {
  __typename: "CategoryCountableEdge";
  node: VoucherDetails_voucher_categories_edges_node;
}

export interface VoucherDetails_voucher_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherDetails_voucher_categories {
  __typename: "CategoryCountableConnection";
  edges: VoucherDetails_voucher_categories_edges[];
  totalCount: number | null;
  pageInfo: VoucherDetails_voucher_categories_pageInfo;
}

export interface VoucherDetails_voucher {
  __typename: "Voucher";
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: DiscountValueTypeEnum;
  countries: (VoucherDetails_voucher_countries | null)[] | null;
  minCheckoutItemsQuantity: number | null;
  channelListings: VoucherDetails_voucher_channelListings[] | null;
  type: VoucherTypeEnum;
  used: number;
  applyOncePerOrder: boolean;
  applyOncePerCustomer: boolean;
  products: VoucherDetails_voucher_products | null;
  collections: VoucherDetails_voucher_collections | null;
  categories: VoucherDetails_voucher_categories | null;
}

export interface VoucherDetails {
  voucher: VoucherDetails_voucher | null;
}

export interface VoucherDetailsVariables {
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
