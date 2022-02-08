/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardDeactivate
// ====================================================

export interface GiftCardDeactivate_giftCardDeactivate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard_tags {
  __typename: "GiftCardTag";
  name: string;
}

export interface GiftCardDeactivate_giftCardDeactivate_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardDeactivate_giftCardDeactivate_giftCard_metadata | null)[];
  privateMetadata: (GiftCardDeactivate_giftCardDeactivate_giftCard_privateMetadata | null)[];
  last4CodeChars: string;
  boughtInChannel: string | null;
  createdBy: GiftCardDeactivate_giftCardDeactivate_giftCard_createdBy | null;
  product: GiftCardDeactivate_giftCardDeactivate_giftCard_product | null;
  usedBy: GiftCardDeactivate_giftCardDeactivate_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardDeactivate_giftCardDeactivate_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardDeactivate_giftCardDeactivate_giftCard_initialBalance | null;
  currentBalance: GiftCardDeactivate_giftCardDeactivate_giftCard_currentBalance | null;
  id: string;
  tags: GiftCardDeactivate_giftCardDeactivate_giftCard_tags[];
}

export interface GiftCardDeactivate_giftCardDeactivate {
  __typename: "GiftCardDeactivate";
  errors: GiftCardDeactivate_giftCardDeactivate_errors[];
  giftCard: GiftCardDeactivate_giftCardDeactivate_giftCard | null;
}

export interface GiftCardDeactivate {
  giftCardDeactivate: GiftCardDeactivate_giftCardDeactivate | null;
}

export interface GiftCardDeactivateVariables {
  id: string;
}
