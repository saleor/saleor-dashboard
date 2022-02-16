/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: GiftCardError
// ====================================================

export interface GiftCardError {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
  message: string | null;
}
