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
}

export interface ShopOrderSettings_shop {
  __typename: "Shop";
  fulfillmentAutoConfirm: boolean;
  fulfillmentAllowUnpaid: boolean;
}

export interface OrderSettings {
  orderSettings: OrderSettings_orderSettings | null;
  shop: ShopOrderSettings_shop | null;
}
