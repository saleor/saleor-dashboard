/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelDeactivate
// ====================================================

export interface ChannelDeactivate_channelDeactivate_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
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
