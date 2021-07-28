/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardCreateInput, GiftCardErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardCreate
// ====================================================

export interface GiftCardCreate_giftCardCreate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardCreate_giftCardCreate {
  __typename: "GiftCardCreate";
  errors: GiftCardCreate_giftCardCreate_errors[];
}

export interface GiftCardCreate {
  giftCardCreate: GiftCardCreate_giftCardCreate | null;
}

export interface GiftCardCreateVariables {
  input: GiftCardCreateInput;
}
