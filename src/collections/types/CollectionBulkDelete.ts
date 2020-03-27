/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CollectionBulkDelete
// ====================================================

export interface CollectionBulkDelete_collectionBulkDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface CollectionBulkDelete_collectionBulkDelete {
  __typename: "CollectionBulkDelete";
  errors: CollectionBulkDelete_collectionBulkDelete_errors[];
}

export interface CollectionBulkDelete {
  collectionBulkDelete: CollectionBulkDelete_collectionBulkDelete | null;
}

export interface CollectionBulkDeleteVariables {
  ids: (string | null)[];
}
