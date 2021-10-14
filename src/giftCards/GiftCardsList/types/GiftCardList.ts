/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardFilterInput } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GiftCardList
// ====================================================

export interface GiftCardList_giftCards_edges_node_product {
  __typename: "Product";
  id: string;
  name: string;
}

export interface GiftCardList_giftCards_edges_node_usedBy {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GiftCardList_giftCards_edges_node_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface GiftCardList_giftCards_edges_node {
  __typename: "GiftCard";
  id: string;
  usedByEmail: string | null;
  displayCode: string;
  isActive: boolean;
  expiryDate: any | null;
  product: GiftCardList_giftCards_edges_node_product | null;
  tag: string | null;
  usedBy: GiftCardList_giftCards_edges_node_usedBy | null;
  currentBalance: GiftCardList_giftCards_edges_node_currentBalance | null;
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
  filter?: GiftCardFilterInput | null;
}
