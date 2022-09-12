import { Card } from "@material-ui/core";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@saleor/graphql";
import React from "react";

import OrderTransactionCardTitle from "../OrderTransactionCardTitle";
import OrderTransactionEvents from "../OrderTransactionEvents";

export interface OrderTransactionProps {
  transaction: TransactionItemFragment;
  onTransactionAction: (
    transactionId: string,
    actionType: TransactionActionEnum,
  ) => void;
}

const OrderTransaction: React.FC<OrderTransactionProps> = ({
  transaction,
  onTransactionAction,
}) => (
  <Card>
    <OrderTransactionCardTitle
      title={transaction.type}
      // TODO: Add transaction link
      // link={}
      id={transaction.id}
      actions={transaction.actions}
      authorizedAmount={transaction.authorizedAmount}
      refundedAmount={transaction.refundedAmount}
      chargedAmount={transaction.chargedAmount}
      onTransactionAction={onTransactionAction}
    />
    <OrderTransactionEvents events={transaction.events} />
  </Card>
);

export default OrderTransaction;
