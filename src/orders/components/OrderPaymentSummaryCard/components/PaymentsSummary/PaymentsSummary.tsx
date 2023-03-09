import { OrderDetailsFragment } from "@dashboard/graphql/transactions";
import { CardContent } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

import SummaryLine from "../../../OrderSummaryCard/SummaryLine";
import { SummaryList } from "../../../OrderSummaryCard/SummaryList";
import { orderPaymentMessages } from "../../messages";
import { useStyles } from "../../styles";
import { getShouldDisplayAmounts, shouldHideSummary } from "./utils";

interface PaymentsSummaryProps {
  order: OrderDetailsFragment;
}

export const PaymentsSummary: React.FC<PaymentsSummaryProps> = ({ order }) => {
  const classes = useStyles();
  const shouldDisplay = getShouldDisplayAmounts(order);

  if (shouldHideSummary(shouldDisplay)) {
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

        {shouldDisplay.charged && (
          <SummaryLine
            vertical
            text={<FormattedMessage {...orderPaymentMessages.captured} />}
            money={order.totalCharged}
          />
        )}

        {shouldDisplay.cancelled && (
          <SummaryLine
            vertical
            text={<FormattedMessage {...orderPaymentMessages.cancelled} />}
            money={order.totalCanceled}
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
