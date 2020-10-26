/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CollectionChannelListingUpdateInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CollectionChannelListingUpdate
// ====================================================

export interface CollectionChannelListingUpdate_collectionChannelListingUpdate_errors {
  __typename: "CollectionChannelListingError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
  channels: string[] | null;
}

export interface CollectionChannelListingUpdate_collectionChannelListingUpdate {
  __typename: "CollectionChannelListingUpdate";
  errors: CollectionChannelListingUpdate_collectionChannelListingUpdate_errors[];
}

export interface CollectionChannelListingUpdate {
  collectionChannelListingUpdate: CollectionChannelListingUpdate_collectionChannelListingUpdate | null;
}

export interface CollectionChannelListingUpdateVariables {
  id: string;
  input: CollectionChannelListingUpdateInput;
}
