/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductChannelListingErrorFragment
// ====================================================

export interface ProductChannelListingErrorFragment {
  __typename: "ProductChannelListingError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
  channels: string[] | null;
}
