/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ShippingChannelsErrorFragment
// ====================================================

export interface ShippingChannelsErrorFragment {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  channels: string[] | null;
  message: string | null;
}
