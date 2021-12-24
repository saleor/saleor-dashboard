/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddressInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SearchOrderVariant
// ====================================================

export interface SearchOrderVariant_search_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted {
  __typename: "TaxedMoney";
  gross: SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted_gross;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing_price_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing_price {
  __typename: "TaxedMoney";
  gross: SearchOrderVariant_search_edges_node_variants_pricing_price_gross;
}

export interface SearchOrderVariant_search_edges_node_variants_pricing {
  __typename: "VariantPricingInfo";
  priceUndiscounted: SearchOrderVariant_search_edges_node_variants_pricing_priceUndiscounted | null;
  price: SearchOrderVariant_search_edges_node_variants_pricing_price | null;
  onSale: boolean | null;
}

export interface SearchOrderVariant_search_edges_node_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  currencyCode: string;
}

export interface SearchOrderVariant_search_edges_node_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SearchOrderVariant_search_edges_node_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SearchOrderVariant_search_edges_node_variants_channelListings_channel;
  price: SearchOrderVariant_search_edges_node_variants_channelListings_price | null;
}

export interface SearchOrderVariant_search_edges_node_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string | null;
  pricing: SearchOrderVariant_search_edges_node_variants_pricing | null;
  channelListings: SearchOrderVariant_search_edges_node_variants_channelListings[] | null;
}

export interface SearchOrderVariant_search_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: SearchOrderVariant_search_edges_node_thumbnail | null;
  variants: (SearchOrderVariant_search_edges_node_variants | null)[] | null;
}

export interface SearchOrderVariant_search_edges {
  __typename: "ProductCountableEdge";
  node: SearchOrderVariant_search_edges_node;
}

export interface SearchOrderVariant_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchOrderVariant_search {
  __typename: "ProductCountableConnection";
  edges: SearchOrderVariant_search_edges[];
  pageInfo: SearchOrderVariant_search_pageInfo;
}

export interface SearchOrderVariant {
  search: SearchOrderVariant_search | null;
}

export interface SearchOrderVariantVariables {
  channel: string;
  first: number;
  query: string;
  after?: string | null;
  address?: AddressInput | null;
}
