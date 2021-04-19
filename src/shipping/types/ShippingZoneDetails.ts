/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShippingZoneDetails
// ====================================================

export interface ShippingZoneDetails_shippingZone_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetails_shippingZone_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetails_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZoneDetails_shippingZone_shippingMethods_channelListings_channel;
  price: ShippingZoneDetails_shippingZone_shippingMethods_channelListings_price | null;
  minimumOrderPrice: ShippingZoneDetails_shippingZone_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZoneDetails_shippingZone_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_edges_node_thumbnail | null;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_edges {
  __typename: "ProductCountableEdge";
  node: ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_edges_node;
}

export interface ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts {
  __typename: "ProductCountableConnection";
  pageInfo: ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_pageInfo;
  edges: ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts_edges[];
}

export interface ShippingZoneDetails_shippingZone_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  postalCodeRules: (ShippingZoneDetails_shippingZone_shippingMethods_postalCodeRules | null)[] | null;
  metadata: (ShippingZoneDetails_shippingZone_shippingMethods_metadata | null)[];
  privateMetadata: (ShippingZoneDetails_shippingZone_shippingMethods_privateMetadata | null)[];
  minimumOrderWeight: ShippingZoneDetails_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: ShippingZoneDetails_shippingZone_shippingMethods_maximumOrderWeight | null;
  minimumDeliveryDays: number | null;
  maximumDeliveryDays: number | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingZoneDetails_shippingZone_shippingMethods_channelListings[] | null;
  excludedProducts: ShippingZoneDetails_shippingZone_shippingMethods_excludedProducts | null;
}

export interface ShippingZoneDetails_shippingZone_channels {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneDetails_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZoneDetails_shippingZone {
  __typename: "ShippingZone";
  metadata: (ShippingZoneDetails_shippingZone_metadata | null)[];
  privateMetadata: (ShippingZoneDetails_shippingZone_privateMetadata | null)[];
  id: string;
  countries: (ShippingZoneDetails_shippingZone_countries | null)[] | null;
  name: string;
  description: string | null;
  default: boolean;
  shippingMethods: (ShippingZoneDetails_shippingZone_shippingMethods | null)[] | null;
  channels: ShippingZoneDetails_shippingZone_channels[];
  warehouses: ShippingZoneDetails_shippingZone_warehouses[];
}

export interface ShippingZoneDetails {
  shippingZone: ShippingZoneDetails_shippingZone | null;
}

export interface ShippingZoneDetailsVariables {
  id: string;
}
