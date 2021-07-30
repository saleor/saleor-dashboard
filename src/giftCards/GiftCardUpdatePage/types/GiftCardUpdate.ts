/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardUpdateInput, GiftCardErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardUpdate
// ====================================================

export interface GiftCardUpdate_giftCardUpdate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardUpdate_giftCardUpdate {
  __typename: "GiftCardUpdate";
  errors: GiftCardUpdate_giftCardUpdate_errors[];
}

export interface GiftCardUpdate {
  giftCardUpdate: GiftCardUpdate_giftCardUpdate | null;
}

export interface GiftCardUpdateVariables {
  id: string;
  input: GiftCardUpdateInput;
}
