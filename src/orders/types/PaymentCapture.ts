/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentErrorCode, PaymentChargeStatusEnum, OrderAction, OrderPaymentStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PaymentCapture
// ====================================================

export interface PaymentCapture_paymentCapture_errors {
  __typename: "PaymentError";
  code: PaymentErrorCode;
  field: string | null;
  message: string | null;
}

export interface PaymentCapture_paymentCapture_payment_total {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentCapture_paymentCapture_payment_capturedAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentCapture_paymentCapture_payment_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentCapture_paymentCapture_payment_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentCapture_paymentCapture_payment_order {
  __typename: "Order";
  id: string;
  paymentStatus: OrderPaymentStatusEnum;
  totalCaptured: PaymentCapture_paymentCapture_payment_order_totalCaptured;
  totalAuthorized: PaymentCapture_paymentCapture_payment_order_totalAuthorized;
  actions: (OrderAction | null)[];
}

export interface PaymentCapture_paymentCapture_payment {
  __typename: "Payment";
  id: string;
  total: PaymentCapture_paymentCapture_payment_total | null;
  capturedAmount: PaymentCapture_paymentCapture_payment_capturedAmount | null;
  gatewayName: string;
  pspReference: string | null;
  chargeStatus: PaymentChargeStatusEnum;
  actions: (OrderAction | null)[];
  order: PaymentCapture_paymentCapture_payment_order | null;
}

export interface PaymentCapture_paymentCapture {
  __typename: "PaymentCapture";
  errors: PaymentCapture_paymentCapture_errors[];
  payment: PaymentCapture_paymentCapture_payment | null;
}

export interface PaymentCapture {
  paymentCapture: PaymentCapture_paymentCapture | null;
}

export interface PaymentCaptureVariables {
  id: string;
  amount: any;
}
