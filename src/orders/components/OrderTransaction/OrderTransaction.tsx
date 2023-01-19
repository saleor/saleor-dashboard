import { Card } from "@material-ui/core";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@saleor/graphql";
import { FakeTransaction, TransactionFakeEvent } from "@saleor/orders/types";
import React from "react";

import { CardTitle } from "./components";
import { TransactionEvents } from "./components/TransactionEvents";
import { useStyles } from "./styles";
import { getTransactionEvents } from "./utils";

export interface OrderTransactionProps {
  transaction: TransactionItemFragment | FakeTransaction;
  fakeEvents?: TransactionFakeEvent[];
  onTransactionAction: (
    transactionId: string,
    actionType: TransactionActionEnum,
  ) => void;
  showActions?: boolean;
  cardFooter?: React.ReactNode;
}

const OrderTransaction: React.FC<OrderTransactionProps> = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
}) => {
  const classes = useStyles();

  const events = getTransactionEvents(transaction, fakeEvents);

  return (
    <Card className={classes.card}>
      <CardTitle
        title={transaction.type}
        link={transaction.externalUrl}
        id={transaction.id}
        actions={transaction.actions}
        amounts={{
          authorizedAmount: transaction.authorizedAmount,
          authorizePendingAmount: transaction.authorizePendingAmount,
          chargedAmount: transaction.chargedAmount,
          chargePendingAmount: transaction.chargePendingAmount,
          refundedAmount: transaction.refundedAmount,
          refundPendingAmount: transaction.refundPendingAmount,
          canceledAmount: transaction.canceledAmount,
          cancelPendingAmount: transaction.cancelPendingAmount,
        }}
        onTransactionAction={onTransactionAction}
        showActions={showActions}
      />
      <TransactionEvents events={events} />
      {cardFooter}
    </Card>
  );
};

export default OrderTransaction;
