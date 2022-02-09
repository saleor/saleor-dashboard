/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShippingZone
// ====================================================

export interface ShippingZone_shippingZone_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZone_shippingZone_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZone_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZone_shippingZone_shippingMethods_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface ShippingZone_shippingZone_shippingMethods_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZone_shippingZone_shippingMethods_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZone_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZone_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZone_shippingZone_shippingMethods_channelListings_channel;
  price: ShippingZone_shippingZone_shippingMethods_channelListings_price | null;
  minimumOrderPrice: ShippingZone_shippingZone_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZone_shippingZone_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface ShippingZone_shippingZone_shippingMethods_excludedProducts_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node_thumbnail | null;
}

export interface ShippingZone_shippingZone_shippingMethods_excludedProducts_edges {
  __typename: "ProductCountableEdge";
  node: ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node;
}

export interface ShippingZone_shippingZone_shippingMethods_excludedProducts {
  __typename: "ProductCountableConnection";
  pageInfo: ShippingZone_shippingZone_shippingMethods_excludedProducts_pageInfo;
  edges: ShippingZone_shippingZone_shippingMethods_excludedProducts_edges[];
}

export interface ShippingZone_shippingZone_shippingMethods {
  __typename: "ShippingMethodType";
  id: string;
  postalCodeRules: (ShippingZone_shippingZone_shippingMethods_postalCodeRules | null)[] | null;
  metadata: (ShippingZone_shippingZone_shippingMethods_metadata | null)[];
  privateMetadata: (ShippingZone_shippingZone_shippingMethods_privateMetadata | null)[];
  minimumOrderWeight: ShippingZone_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: ShippingZone_shippingZone_shippingMethods_maximumOrderWeight | null;
  minimumDeliveryDays: number | null;
  maximumDeliveryDays: number | null;
  name: string;
  description: any | null;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingZone_shippingZone_shippingMethods_channelListings[] | null;
  excludedProducts: ShippingZone_shippingZone_shippingMethods_excludedProducts | null;
}

export interface ShippingZone_shippingZone_channels {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZone_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZone_shippingZone {
  __typename: "ShippingZone";
  metadata: (ShippingZone_shippingZone_metadata | null)[];
  privateMetadata: (ShippingZone_shippingZone_privateMetadata | null)[];
  id: string;
  countries: (ShippingZone_shippingZone_countries | null)[] | null;
  name: string;
  description: string | null;
  shippingMethods: (ShippingZone_shippingZone_shippingMethods | null)[] | null;
  channels: ShippingZone_shippingZone_channels[];
  warehouses: ShippingZone_shippingZone_warehouses[];
}

export interface ShippingZone {
  shippingZone: ShippingZone_shippingZone | null;
}

export interface ShippingZoneVariables {
  id: string;
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
}
