import { Card } from "@material-ui/core";
import { TransactionItemFragment } from "@saleor/graphql";
import React from "react";

import OrderTransactionCardTitle from "../OrderTransactionCardTitle";

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
  </Card>
);

export default OrderTransaction;
