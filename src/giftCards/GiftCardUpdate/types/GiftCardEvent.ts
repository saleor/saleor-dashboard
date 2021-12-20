/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardEventsEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL fragment: GiftCardEvent
// ====================================================

export interface GiftCardEvent_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardEvent_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardEvent_balance_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardEvent_balance_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardEvent_balance_oldInitialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardEvent_balance_oldCurrentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardEvent_balance {
  __typename: "GiftCardEventBalance";
  initialBalance: GiftCardEvent_balance_initialBalance | null;
  currentBalance: GiftCardEvent_balance_currentBalance;
  oldInitialBalance: GiftCardEvent_balance_oldInitialBalance | null;
  oldCurrentBalance: GiftCardEvent_balance_oldCurrentBalance | null;
}

export interface GiftCardEvent {
  __typename: "GiftCardEvent";
  expiryDate: any | null;
  oldExpiryDate: any | null;
  id: string;
  date: any | null;
  type: GiftCardEventsEnum | null;
  user: GiftCardEvent_user | null;
  app: GiftCardEvent_app | null;
  message: string | null;
  email: string | null;
  orderId: string | null;
  orderNumber: string | null;
  tags: string[] | null;
  oldTags: string[] | null;
  balance: GiftCardEvent_balance | null;
}
