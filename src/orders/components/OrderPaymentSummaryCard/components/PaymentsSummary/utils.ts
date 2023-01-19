import { OrderDetailsFragment } from "@saleor/graphql";

import { PaymentState } from "./types";

interface ShouldDisplayResult {
  state: PaymentState;
  authorized: boolean;
  captured: boolean;
  cancelled: boolean;
  pending: boolean;
}

export const getShouldDisplayAmounts = (
  order: OrderDetailsFragment | undefined,
): ShouldDisplayResult => {
  if (!order) {
    return {
      state: PaymentState.NO_DATA,
      authorized: false,
      captured: false,
      cancelled: false,
      pending: false,
    };
  }

  const authorized = order.totalAuthorized?.amount ?? 0;
  const authorizePending = order.totalAuthorizePending?.amount ?? 0;

  const captured = order.totalCaptured?.amount ?? 0;
  const capturePending = order.totalChargePending?.amount ?? 0;

  const cancelled = order.totalCanceled?.amount ?? 0;
  const cancelPending = order.totalCancelPending?.amount ?? 0;

  const total = order.total.gross?.amount ?? 0;
  const anyPending =
    authorizePending > 0 || capturePending > 0 || cancelPending > 0;

  if (anyPending) {
    return {
      state: PaymentState.IS_PENDING,
      authorized: !!authorized || !!authorizePending,
      captured: true,
      cancelled: true,
      pending: true,
    };
  }

  if (authorized && captured) {
    return {
      state: PaymentState.AMOUNTS_MISMATCH,
      authorized: true,
      captured: true,
      cancelled: !!cancelled,
      pending: false,
    };
  }

  if (captured !== 0 && captured !== total) {
    return {
      state: PaymentState.PARTIAL_CAPTURE,
      authorized: false,
      captured: true,
      cancelled: !!cancelled,
      pending: false,
    };
  }

  if (authorized !== 0) {
    return {
      state: PaymentState.PARTIAL_AUTHORIZED,
      authorized: true,
      captured: false,
      cancelled: !!cancelled,
      pending: false,
    };
  }

  if (cancelled) {
    return {
      state: PaymentState.AMOUNTS_MISMATCH,
      authorized: false,
      captured: false,
      cancelled: true,
      pending: false,
    };
  }

  return {
    state: PaymentState.FULLY_SETTLED,
    captured: false,
    authorized: false,
    cancelled: false,
    pending: false,
  };
};

export const shouldHideSummary = (result: ShouldDisplayResult) =>
  [PaymentState.FULLY_SETTLED, PaymentState.NO_DATA].includes(result.state);
