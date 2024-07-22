import { OrderDetailsFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import SummaryLine from "../../OrderSummaryCard/SummaryLine";
import { SummaryList } from "../../OrderSummaryCard/SummaryList";
import { orderPaymentMessages } from "../messages";
import { useStyles } from "../styles";

interface RefundsSummary {
  order: OrderDetailsFragment;
}

export const RefundsSummary: React.FC<RefundsSummary> = ({ order }) => {
  const classes = useStyles();
  const { totalRefunded, totalRefundPending, totalGrantedRefund } = order;
  const refundedAmount = totalRefunded?.amount ?? 0;
  const pendingAmount = totalRefundPending?.amount ?? 0;
  const grantedAmount = totalGrantedRefund?.amount ?? 0;
  const hasAnyRefund = refundedAmount || pendingAmount || grantedAmount;

  if (!hasAnyRefund) {
    return (
      <Text size={3} fontWeight="regular" className={classes.explainText}>
        <FormattedMessage {...orderPaymentMessages.refundsExplanation} />
      </Text>
    );
  }

  return (
    <SummaryList className={classes.amountGrid}>
      {grantedAmount !== 0 && (
        <SummaryLine
          vertical
          text={<FormattedMessage {...orderPaymentMessages.grantedRefund} />}
          money={totalGrantedRefund}
        />
      )}
      {pendingAmount !== 0 && (
        <SummaryLine
          vertical
          text={<FormattedMessage {...orderPaymentMessages.pendingRefund} />}
          money={totalRefundPending}
        />
      )}
      {refundedAmount !== 0 && (
        <SummaryLine
          vertical
          text={<FormattedMessage {...orderPaymentMessages.refunded} />}
          money={totalRefunded}
        />
      )}
    </SummaryList>
  );
};
