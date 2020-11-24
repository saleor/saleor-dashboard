/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderSettingsUpdateInput, OrderSettingsErrorCode } from "./../../types/globalTypes";

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
}

export interface OrderSettingsUpdate_orderSettingsUpdate {
  __typename: "OrderSettingsUpdate";
  errors: OrderSettingsUpdate_orderSettingsUpdate_errors[];
  orderSettings: OrderSettingsUpdate_orderSettingsUpdate_orderSettings | null;
}

export interface OrderSettingsUpdate {
  orderSettingsUpdate: OrderSettingsUpdate_orderSettingsUpdate | null;
}

export interface OrderSettingsUpdateVariables {
  input: OrderSettingsUpdateInput;
}
