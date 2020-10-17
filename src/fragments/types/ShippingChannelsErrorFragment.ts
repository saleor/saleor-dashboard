/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingChannelsErrorFragment
// ====================================================

export interface ShippingChannelsErrorFragment {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  channels: string[] | null;
}
