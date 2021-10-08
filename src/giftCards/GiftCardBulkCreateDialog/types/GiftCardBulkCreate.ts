/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardBulkCreateInput, GiftCardErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardBulkCreate
// ====================================================

export interface GiftCardBulkCreate_giftCardBulkCreate_giftCards {
  __typename: "GiftCard";
  id: string;
}

export interface GiftCardBulkCreate_giftCardBulkCreate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardBulkCreate_giftCardBulkCreate {
  __typename: "GiftCardBulkCreate";
  giftCards: GiftCardBulkCreate_giftCardBulkCreate_giftCards[];
  errors: GiftCardBulkCreate_giftCardBulkCreate_errors[];
}

export interface GiftCardBulkCreate {
  giftCardBulkCreate: GiftCardBulkCreate_giftCardBulkCreate | null;
}

export interface GiftCardBulkCreateVariables {
  input: GiftCardBulkCreateInput;
}
