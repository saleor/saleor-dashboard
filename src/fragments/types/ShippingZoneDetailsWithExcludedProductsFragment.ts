/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingZoneDetailsWithExcludedProductsFragment
// ====================================================

export interface ShippingZoneDetailsWithExcludedProductsFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_channel;
  price: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_price | null;
  minimumOrderPrice: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start_net;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop_net;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_start | null;
  stop: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange_stop | null;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing_priceRange | null;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_thumbnail | null;
  pricing: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node_pricing | null;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges {
  __typename: "ProductCountableEdge";
  node: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges_node;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts {
  __typename: "ProductCountableConnection";
  pageInfo: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_pageInfo;
  edges: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts_edges[];
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderWeight: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_channelListings[] | null;
  excludedProducts: ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods_excludedProducts | null;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZoneDetailsWithExcludedProductsFragment {
  __typename: "ShippingZone";
  id: string;
  countries: (ShippingZoneDetailsWithExcludedProductsFragment_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (ShippingZoneDetailsWithExcludedProductsFragment_shippingMethods | null)[] | null;
  warehouses: (ShippingZoneDetailsWithExcludedProductsFragment_warehouses | null)[] | null;
}
