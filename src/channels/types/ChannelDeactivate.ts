/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelDeactivate
// ====================================================

export interface ChannelDeactivate_channelDeactivate_channel_shippingZones_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ChannelDeactivate_channelDeactivate_channel_shippingZones_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ChannelDeactivate_channelDeactivate_channel_shippingZones_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ChannelDeactivate_channelDeactivate_channel_shippingZones {
  __typename: "ShippingZone";
  metadata: (ChannelDeactivate_channelDeactivate_channel_shippingZones_metadata | null)[];
  privateMetadata: (ChannelDeactivate_channelDeactivate_channel_shippingZones_privateMetadata | null)[];
  id: string;
  countries: (ChannelDeactivate_channelDeactivate_channel_shippingZones_countries | null)[] | null;
  name: string;
  description: string | null;
}

export interface ChannelDeactivate_channelDeactivate_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  hasOrders: boolean;
  shippingZones: ChannelDeactivate_channelDeactivate_channel_shippingZones[];
}

export interface ChannelDeactivate_channelDeactivate_errors {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}

export interface ChannelDeactivate_channelDeactivate {
  __typename: "ChannelDeactivate";
  channel: ChannelDeactivate_channelDeactivate_channel | null;
  errors: ChannelDeactivate_channelDeactivate_errors[];
}

export interface ChannelDeactivate {
  channelDeactivate: ChannelDeactivate_channelDeactivate | null;
}

export interface ChannelDeactivateVariables {
  id: string;
}
