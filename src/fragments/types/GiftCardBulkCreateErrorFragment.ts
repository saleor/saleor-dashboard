/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: GiftCardBulkCreateErrorFragment
// ====================================================

export interface GiftCardBulkCreateErrorFragment {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
  message: string | null;
}
