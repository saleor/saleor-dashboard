/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChannelDeleteInput, ChannelErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChannelDelete
// ====================================================

export interface ChannelDelete_channelDelete_errors {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}

export interface ChannelDelete_channelDelete {
  __typename: "ChannelDelete";
  errors: ChannelDelete_channelDelete_errors[];
}

export interface ChannelDelete {
  channelDelete: ChannelDelete_channelDelete | null;
}

export interface ChannelDeleteVariables {
  id: string;
  input?: ChannelDeleteInput | null;
}
