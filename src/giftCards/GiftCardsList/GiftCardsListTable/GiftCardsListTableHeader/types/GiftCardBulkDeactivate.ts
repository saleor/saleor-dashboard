/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "./../../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardBulkDeactivate
// ====================================================

export interface GiftCardBulkDeactivate_giftCardBulkDeactivate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardBulkDeactivate_giftCardBulkDeactivate {
  __typename: "GiftCardBulkDeactivate";
  errors: GiftCardBulkDeactivate_giftCardBulkDeactivate_errors[];
  count: number;
}

export interface GiftCardBulkDeactivate {
  giftCardBulkDeactivate: GiftCardBulkDeactivate_giftCardBulkDeactivate | null;
}

export interface GiftCardBulkDeactivateVariables {
  ids: (string | null)[];
}
