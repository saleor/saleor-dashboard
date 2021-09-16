/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrderSettings
// ====================================================

export interface OrderSettings_orderSettings {
  __typename: "OrderSettings";
  automaticallyConfirmAllNewOrders: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
}

export interface OrderSettings_shop {
  __typename: "Shop";
  fulfillmentAutoApprove: boolean;
  fulfillmentAllowUnpaid: boolean;
}

export interface OrderSettings {
  orderSettings: OrderSettings_orderSettings | null;
  shop: OrderSettings_shop;
}
