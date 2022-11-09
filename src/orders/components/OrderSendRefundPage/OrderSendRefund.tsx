import { Card, CardContent, Container } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import CardTitle from "@saleor/components/CardTitle";
import { Grid } from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import {
  CreateManualTransactionRefundMutationVariables,
  OrderDetailsFragment,
} from "@saleor/graphql";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { orderMessages } from "@saleor/orders/messages";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage } from "react-intl";

import { DataLine } from "./components/DataLine";
import { DataLineMoney } from "./components/DataLineMoney";
import { DataLineSettled } from "./components/DataLineSettled";
import { ManualRefundCard } from "./components/ManualRefundCard";
import { TransactionCard } from "./components/TransactionCard";
import { refundPageMessages } from "./messages";
import { useStyles } from "./styles";

export interface OrderSendRefundPageProps {
  order: OrderDetailsFragment;
  onAddManualRefund: (
    args: CreateManualTransactionRefundMutationVariables,
  ) => void;
  addManualRefundState: ConfirmButtonTransitionState;
  addManualRefundError: string | undefined;
}

const OrderSendRefundPage: React.FC<OrderSendRefundPageProps> = ({
  order,
  onAddManualRefund,
  addManualRefundState,
  addManualRefundError,
}) => {
  const classes = useStyles();

  if (!order) {
    return null;
  }

  const currency = order.totalBalance.currency;

  return (
    <Container>
      <Backlink href={orderUrl(order.id)}>
        {order?.number ? (
          <FormattedMessage
            {...orderMessages.headerOrderNumber}
            values={{
              orderNumber: order?.number,
            }}
          />
        ) : (
          <FormattedMessage {...orderMessages.headerOrder} />
        )}
      </Backlink>
      <PageHeader
        title={<FormattedMessage {...refundPageMessages.pageSubtitle} />}
      />
      <Grid>
        <div>
          {order?.transactions.map(transaction => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              order={order}
            />
          ))}
          <ManualRefundCard
            currency={currency}
            submitState={addManualRefundState}
            error={addManualRefundError}
            onAddRefund={(amount, description) => {
              onAddManualRefund({
                currency,
                description,
                amount,
                orderId: order.id,
              });
            }}
          />
        </div>
        <div>
          <Card>
            <CardTitle
              title={<FormattedMessage {...refundPageMessages.refundBalance} />}
            />
            <CardContent>
              <ul className={classes.dataList}>
                <DataLine
                  label={
                    <FormattedMessage {...refundPageMessages.totalCaptured} />
                  }
                >
                  <DataLineMoney money={order?.totalCaptured} />
                </DataLine>
                <DataLine
                  label={
                    <FormattedMessage {...refundPageMessages.grantedRefund} />
                  }
                >
                  <DataLineMoney money={order.totalGrantedRefund} />
                </DataLine>
                <DataLine
                  label={
                    <FormattedMessage {...refundPageMessages.pendingRefunds} />
                  }
                >
                  <DataLineMoney money={order.totalPendingRefund} />
                </DataLine>
              </ul>
            </CardContent>
            <Hr />
            <CardTitle
              title={
                <FormattedMessage
                  {...refundPageMessages.balanceAfterRequests}
                />
              }
            />
            <CardContent>
              <ul className={classes.dataList}>
                {order.transactions.map(transaction => (
                  <DataLine label={transaction.type}>
                    <DataLineMoney money={transaction.refundedAmount} />
                  </DataLine>
                ))}
                <DataLine
                  label={<FormattedMessage {...refundPageMessages.result} />}
                >
                  <DataLineSettled
                    unsettledMoney={order?.totalRemainingGrant}
                  />
                </DataLine>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Container>
  );
};

export default OrderSendRefundPage;
