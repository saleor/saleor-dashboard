/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: CollectionErrorFragment
// ====================================================

export interface CollectionErrorFragment {
  __typename: "CollectionError";
  code: CollectionErrorCode;
  field: string | null;
  message: string | null;
}
