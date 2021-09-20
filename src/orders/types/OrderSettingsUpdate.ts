/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderSettingsUpdateInput, ShopSettingsInput, OrderSettingsErrorCode, ShopErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderSettingsUpdate
// ====================================================

export interface OrderSettingsUpdate_orderSettingsUpdate_errors {
  __typename: "OrderSettingsError";
  code: OrderSettingsErrorCode;
  field: string | null;
}

export interface OrderSettingsUpdate_orderSettingsUpdate_orderSettings {
  __typename: "OrderSettings";
  automaticallyConfirmAllNewOrders: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
}

export interface OrderSettingsUpdate_orderSettingsUpdate {
  __typename: "OrderSettingsUpdate";
  errors: OrderSettingsUpdate_orderSettingsUpdate_errors[];
  orderSettings: OrderSettingsUpdate_orderSettingsUpdate_orderSettings | null;
}

export interface OrderSettingsUpdate_shopSettingsUpdate_errors {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
}

export interface OrderSettingsUpdate_shopSettingsUpdate_shop {
  __typename: "Shop";
  fulfillmentAutoApprove: boolean;
  fulfillmentAllowUnpaid: boolean;
}

export interface OrderSettingsUpdate_shopSettingsUpdate {
  __typename: "ShopSettingsUpdate";
  errors: OrderSettingsUpdate_shopSettingsUpdate_errors[];
  shop: OrderSettingsUpdate_shopSettingsUpdate_shop | null;
}

export interface OrderSettingsUpdate {
  orderSettingsUpdate: OrderSettingsUpdate_orderSettingsUpdate | null;
  shopSettingsUpdate: OrderSettingsUpdate_shopSettingsUpdate | null;
}

export interface OrderSettingsUpdateVariables {
  orderSettingsInput: OrderSettingsUpdateInput;
  shopSettingsInput: ShopSettingsInput;
}
