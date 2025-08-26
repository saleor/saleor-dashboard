import { OrderDetailsFragment } from "@dashboard/graphql";

import { PaymentState } from "./types";

interface ShouldDisplayResult {
  state: PaymentState;
  authorized: boolean;
  charged: boolean;
  cancelled: boolean;
  authorizedPending: boolean;
  chargedPending: boolean;
  cancelledPending: boolean;
}

export interface OrderTotalAmounts {
  totalAuthorized: OrderDetailsFragment["totalAuthorized"];
  totalCaptured: OrderDetailsFragment["totalCaptured"];
  totalRefunded: OrderDetailsFragment["totalRefunded"];
  totalBalance: OrderDetailsFragment["totalBalance"];
  total: OrderDetailsFragment["total"];
  totalAuthorizePending: OrderDetailsFragment["totalAuthorizePending"];
  totalCharged: OrderDetailsFragment["totalCharged"];
  totalChargePending: OrderDetailsFragment["totalChargePending"];
  totalCanceled: OrderDetailsFragment["totalCanceled"];
  totalCancelPending: OrderDetailsFragment["totalCancelPending"];
}

export const getShouldDisplayAmounts = (orderAmounts?: OrderTotalAmounts): ShouldDisplayResult => {
  if (!orderAmounts) {
    return {
      state: PaymentState.NO_DATA,
      authorized: false,
      charged: false,
      cancelled: false,
      authorizedPending: false,
      chargedPending: false,
      cancelledPending: false,
    };
  }

  const authorized = orderAmounts.totalAuthorized?.amount ?? 0;
  const authorizePending = orderAmounts.totalAuthorizePending?.amount ?? 0;
  const charged = orderAmounts.totalCharged?.amount ?? 0;
  const chargePending = orderAmounts.totalChargePending?.amount ?? 0;
  const cancelled = orderAmounts.totalCanceled?.amount ?? 0;
  const cancelPending = orderAmounts.totalCancelPending?.amount ?? 0;
  const total = orderAmounts.total.gross?.amount ?? 0;
  const anyPending = authorizePending > 0 || chargePending > 0 || cancelPending > 0;

  if (anyPending) {
    return {
      state: PaymentState.IS_PENDING,
      authorized: !!authorized || !!authorizePending,
      charged: true,
      cancelled: true,
      authorizedPending: authorizePending > 0,
      chargedPending: chargePending > 0,
      cancelledPending: cancelPending > 0,
    };
  }

  if (authorized && charged) {
    return {
      state: PaymentState.AMOUNTS_MISMATCH,
      authorized: true,
      charged: true,
      cancelled: !!cancelled,
      authorizedPending: false,
      chargedPending: false,
      cancelledPending: false,
    };
  }

  if (charged !== 0 && charged !== total) {
    return {
      state: PaymentState.PARTIAL_CAPTURE,
      authorized: false,
      charged: true,
      cancelled: !!cancelled,
      authorizedPending: false,
      chargedPending: false,
      cancelledPending: false,
    };
  }

  if (authorized !== 0) {
    return {
      state: PaymentState.PARTIAL_AUTHORIZED,
      authorized: true,
      charged: false,
      cancelled: !!cancelled,
      authorizedPending: false,
      chargedPending: false,
      cancelledPending: false,
    };
  }

  if (cancelled) {
    return {
      state: PaymentState.AMOUNTS_MISMATCH,
      authorized: false,
      charged: false,
      cancelled: true,
      authorizedPending: false,
      chargedPending: false,
      cancelledPending: false,
    };
  }

  return {
    state: PaymentState.FULLY_SETTLED,
    charged: false,
    authorized: false,
    cancelled: false,
    authorizedPending: false,
    chargedPending: false,
    cancelledPending: false,
  };
};

export const shouldHideSummary = (result: ShouldDisplayResult) =>
  [PaymentState.FULLY_SETTLED, PaymentState.NO_DATA].includes(result.state);
