/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelDetailsFragment
// ====================================================

export interface ChannelDetailsFragment_shippingZones_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ChannelDetailsFragment_shippingZones_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ChannelDetailsFragment_shippingZones_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ChannelDetailsFragment_shippingZones {
  __typename: "ShippingZone";
  metadata: (ChannelDetailsFragment_shippingZones_metadata | null)[];
  privateMetadata: (ChannelDetailsFragment_shippingZones_privateMetadata | null)[];
  id: string;
  countries: (ChannelDetailsFragment_shippingZones_countries | null)[] | null;
  name: string;
  description: string | null;
}

export interface ChannelDetailsFragment {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  hasOrders: boolean;
  shippingZones: ChannelDetailsFragment_shippingZones[];
}
