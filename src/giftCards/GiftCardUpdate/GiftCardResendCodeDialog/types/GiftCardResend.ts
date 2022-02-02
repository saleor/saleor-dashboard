/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardResendInput, GiftCardErrorCode } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardResend
// ====================================================

export interface GiftCardResend_giftCardResend_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardResend_giftCardResend_giftCard_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardResend_giftCardResend_giftCard_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardResend_giftCardResend_giftCard_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardResend_giftCardResend_giftCard_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardResend_giftCardResend_giftCard_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardResend_giftCardResend_giftCard_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardResend_giftCardResend_giftCard_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardResend_giftCardResend_giftCard_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardResend_giftCardResend_giftCard_tags {
  __typename: "GiftCardTag";
  name: string;
}

export interface GiftCardResend_giftCardResend_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardResend_giftCardResend_giftCard_metadata | null)[];
  privateMetadata: (GiftCardResend_giftCardResend_giftCard_privateMetadata | null)[];
  last4CodeChars: string;
  boughtInChannel: string | null;
  createdBy: GiftCardResend_giftCardResend_giftCard_createdBy | null;
  product: GiftCardResend_giftCardResend_giftCard_product | null;
  usedBy: GiftCardResend_giftCardResend_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardResend_giftCardResend_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardResend_giftCardResend_giftCard_initialBalance | null;
  currentBalance: GiftCardResend_giftCardResend_giftCard_currentBalance | null;
  id: string;
  tags: GiftCardResend_giftCardResend_giftCard_tags[];
}

export interface GiftCardResend_giftCardResend {
  __typename: "GiftCardResend";
  errors: GiftCardResend_giftCardResend_errors[];
  giftCard: GiftCardResend_giftCardResend_giftCard | null;
}

export interface GiftCardResend {
  giftCardResend: GiftCardResend_giftCardResend | null;
}

export interface GiftCardResendVariables {
  input: GiftCardResendInput;
}
