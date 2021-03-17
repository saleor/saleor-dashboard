/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Channel
// ====================================================

export interface Channel_channel_shippingZones_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Channel_channel_shippingZones_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Channel_channel_shippingZones_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface Channel_channel_shippingZones {
  __typename: "ShippingZone";
  metadata: (Channel_channel_shippingZones_metadata | null)[];
  privateMetadata: (Channel_channel_shippingZones_privateMetadata | null)[];
  id: string;
  countries: (Channel_channel_shippingZones_countries | null)[] | null;
  name: string;
  description: string | null;
}

export interface Channel_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  hasOrders: boolean;
  shippingZones: Channel_channel_shippingZones[];
}

export interface Channel {
  channel: Channel_channel | null;
}

export interface ChannelVariables {
  id: string;
}
