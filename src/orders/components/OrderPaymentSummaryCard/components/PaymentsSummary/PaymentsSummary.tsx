import { OrderDetailsFragment } from "@dashboard/graphql";
import { CardContent } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import SummaryLine from "../../../OrderSummaryCard/SummaryLine";
import { SummaryList } from "../../../OrderSummaryCard/SummaryList";
import { orderPaymentMessages } from "../../messages";
import { useStyles } from "../../styles";
import { getShouldDisplayAmounts } from "./utils";

interface PaymentsSummaryProps {
  order: OrderDetailsFragment;
}

export const PaymentsSummary: React.FC<PaymentsSummaryProps> = ({ order }) => {
  const classes = useStyles();
  const shouldDisplay = getShouldDisplayAmounts(order);

  return (
    <CardContent>
      <SummaryList className={classes.amountGrid}>
        <SummaryLine
          text={<FormattedMessage {...orderPaymentMessages.authorized} />}
          money={order.totalAuthorized}
        />

        {shouldDisplay.authorizedPending && (
          <SummaryLine
            hideEmpty
            text={<FormattedMessage {...orderPaymentMessages.authorized} />}
            subText={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalAuthorizePending}
          />
        )}

        <SummaryLine
          text={<FormattedMessage {...orderPaymentMessages.captured} />}
          money={order.totalCharged}
        />

        {shouldDisplay.chargedPending && (
          <SummaryLine
            text={<FormattedMessage {...orderPaymentMessages.captured} />}
            subText={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalChargePending}
          />
        )}

        {shouldDisplay.cancelled && (
          <SummaryLine
            text={<FormattedMessage {...orderPaymentMessages.cancelled} />}
            money={order.totalCanceled}
          />
        )}

        {shouldDisplay.cancelledPending && (
          <SummaryLine
            hideEmpty
            text={<FormattedMessage {...orderPaymentMessages.cancelled} />}
            subText={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalCancelPending}
          />
        )}
      </SummaryList>
    </CardContent>
  );
};
