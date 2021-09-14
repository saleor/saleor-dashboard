/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteGiftCard
// ====================================================

export interface DeleteGiftCard_giftCardDelete_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface DeleteGiftCard_giftCardDelete {
  __typename: "GiftCardDelete";
  errors: DeleteGiftCard_giftCardDelete_errors[];
}

export interface DeleteGiftCard {
  giftCardDelete: DeleteGiftCard_giftCardDelete | null;
}

export interface DeleteGiftCardVariables {
  id: string;
}
