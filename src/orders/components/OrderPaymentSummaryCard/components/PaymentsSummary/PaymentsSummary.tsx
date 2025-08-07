import { DashboardCard } from "@dashboard/components/Card";
import { OrderDetailsFragment } from "@dashboard/graphql";
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

export const PaymentsSummary = ({ order }: PaymentsSummaryProps) => {
  const classes = useStyles();
  const shouldDisplay = getShouldDisplayAmounts(order);

  return (
    <DashboardCard.Content>
      <SummaryList className={classes.amountGrid}>
        <SummaryLine
          text={<FormattedMessage {...orderPaymentMessages.authorized} />}
          money={order.totalAuthorized}
        />

        {shouldDisplay.authorizedPending && (
          <SummaryLine
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

        <SummaryLine
          text={<FormattedMessage {...orderPaymentMessages.cancelled} />}
          money={order.totalCanceled}
        />

        {shouldDisplay.cancelledPending && (
          <SummaryLine
            text={<FormattedMessage {...orderPaymentMessages.cancelled} />}
            subText={<FormattedMessage {...orderPaymentMessages.pending} />}
            money={order.totalCancelPending}
          />
        )}
      </SummaryList>
    </DashboardCard.Content>
  );
};
