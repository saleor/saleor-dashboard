/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: CollectionChannelListingErrorFragment
// ====================================================

export interface CollectionChannelListingErrorFragment {
  __typename: "CollectionChannelListingError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
  channels: string[] | null;
}
