/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderReturnCreateInput, OrderErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderReturnCreate
// ====================================================

export interface OrderReturnCreate_orderReturnCreate_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderReturnCreate_orderReturnCreate_order {
  __typename: "Order";
  id: string;
}

export interface OrderReturnCreate_orderReturnCreate_replaceOrder {
  __typename: "Order";
  id: string;
}

export interface OrderReturnCreate_orderReturnCreate {
  __typename: "OrderReturnCreate";
  errors: OrderReturnCreate_orderReturnCreate_errors[];
  order: OrderReturnCreate_orderReturnCreate_order | null;
  replaceOrder: OrderReturnCreate_orderReturnCreate_replaceOrder | null;
}

export interface OrderReturnCreate {
  orderReturnCreate: OrderReturnCreate_orderReturnCreate | null;
}

export interface OrderReturnCreateVariables {
  input: OrderReturnCreateInput;
}
