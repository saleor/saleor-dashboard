/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelActivate
// ====================================================

export interface ChannelActivate_channelActivate_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface ChannelActivate_channelActivate_errors {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}

export interface ChannelActivate_channelActivate {
  __typename: "ChannelActivate";
  channel: ChannelActivate_channelActivate_channel | null;
  errors: ChannelActivate_channelActivate_errors[];
}

export interface ChannelActivate {
  channelActivate: ChannelActivate_channelActivate | null;
}

export interface ChannelActivateVariables {
  id: string;
}
