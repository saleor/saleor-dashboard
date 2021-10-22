/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentChargeStatusEnum, OrderAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PaymentFragment
// ====================================================

export interface PaymentFragment_total {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentFragment_capturedAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PaymentFragment {
  __typename: "Payment";
  id: string;
  total: PaymentFragment_total | null;
  capturedAmount: PaymentFragment_capturedAmount | null;
  gatewayName: string;
  pspReference: string | null;
  chargeStatus: PaymentChargeStatusEnum;
  actions: (OrderAction | null)[];
}
