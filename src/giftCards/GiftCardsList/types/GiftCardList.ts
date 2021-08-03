/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardExpiryTypeEnum, TimePeriodTypeEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GiftCardList
// ====================================================

export interface GiftCardList_giftCards_edges_node_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardList_giftCards_edges_node_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface GiftCardList_giftCards_edges_node_createdBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardList_giftCards_edges_node_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardList_giftCards_edges_node_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardList_giftCards_edges_node_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardList_giftCards_edges_node_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface GiftCardList_giftCards_edges_node_expiryPeriod {
  __typename: "TimePeriod";
  amount: number;
  type: TimePeriodTypeEnum;
}

export interface GiftCardList_giftCards_edges_node_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardList_giftCards_edges_node_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardList_giftCards_edges_node {
  __typename: "GiftCard";
  metadata: (GiftCardList_giftCards_edges_node_metadata | null)[];
  privateMetadata: (GiftCardList_giftCards_edges_node_privateMetadata | null)[];
  displayCode: string;
  createdBy: GiftCardList_giftCards_edges_node_createdBy | null;
  product: GiftCardList_giftCards_edges_node_product | null;
  user: GiftCardList_giftCards_edges_node_user | null;
  usedBy: GiftCardList_giftCards_edges_node_usedBy | null;
  usedByEmail: string | null;
  createdByEmail: string | null;
  app: GiftCardList_giftCards_edges_node_app | null;
  created: any;
  expiryDate: any | null;
  expiryType: GiftCardExpiryTypeEnum;
  expiryPeriod: GiftCardList_giftCards_edges_node_expiryPeriod | null;
  lastUsedOn: any | null;
  isActive: boolean;
  initialBalance: GiftCardList_giftCards_edges_node_initialBalance | null;
  currentBalance: GiftCardList_giftCards_edges_node_currentBalance | null;
  id: string;
  tag: string | null;
}

export interface GiftCardList_giftCards_edges {
  __typename: "GiftCardCountableEdge";
  node: GiftCardList_giftCards_edges_node;
}

export interface GiftCardList_giftCards_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface GiftCardList_giftCards {
  __typename: "GiftCardCountableConnection";
  edges: GiftCardList_giftCards_edges[];
  pageInfo: GiftCardList_giftCards_pageInfo;
}

export interface GiftCardList {
  giftCards: GiftCardList_giftCards | null;
}

export interface GiftCardListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
