/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductFilterInput, ProductOrder } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductList
// ====================================================

export interface ProductList_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductList_products_edges_node_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductList_products_edges_node_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductList_products_edges_node_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductList_products_edges_node_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductList_products_edges_node_channelListings_pricing_priceRange_start_net;
}

export interface ProductList_products_edges_node_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductList_products_edges_node_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductList_products_edges_node_channelListings_pricing_priceRange_stop_net;
}

export interface ProductList_products_edges_node_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductList_products_edges_node_channelListings_pricing_priceRange_start | null;
  stop: ProductList_products_edges_node_channelListings_pricing_priceRange_stop | null;
}

export interface ProductList_products_edges_node_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductList_products_edges_node_channelListings_pricing_priceRange | null;
}

export interface ProductList_products_edges_node_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: ProductList_products_edges_node_channelListings_channel;
  pricing: ProductList_products_edges_node_channelListings_pricing | null;
}

export interface ProductList_products_edges_node_attributes_attribute {
  __typename: "Attribute";
  id: string;
}

export interface ProductList_products_edges_node_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductList_products_edges_node_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductList_products_edges_node_attributes_values_file | null;
}

export interface ProductList_products_edges_node_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductList_products_edges_node_attributes_attribute;
  values: (ProductList_products_edges_node_attributes_values | null)[];
}

export interface ProductList_products_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductList_products_edges_node_thumbnail | null;
  productType: ProductList_products_edges_node_productType;
  channelListings: ProductList_products_edges_node_channelListings[] | null;
  attributes: ProductList_products_edges_node_attributes[];
}

export interface ProductList_products_edges {
  __typename: "ProductCountableEdge";
  node: ProductList_products_edges_node;
}

export interface ProductList_products_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ProductList_products {
  __typename: "ProductCountableConnection";
  edges: ProductList_products_edges[];
  pageInfo: ProductList_products_pageInfo;
  totalCount: number | null;
}

export interface ProductList {
  products: ProductList_products | null;
}

export interface ProductListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: ProductFilterInput | null;
  sort?: ProductOrder | null;
}
