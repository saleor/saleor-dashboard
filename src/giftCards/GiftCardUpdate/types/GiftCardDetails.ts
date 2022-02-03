/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardEventsEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GiftCardDetails
// ====================================================

export interface GiftCardDetails_giftCard_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardDetails_giftCard_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardDetails_giftCard_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardDetails_giftCard_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardDetails_giftCard_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardDetails_giftCard_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardDetails_giftCard_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDetails_giftCard_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDetails_giftCard_tags {
  __typename: "GiftCardTag";
  name: string;
}

export interface GiftCardDetails_giftCard_events_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface GiftCardDetails_giftCard_events_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardDetails_giftCard_events_balance_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDetails_giftCard_events_balance_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDetails_giftCard_events_balance_oldInitialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDetails_giftCard_events_balance_oldCurrentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardDetails_giftCard_events_balance {
  __typename: "GiftCardEventBalance";
  initialBalance: GiftCardDetails_giftCard_events_balance_initialBalance | null;
  currentBalance: GiftCardDetails_giftCard_events_balance_currentBalance;
  oldInitialBalance: GiftCardDetails_giftCard_events_balance_oldInitialBalance | null;
  oldCurrentBalance: GiftCardDetails_giftCard_events_balance_oldCurrentBalance | null;
}

export interface GiftCardDetails_giftCard_events {
  __typename: "GiftCardEvent";
  expiryDate: any | null;
  oldExpiryDate: any | null;
  id: string;
  date: any | null;
  type: GiftCardEventsEnum | null;
  user: GiftCardDetails_giftCard_events_user | null;
  app: GiftCardDetails_giftCard_events_app | null;
  message: string | null;
  orderId: string | null;
  orderNumber: string | null;
  tags: string[] | null;
  oldTags: string[] | null;
  balance: GiftCardDetails_giftCard_events_balance | null;
}

export interface GiftCardDetails_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardDetails_giftCard_metadata | null)[];
  privateMetadata: (GiftCardDetails_giftCard_privateMetadata | null)[];
  last4CodeChars: string;
  boughtInChannel: string | null;
  createdBy: GiftCardDetails_giftCard_createdBy | null;
  product: GiftCardDetails_giftCard_product | null;
  usedBy: GiftCardDetails_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardDetails_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardDetails_giftCard_initialBalance | null;
  currentBalance: GiftCardDetails_giftCard_currentBalance | null;
  id: string;
  tags: GiftCardDetails_giftCard_tags[];
  events: GiftCardDetails_giftCard_events[];
}

export interface GiftCardDetails {
  giftCard: GiftCardDetails_giftCard | null;
}

export interface GiftCardDetailsVariables {
  id: string;
}
