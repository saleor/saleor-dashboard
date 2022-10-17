import { Card, Container, Grid, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import PageHeader from "@saleor/components/PageHeader";
import { OrderDetailsFragment } from "@saleor/graphql";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { TransactionCard } from "./components/TransactionCard";
import { refundPageMessages } from "./messages";

export interface OrderRefundPageProps {
  order: OrderDetailsFragment;
}

const OrderRefundPage: React.FC<OrderRefundPageProps> = ({ order }) => {
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
              orderNumber: order.number,
            }}
          />
        ) : (
          <FormattedMessage {...refundPageMessages.backlinkNoNumber} />
        )}
      </Backlink>
      <PageHeader>
        <FormattedMessage {...refundPageMessages.pageSubtitle} />
      </PageHeader>
      <Grid>
        <div>
          {order?.transactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          <div>Manual refund</div>
        </div>
        <Card>
          <CardTitle
            title={<FormattedMessage {...refundPageMessages.refundBalance} />}
          />
        </Card>
        <div>
          <Card>
            <CardTitle
              title={
                <FormattedMessage
                  {...refundPageMessages.balanceAfterRequests}
                />
              }
            />
          </Card>
        </div>
      </Grid>
    </Container>
  );
};

export default OrderRefundPage;
