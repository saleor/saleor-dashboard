/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardErrorCode, GiftCardExpiryTypeEnum, TimePeriodTypeEnum } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardActivate
// ====================================================

export interface GiftCardActivate_giftCardActivate_errors {
  __typename: "GiftCardError";
  code: GiftCardErrorCode;
  field: string | null;
}

export interface GiftCardActivate_giftCardActivate_giftCard_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardActivate_giftCardActivate_giftCard_expiryPeriod {
  __typename: "TimePeriod";
  amount: number;
  type: TimePeriodTypeEnum;
}

export interface GiftCardActivate_giftCardActivate_giftCard_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardActivate_giftCardActivate_giftCard {
  __typename: "GiftCard";
  metadata: (GiftCardActivate_giftCardActivate_giftCard_metadata | null)[];
  privateMetadata: (GiftCardActivate_giftCardActivate_giftCard_privateMetadata | null)[];
  displayCode: string;
  createdBy: GiftCardActivate_giftCardActivate_giftCard_createdBy | null;
  product: GiftCardActivate_giftCardActivate_giftCard_product | null;
  user: GiftCardActivate_giftCardActivate_giftCard_user | null;
  usedBy: GiftCardActivate_giftCardActivate_giftCard_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardActivate_giftCardActivate_giftCard_app | null;
  created: any;
  expiryDate: any | null;
  expiryType: GiftCardExpiryTypeEnum;
  expiryPeriod: GiftCardActivate_giftCardActivate_giftCard_expiryPeriod | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardActivate_giftCardActivate_giftCard_initialBalance | null;
  currentBalance: GiftCardActivate_giftCardActivate_giftCard_currentBalance | null;
  id: string;
  tag: string | null;
}

export interface GiftCardActivate_giftCardActivate {
  __typename: "GiftCardActivate";
  errors: GiftCardActivate_giftCardActivate_errors[];
  giftCard: GiftCardActivate_giftCardActivate_giftCard | null;
}

export interface GiftCardActivate {
  giftCardActivate: GiftCardActivate_giftCardActivate | null;
}

export interface GiftCardActivateVariables {
  id: string;
}
