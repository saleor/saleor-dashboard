/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CatalogueInput, DiscountErrorCode, VoucherTypeEnum, DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VoucherCataloguesRemove
// ====================================================

export interface VoucherCataloguesRemove_voucherCataloguesRemove_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_channelListings_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_channelListings {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_channelListings_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_channelListings_minSpent | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_channelListings_channel;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  productType: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_productType;
  thumbnail: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_thumbnail | null;
  channelListings: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node_channelListings[] | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges {
  __typename: "ProductCountableEdge";
  node: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges_node;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products {
  __typename: "ProductCountableConnection";
  edges: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_edges[];
  totalCount: number | null;
  pageInfo: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products_pageInfo;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  products: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_edges_node_products | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_edges {
  __typename: "CollectionCountableEdge";
  node: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_edges_node;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections {
  __typename: "CollectionCountableConnection";
  edges: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_edges[];
  totalCount: number | null;
  pageInfo: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections_pageInfo;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_edges_node_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  products: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_edges_node_products | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_edges {
  __typename: "CategoryCountableEdge";
  node: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_edges_node;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories {
  __typename: "CategoryCountableConnection";
  edges: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_edges[];
  totalCount: number | null;
  pageInfo: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories_pageInfo;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove_voucher {
  __typename: "Voucher";
  metadata: (VoucherCataloguesRemove_voucherCataloguesRemove_voucher_metadata | null)[];
  privateMetadata: (VoucherCataloguesRemove_voucherCataloguesRemove_voucher_privateMetadata | null)[];
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  type: VoucherTypeEnum;
  discountValueType: DiscountValueTypeEnum;
  countries: (VoucherCataloguesRemove_voucherCataloguesRemove_voucher_countries | null)[] | null;
  minCheckoutItemsQuantity: number | null;
  channelListings: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_channelListings[] | null;
  used: number;
  applyOncePerOrder: boolean;
  applyOncePerCustomer: boolean;
  onlyForStaff: boolean;
  products: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_products | null;
  collections: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_collections | null;
  categories: VoucherCataloguesRemove_voucherCataloguesRemove_voucher_categories | null;
}

export interface VoucherCataloguesRemove_voucherCataloguesRemove {
  __typename: "VoucherRemoveCatalogues";
  errors: VoucherCataloguesRemove_voucherCataloguesRemove_errors[];
  voucher: VoucherCataloguesRemove_voucherCataloguesRemove_voucher | null;
}

export interface VoucherCataloguesRemove {
  voucherCataloguesRemove: VoucherCataloguesRemove_voucherCataloguesRemove | null;
}

export interface VoucherCataloguesRemoveVariables {
  input: CatalogueInput;
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
