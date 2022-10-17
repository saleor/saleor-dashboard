import { Card, CardContent, Container } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { Grid } from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import { OrderDetailsFragment } from "@saleor/graphql";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { DataLine } from "./components/DataLine";
import { DataLineMoney } from "./components/DataLineMoney";
import { DataLineSettled } from "./components/DataLineSettled";
import { TransactionCard } from "./components/TransactionCard";
import { refundPageMessages } from "./messages";
import { useStyles } from "./styles";

export interface OrderSendRefundPageProps {
  order: OrderDetailsFragment;
}

const OrderSendRefundPage: React.FC<OrderSendRefundPageProps> = ({ order }) => {
  const classes = useStyles();

  if (!order) {
    return null;
  }

  return (
    <Container>
      <Backlink>
        {order?.number ? (
          <FormattedMessage
            {...refundPageMessages.backlink}
            values={{
              orderNumber: order?.number,
            }}
          />
        ) : (
          <FormattedMessage {...refundPageMessages.backlinkNoNumber} />
        )}
      </Backlink>
      <PageHeader
        title={<FormattedMessage {...refundPageMessages.pageSubtitle} />}
      />
      <Grid>
        <div>
          {order?.transactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          <div>Manual refund</div>
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
                    {/* TODO: Replace with amounts stored in component */}
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
