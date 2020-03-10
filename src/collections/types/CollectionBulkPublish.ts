/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CollectionBulkPublish
// ====================================================

export interface CollectionBulkPublish_collectionBulkPublish_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface CollectionBulkPublish_collectionBulkPublish {
  __typename: "CollectionBulkPublish";
  errors: CollectionBulkPublish_collectionBulkPublish_errors[];
}

export interface CollectionBulkPublish {
  collectionBulkPublish: CollectionBulkPublish_collectionBulkPublish | null;
}

export interface CollectionBulkPublishVariables {
  ids: (string | null)[];
  isPublished: boolean;
}
