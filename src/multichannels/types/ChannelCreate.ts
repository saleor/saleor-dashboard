/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChannelCreateInput, ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelCreate
// ====================================================

export interface ChannelCreate_channelCreate_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface ChannelCreate_channelCreate_errors {
  __typename: "ChannelError";
  field: string | null;
  message: string | null;
  code: ChannelErrorCode;
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
