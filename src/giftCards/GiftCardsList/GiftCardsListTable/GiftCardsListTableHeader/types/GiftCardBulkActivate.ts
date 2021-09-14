/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "./../../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardBulkActivate
// ====================================================

export interface GiftCardBulkActivate_giftCardBulkActivate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardBulkActivate_giftCardBulkActivate {
  __typename: "GiftCardBulkActivate";
  errors: GiftCardBulkActivate_giftCardBulkActivate_errors[];
  count: number;
}

export interface GiftCardBulkActivate {
  giftCardBulkActivate: GiftCardBulkActivate_giftCardBulkActivate | null;
}

export interface GiftCardBulkActivateVariables {
  ids: (string | null)[];
}
