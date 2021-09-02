/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GiftCardProductsCount
// ====================================================

export interface GiftCardProductsCount_giftCardProductTypes {
  __typename: "ProductTypeCountableConnection";
  totalCount: number | null;
}

export interface GiftCardProductsCount_giftCardProducts {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface GiftCardProductsCount {
  giftCardProductTypes: GiftCardProductsCount_giftCardProductTypes | null;
  giftCardProducts: GiftCardProductsCount_giftCardProducts | null;
}
