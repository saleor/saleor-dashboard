/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentErrorCode, PaymentChargeStatusEnum, OrderAction, OrderPaymentStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PaymentVoid
// ====================================================

export interface PaymentVoid_paymentVoid_errors {
  __typename: "PaymentError";
  code: PaymentErrorCode;
  field: string | null;
  message: string | null;
}

export interface PaymentVoid_paymentVoid_payment_total {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentVoid_paymentVoid_payment_capturedAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentVoid_paymentVoid_payment_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentVoid_paymentVoid_payment_order {
  __typename: "Order";
  paymentStatus: OrderPaymentStatusEnum;
  totalCaptured: PaymentVoid_paymentVoid_payment_order_totalCaptured;
  actions: (OrderAction | null)[];
}

export interface PaymentVoid_paymentVoid_payment {
  __typename: "Payment";
  id: string;
  total: PaymentVoid_paymentVoid_payment_total | null;
  capturedAmount: PaymentVoid_paymentVoid_payment_capturedAmount | null;
  gatewayName: string;
  pspReference: string | null;
  chargeStatus: PaymentChargeStatusEnum;
  actions: (OrderAction | null)[];
  order: PaymentVoid_paymentVoid_payment_order | null;
}

export interface PaymentVoid_paymentVoid {
  __typename: "PaymentVoid";
  errors: PaymentVoid_paymentVoid_errors[];
  payment: PaymentVoid_paymentVoid_payment | null;
}

export interface PaymentVoid {
  paymentVoid: PaymentVoid_paymentVoid | null;
}

export interface PaymentVoidVariables {
  id: string;
}
