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

export const getShouldDisplayAmounts = (order: OrderDetailsFragment) => {
  if (!order) {
    return {
      authorized: false,
      captured: false,
    };
  }

  const authorized = order.totalAuthorized?.amount ?? 0;
  const captured = order.totalCaptured?.amount ?? 0;
  const total = order.total.gross?.amount ?? 0;

  if (authorized && captured) {
    // different amounts
    return {
      authorized: true,
      captured: true,
    };
  }

  if (captured !== 0 && captured !== total) {
    // partial capture
    return {
      authorized: false,
      captured: true,
    };
  }

  if (authorized !== 0) {
    // not fully authorized
    return {
      authorized: true,
      captured: false,
    };
  }

  // fully paid / not paid at all
  return {
    authorized: false,
    captured: false,
  };
};

export const PaymentsSummary: React.FC<PaymentsSummaryProps> = ({ order }) => {
  const classes = useStyles();
  const shouldDisplay = getShouldDisplayAmounts(order);

  if (!(shouldDisplay.authorized || shouldDisplay.captured)) {
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
