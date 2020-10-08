/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelDeleteInput, ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelDelete
// ====================================================

export interface ChannelDelete_channelDelete_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface ChannelDelete_channelDelete_errors {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}

export interface ChannelDelete_channelDelete {
  __typename: "ChannelDelete";
  channel: ChannelDelete_channelDelete_channel | null;
  errors: ChannelDelete_channelDelete_errors[];
}

export interface ChannelDelete {
  channelDelete: ChannelDelete_channelDelete | null;
}

export interface ChannelDeleteVariables {
  id: string;
  input: ChannelDeleteInput;
}
