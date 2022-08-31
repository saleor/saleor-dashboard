import { Card, CardContent } from "@material-ui/core";
import { TransactionItemFragment } from "@saleor/graphql";
import React from "react";

import OrderTransactionCardTitle from "../OrderTransactionCardTitle";
import OrderTransactionEvents from "../OrderTransactionEvents";

export interface OrderTransactionProps {
  transaction: TransactionItemFragment;
}

const OrderTransaction: React.FC<OrderTransactionProps> = ({ transaction }) => (
  <Card>
    <OrderTransactionCardTitle
      title={transaction.type}
      // TODO: Add transaction link
      // link={}
      authorizedAmount={transaction.authorizedAmount}
      refundedAmount={transaction.refundedAmount}
      chargedAmount={transaction.chargedAmount}
    />
    <CardContent>
      <OrderTransactionEvents events={transaction.events} />
    </CardContent>
  </Card>
);

export default OrderTransaction;
