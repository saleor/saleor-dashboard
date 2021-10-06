/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardFilterInput } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: CustomerGiftCardList
// ====================================================

export interface CustomerGiftCardList_giftCards_edges_node {
  __typename: "GiftCard";
  id: string;
  displayCode: string;
  expiryDate: any | null;
  isActive: boolean;
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
