/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShippingZoneWithExcludedProducts
// ====================================================

export interface ShippingZoneWithExcludedProducts_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_channel;
  price: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_price | null;
  minimumOrderPrice: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start_net;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop_net;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start | null;
  stop: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop | null;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing_priceRange | null;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_thumbnail | null;
  pricing: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node_pricing | null;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges {
  __typename: "ProductCountableEdge";
  node: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges_node;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts {
  __typename: "ProductCountableConnection";
  pageInfo: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_pageInfo;
  edges: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts_edges[];
}

export interface ShippingZoneWithExcludedProducts_shippingZone_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderWeight: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_channelListings[] | null;
  excludedProducts: ShippingZoneWithExcludedProducts_shippingZone_shippingMethods_excludedProducts | null;
}

export interface ShippingZoneWithExcludedProducts_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZoneWithExcludedProducts_shippingZone {
  __typename: "ShippingZone";
  id: string;
  countries: (ShippingZoneWithExcludedProducts_shippingZone_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (ShippingZoneWithExcludedProducts_shippingZone_shippingMethods | null)[] | null;
  warehouses: (ShippingZoneWithExcludedProducts_shippingZone_warehouses | null)[] | null;
}

export interface ShippingZoneWithExcludedProducts {
  shippingZone: ShippingZoneWithExcludedProducts_shippingZone | null;
}

export interface ShippingZoneWithExcludedProductsVariables {
  id: string;
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
}
