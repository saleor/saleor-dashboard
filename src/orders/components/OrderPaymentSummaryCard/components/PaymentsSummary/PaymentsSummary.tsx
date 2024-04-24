import { OrderDetailsFragment } from "@dashboard/graphql";
import { CardContent } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
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
        <Box fontSize={3}>
          <Text size={3}>
            <FormattedMessage {...orderPaymentMessages.authorized} />
          </Text>
          <Box paddingLeft={3} fontSize={2}>
            <SummaryLine
              hideEmpty
              text={
                <FormattedMessage {...orderPaymentMessages.authorizedAmount} />
              }
              money={order.totalAuthorized}
            />
            <SummaryLine
              hideEmpty
              text={<FormattedMessage {...orderPaymentMessages.pending} />}
              money={order.totalAuthorizePending}
            />
          </Box>
        </Box>

        <Box>
          <Text size={3}>
            <FormattedMessage {...orderPaymentMessages.captured} />
          </Text>
          <Box paddingLeft={3} fontSize={2}>
            <SummaryLine
              hideEmpty
              text={
                <FormattedMessage {...orderPaymentMessages.capturedAmount} />
              }
              money={order.totalCharged}
            />

            <SummaryLine
              hideEmpty
              text={<FormattedMessage {...orderPaymentMessages.pending} />}
              money={order.totalChargePending}
            />
          </Box>
        </Box>

        {shouldDisplay.cancelled && (
          <Box>
            <Text size={3}>
              <FormattedMessage {...orderPaymentMessages.cancelled} />
            </Text>
            <Box paddingLeft={3} fontSize={2}>
              <SummaryLine
                hideEmpty
                text={
                  <FormattedMessage {...orderPaymentMessages.cancelledAmount} />
                }
                money={order.totalCanceled}
              />

              <SummaryLine
                hideEmpty
                text={<FormattedMessage {...orderPaymentMessages.pending} />}
                money={order.totalCancelPending}
              />
            </Box>
          </Box>
        )}
      </SummaryList>
    </CardContent>
  );
};
