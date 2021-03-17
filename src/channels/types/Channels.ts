/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Channels
// ====================================================

export interface Channels_channels_shippingZones_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Channels_channels_shippingZones_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Channels_channels_shippingZones_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface Channels_channels_shippingZones {
  __typename: "ShippingZone";
  metadata: (Channels_channels_shippingZones_metadata | null)[];
  privateMetadata: (Channels_channels_shippingZones_privateMetadata | null)[];
  id: string;
  countries: (Channels_channels_shippingZones_countries | null)[] | null;
  name: string;
  description: string | null;
}

export interface Channels_channels {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  hasOrders: boolean;
  shippingZones: Channels_channels_shippingZones[];
}

export interface Channels {
  channels: Channels_channels[] | null;
}
