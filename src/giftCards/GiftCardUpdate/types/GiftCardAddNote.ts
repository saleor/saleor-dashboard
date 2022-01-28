/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardAddNoteInput, GiftCardErrorCode, GiftCardEventsEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardAddNote
// ====================================================

export interface GiftCardAddNote_giftCardAddNote_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
  message: string | null;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard_tags {
  __typename: "GiftCardTag";
  name: string;
}

export interface GiftCardAddNote_giftCardAddNote_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardAddNote_giftCardAddNote_giftCard_metadata | null)[];
  privateMetadata: (GiftCardAddNote_giftCardAddNote_giftCard_privateMetadata | null)[];
  last4CodeChars: string;
  boughtInChannel: string | null;
  createdBy: GiftCardAddNote_giftCardAddNote_giftCard_createdBy | null;
  product: GiftCardAddNote_giftCardAddNote_giftCard_product | null;
  usedBy: GiftCardAddNote_giftCardAddNote_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardAddNote_giftCardAddNote_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardAddNote_giftCardAddNote_giftCard_initialBalance | null;
  currentBalance: GiftCardAddNote_giftCardAddNote_giftCard_currentBalance | null;
  id: string;
  tags: GiftCardAddNote_giftCardAddNote_giftCard_tags[];
}

export interface GiftCardAddNote_giftCardAddNote_event_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardAddNote_giftCardAddNote_event_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardAddNote_giftCardAddNote_event_balance_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardAddNote_giftCardAddNote_event_balance_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardAddNote_giftCardAddNote_event_balance_oldInitialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardAddNote_giftCardAddNote_event_balance_oldCurrentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardAddNote_giftCardAddNote_event_balance {
  __typename: "GiftCardEventBalance";
  initialBalance: GiftCardAddNote_giftCardAddNote_event_balance_initialBalance | null;
  currentBalance: GiftCardAddNote_giftCardAddNote_event_balance_currentBalance;
  oldInitialBalance: GiftCardAddNote_giftCardAddNote_event_balance_oldInitialBalance | null;
  oldCurrentBalance: GiftCardAddNote_giftCardAddNote_event_balance_oldCurrentBalance | null;
}

export interface GiftCardAddNote_giftCardAddNote_event {
  __typename: "GiftCardEvent";
  expiryDate: any | null;
  oldExpiryDate: any | null;
  id: string;
  date: any | null;
  type: GiftCardEventsEnum | null;
  user: GiftCardAddNote_giftCardAddNote_event_user | null;
  app: GiftCardAddNote_giftCardAddNote_event_app | null;
  message: string | null;
  email: string | null;
  orderId: string | null;
  orderNumber: string | null;
  tags: string[] | null;
  oldTags: string[] | null;
  balance: GiftCardAddNote_giftCardAddNote_event_balance | null;
}

export interface GiftCardAddNote_giftCardAddNote {
  __typename: "GiftCardAddNote";
  errors: GiftCardAddNote_giftCardAddNote_errors[];
  giftCard: GiftCardAddNote_giftCardAddNote_giftCard | null;
  event: GiftCardAddNote_giftCardAddNote_event | null;
}

export interface GiftCardAddNote {
  giftCardAddNote: GiftCardAddNote_giftCardAddNote | null;
}

export interface GiftCardAddNoteVariables {
  id: string;
  input: GiftCardAddNoteInput;
}
