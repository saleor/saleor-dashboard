/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardExpiryType, TimePeriodType } from "./../../../types/globalTypes";

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

export interface GiftCardDetails_giftCard_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
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

export interface GiftCardDetails_giftCard_expiryPeriod {
  __typename: "TimePeriod";
  amount: number | null;
  type: TimePeriodType | null;
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

export interface GiftCardDetails_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardDetails_giftCard_metadata | null)[];
  privateMetadata: (GiftCardDetails_giftCard_privateMetadata | null)[];
  code: string;
  user: GiftCardDetails_giftCard_user | null;
  usedBy: GiftCardDetails_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardDetails_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  expiryType: GiftCardExpiryType | null;
  expiryPeriod: GiftCardDetails_giftCard_expiryPeriod | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardDetails_giftCard_initialBalance | null;
  currentBalance: GiftCardDetails_giftCard_currentBalance | null;
  id: string;
  displayCode: string | null;
  tag: string | null;
}

export interface GiftCardDetails {
  giftCard: GiftCardDetails_giftCard | null;
}

export interface GiftCardDetailsVariables {
  id: string;
}
