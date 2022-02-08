/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardUpdateInput, GiftCardErrorCode, GiftCardEventsEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardUpdate
// ====================================================

export interface GiftCardUpdate_giftCardUpdate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_tags {
  __typename: "GiftCardTag";
  name: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_balance_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_balance_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_balance_oldInitialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_balance_oldCurrentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events_balance {
  __typename: "GiftCardEventBalance";
  initialBalance: GiftCardUpdate_giftCardUpdate_giftCard_events_balance_initialBalance | null;
  currentBalance: GiftCardUpdate_giftCardUpdate_giftCard_events_balance_currentBalance;
  oldInitialBalance: GiftCardUpdate_giftCardUpdate_giftCard_events_balance_oldInitialBalance | null;
  oldCurrentBalance: GiftCardUpdate_giftCardUpdate_giftCard_events_balance_oldCurrentBalance | null;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard_events {
  __typename: "GiftCardEvent";
  expiryDate: any | null;
  oldExpiryDate: any | null;
  id: string;
  date: any | null;
  type: GiftCardEventsEnum | null;
  user: GiftCardUpdate_giftCardUpdate_giftCard_events_user | null;
  app: GiftCardUpdate_giftCardUpdate_giftCard_events_app | null;
  message: string | null;
  email: string | null;
  orderId: string | null;
  orderNumber: string | null;
  tags: string[] | null;
  oldTags: string[] | null;
  balance: GiftCardUpdate_giftCardUpdate_giftCard_events_balance | null;
}

export interface GiftCardUpdate_giftCardUpdate_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardUpdate_giftCardUpdate_giftCard_metadata | null)[];
  privateMetadata: (GiftCardUpdate_giftCardUpdate_giftCard_privateMetadata | null)[];
  last4CodeChars: string;
  boughtInChannel: string | null;
  createdBy: GiftCardUpdate_giftCardUpdate_giftCard_createdBy | null;
  product: GiftCardUpdate_giftCardUpdate_giftCard_product | null;
  usedBy: GiftCardUpdate_giftCardUpdate_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardUpdate_giftCardUpdate_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardUpdate_giftCardUpdate_giftCard_initialBalance | null;
  currentBalance: GiftCardUpdate_giftCardUpdate_giftCard_currentBalance | null;
  id: string;
  tags: GiftCardUpdate_giftCardUpdate_giftCard_tags[];
  events: GiftCardUpdate_giftCardUpdate_giftCard_events[];
}

export interface GiftCardUpdate_giftCardUpdate {
  __typename: "GiftCardUpdate";
  errors: GiftCardUpdate_giftCardUpdate_errors[];
  giftCard: GiftCardUpdate_giftCardUpdate_giftCard | null;
}

export interface GiftCardUpdate {
  giftCardUpdate: GiftCardUpdate_giftCardUpdate | null;
}

export interface GiftCardUpdateVariables {
  id: string;
  input: GiftCardUpdateInput;
}
