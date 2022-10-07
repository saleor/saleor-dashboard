import { CardContent } from "@material-ui/core";
import { OrderDetailsFragment } from "@saleor/graphql";
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
}

export const getShouldDisplayAmounts = (order: OrderDetailsFragment) => {
  if (!order) {
    return {
      state: PaymentState.NO_DATA,
      authorized: false,
      captured: false,
    };
  }

  const authorized = order.totalAuthorized?.amount ?? 0;
  const captured = order.totalCaptured?.amount ?? 0;
  const total = order.total.gross?.amount ?? 0;

  if (authorized && captured) {
    return {
      state: PaymentState.AMOUNTS_MISMATCH,
      authorized: true,
      captured: true,
    };
  }

  if (captured !== 0 && captured !== total) {
    return {
      state: PaymentState.PARTIAL_CAPTURE,
      authorized: false,
      captured: true,
    };
  }

  if (authorized !== 0) {
    return {
      state: PaymentState.PARTIAL_AUTHORIZED,
      authorized: true,
      captured: false,
    };
  }

  return {
    state: PaymentState.FULLY_SETTLED,
    captured: false,
    authorized: false,
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
      </SummaryList>
    </CardContent>
  );
};
