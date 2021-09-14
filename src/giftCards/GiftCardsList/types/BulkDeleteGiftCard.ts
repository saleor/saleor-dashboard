/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: BulkDeleteGiftCard
// ====================================================

export interface BulkDeleteGiftCard_giftCardBulkDelete_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface BulkDeleteGiftCard_giftCardBulkDelete {
  __typename: "GiftCardBulkDelete";
  errors: BulkDeleteGiftCard_giftCardBulkDelete_errors[];
}

export interface BulkDeleteGiftCard {
  giftCardBulkDelete: BulkDeleteGiftCard_giftCardBulkDelete | null;
}

export interface BulkDeleteGiftCardVariables {
  ids: (string | null)[];
}
