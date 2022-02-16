/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChannelErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ChannelErrorFragment
// ====================================================

export interface ChannelErrorFragment {
  __typename: "ChannelError";
  code: ChannelErrorCode;
  field: string | null;
  message: string | null;
}
