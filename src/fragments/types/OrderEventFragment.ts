/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderEventsEmailsEnum, OrderEventsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: OrderEventFragment
// ====================================================

export interface OrderEventFragment_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderEventFragment_fulfilledItems_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderEventFragment_fulfilledItems {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderEventFragment_fulfilledItems_orderLine | null;
}

export interface OrderEventFragment {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderEventFragment_user | null;
  fulfilledItems: (OrderEventFragment_fulfilledItems | null)[] | null;
}
