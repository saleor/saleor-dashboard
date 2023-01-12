import { CardContent } from "@material-ui/core";
import { OrderDetailsFragment } from "@saleor/graphql";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

import SummaryLine from "../../OrderSummaryCard/SummaryLine";
import { SummaryList } from "../../OrderSummaryCard/SummaryList";
import { orderPaymentMessages } from "../messages";
import { useStyles } from "../styles";

interface PaymentsSummaryProps {
  order: OrderDetailsFragment;
}

enum PaymentState {
  NO_DATA,
  AMOUNTS_MISMATCH,
  PARTIAL_CAPTURE,
  PARTIAL_AUTHORIZED,
  FULLY_SETTLED,
  IS_PENDING,
}

export const getShouldDisplayAmounts = (order: OrderDetailsFragment) => {
  if (!order) {
    return {
      state: PaymentState.NO_DATA,
      authorized: false,
      captured: false,
      pending: false,
    };
  }

  const authorized = order.totalAuthorized?.amount ?? 0;
  const authorizePending = order.totalAuthorizePending?.amount ?? 0;

  const captured = order.totalCaptured?.amount ?? 0;
  const capturePending = order.totalChargePending?.amount ?? 0;

  const cancelled = 0; // TODO: Add cancelled value
  const cancelPending = order.totalCancelPending?.amount ?? 0;

  const total = order.total.gross?.amount ?? 0;
  const anyPending =
    authorizePending > 0 || capturePending > 0 || cancelPending > 0;

  if (anyPending) {
    return {
      state: PaymentState.IS_PENDING,
      authorized: authorized || authorizePending,
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

export const PaymentsSummary: React.FC<PaymentsSummaryProps> = ({ order }) => {
  const classes = useStyles();
  const shouldDisplay = getShouldDisplayAmounts(order);

  if (
    [PaymentState.FULLY_SETTLED, PaymentState.NO_DATA].includes(
      shouldDisplay.state,
    )
  ) {
    return null;
  }

  return (
    <CardContent>
      <SummaryList className={classes.amountGrid}>
        {shouldDisplay.authorized && (
          <SummaryLine
            vertical
            text={<FormattedMessage {...orderPaymentMessages.authorized} />}
            money={order.totalAuthorized}
          />
        )}

        {shouldDisplay.captured && (
          <SummaryLine
            vertical
            text={<FormattedMessage {...orderPaymentMessages.captured} />}
            money={order.totalCaptured}
          />
        )}

        {shouldDisplay.cancelled && (
          <SummaryLine
            vertical
            text={<FormattedMessage {...orderPaymentMessages.cancelled} />}
            money={{
              // TODO: Add cancelled amount
              amount: 0,
              currency: order.totalCancelPending.currency,
            }}
          />
        )}
      </SummaryList>
      {shouldDisplay.pending && (
        <SummaryList className={clsx(classes.amountGrid, classes.pendingGrid)}>
          <SummaryLine
            vertical
            hideEmpty
            text={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalAuthorizePending}
          />
          <SummaryLine
            vertical
            hideEmpty
            text={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalChargePending}
          />
          <SummaryLine
            vertical
            hideEmpty
            text={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalCancelPending}
          />
        </SummaryList>
      )}
    </CardContent>
  );
};
