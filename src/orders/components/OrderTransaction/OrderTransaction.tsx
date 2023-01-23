import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";
import { FakeTransaction, TransactionFakeEvent } from "@dashboard/orders/types";
import { Card } from "@material-ui/core";
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

  if (!transaction) {
    return null;
  }

  return (
    <Card className={classes.card}>
      <CardTitle
        transaction={transaction}
        onTransactionAction={onTransactionAction}
        showActions={showActions}
      />
      <TransactionEvents events={events} />
      {cardFooter}
    </Card>
  );
};

export default OrderTransaction;
