/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrderFulfillSettings
// ====================================================

export interface OrderFulfillSettings_shop {
  __typename: "Shop";
  fulfillmentAutoApprove: boolean;
  fulfillmentAllowUnpaid: boolean;
}

export interface OrderFulfillSettings {
  shop: OrderFulfillSettings_shop;
}
