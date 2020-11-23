/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelUpdateInput, ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelUpdate
// ====================================================

export interface ChannelUpdate_channelUpdate_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface ChannelUpdate_channelUpdate_errors {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}

export interface ChannelUpdate_channelUpdate {
  __typename: "ChannelUpdate";
  channel: ChannelUpdate_channelUpdate_channel | null;
  errors: ChannelUpdate_channelUpdate_errors[];
}

export interface ChannelUpdate {
  channelUpdate: ChannelUpdate_channelUpdate | null;
}

export interface ChannelUpdateVariables {
  id: string;
  input: ChannelUpdateInput;
}
