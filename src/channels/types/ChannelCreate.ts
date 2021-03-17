/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelCreateInput, ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelCreate
// ====================================================

export interface ChannelCreate_channelCreate_channel_shippingZones_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ChannelCreate_channelCreate_channel_shippingZones_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ChannelCreate_channelCreate_channel_shippingZones_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ChannelCreate_channelCreate_channel_shippingZones {
  __typename: "ShippingZone";
  metadata: (ChannelCreate_channelCreate_channel_shippingZones_metadata | null)[];
  privateMetadata: (ChannelCreate_channelCreate_channel_shippingZones_privateMetadata | null)[];
  id: string;
  countries: (ChannelCreate_channelCreate_channel_shippingZones_countries | null)[] | null;
  name: string;
  description: string | null;
}

export interface ChannelCreate_channelCreate_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  hasOrders: boolean;
  shippingZones: ChannelCreate_channelCreate_channel_shippingZones[];
}

export interface ChannelCreate_channelCreate_errors {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}

export interface ChannelCreate_channelCreate {
  __typename: "ChannelCreate";
  channel: ChannelCreate_channelCreate_channel | null;
  errors: ChannelCreate_channelCreate_errors[];
}

export interface ChannelCreate {
  channelCreate: ChannelCreate_channelCreate | null;
}

export interface ChannelCreateVariables {
  input: ChannelCreateInput;
}
