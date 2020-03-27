/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: productBulkPublish
// ====================================================

export interface productBulkPublish_productBulkPublish_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface productBulkPublish_productBulkPublish {
  __typename: "ProductBulkPublish";
  errors: productBulkPublish_productBulkPublish_errors[];
}

export interface productBulkPublish {
  productBulkPublish: productBulkPublish_productBulkPublish | null;
}

export interface productBulkPublishVariables {
  ids: string[];
  isPublished: boolean;
}
