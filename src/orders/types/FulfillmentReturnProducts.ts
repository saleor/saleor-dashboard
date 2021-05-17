/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderReturnProductsInput, OrderErrorCode, AddressTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: FulfillmentReturnProducts
// ====================================================

export interface FulfillmentReturnProducts_orderFulfillmentReturnProducts_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}

export interface FulfillmentReturnProducts_orderFulfillmentReturnProducts_order {
  __typename: "Order";
  id: string;
}

export interface FulfillmentReturnProducts_orderFulfillmentReturnProducts_replaceOrder {
  __typename: "Order";
  id: string;
}

export interface FulfillmentReturnProducts_orderFulfillmentReturnProducts {
  __typename: "FulfillmentReturnProducts";
  errors: FulfillmentReturnProducts_orderFulfillmentReturnProducts_errors[];
  order: FulfillmentReturnProducts_orderFulfillmentReturnProducts_order | null;
  replaceOrder: FulfillmentReturnProducts_orderFulfillmentReturnProducts_replaceOrder | null;
}

export interface FulfillmentReturnProducts {
  orderFulfillmentReturnProducts: FulfillmentReturnProducts_orderFulfillmentReturnProducts | null;
}

export interface FulfillmentReturnProductsVariables {
  id: string;
  input: OrderReturnProductsInput;
}
