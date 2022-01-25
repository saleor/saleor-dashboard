/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardFilterInput } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: CustomerGiftCardList
// ====================================================

export interface CustomerGiftCardList_giftCards_edges_node_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CustomerGiftCardList_giftCards_edges_node {
  __typename: "GiftCard";
  id: string;
  last4CodeChars: string;
  expiryDate: any | null;
  isActive: boolean;
  currentBalance: CustomerGiftCardList_giftCards_edges_node_currentBalance | null;
}

export interface CustomerGiftCardList_giftCards_edges {
  __typename: "GiftCardCountableEdge";
  node: CustomerGiftCardList_giftCards_edges_node;
}

export interface CustomerGiftCardList_giftCards {
  __typename: "GiftCardCountableConnection";
  edges: CustomerGiftCardList_giftCards_edges[];
}

export interface CustomerGiftCardList {
  giftCards: CustomerGiftCardList_giftCards | null;
}

export interface CustomerGiftCardListVariables {
  first?: number | null;
  filter?: GiftCardFilterInput | null;
}
