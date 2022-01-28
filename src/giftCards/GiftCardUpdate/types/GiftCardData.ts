/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GiftCardData
// ====================================================

export interface GiftCardData_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardData_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardData_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardData_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardData_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardData_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardData_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardData_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardData_tags {
  __typename: "GiftCardTag";
  name: string;
}

export interface GiftCardData {
  __typename: "GiftCard";
  metadata: (GiftCardData_metadata | null)[];
  privateMetadata: (GiftCardData_privateMetadata | null)[];
  last4CodeChars: string;
  boughtInChannel: string | null;
  createdBy: GiftCardData_createdBy | null;
  product: GiftCardData_product | null;
  usedBy: GiftCardData_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardData_app | null;
  created: any;
  expiryDate: any | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardData_initialBalance | null;
  currentBalance: GiftCardData_currentBalance | null;
  id: string;
  tags: GiftCardData_tags[];
}
