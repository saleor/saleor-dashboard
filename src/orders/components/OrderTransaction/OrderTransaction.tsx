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

const getEvents = (
  transaction: TransactionItemFragment | FakeTransaction,
  fakeEvents: TransactionFakeEvent[] | undefined,
) => {
  if (transaction.__typename === "FakeTransaction") {
    return fakeEvents;
  }
  return transaction.events;
};

const OrderTransaction: React.FC<OrderTransactionProps> = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
}) => {
  const classes = useStyles();

  const events = getEvents(transaction, fakeEvents);

  return (
    <Card className={classes.card}>
      <CardTitle
        title={transaction.type}
        link={transaction.externalUrl}
        id={transaction.id}
        actions={transaction.actions}
        authorizedAmount={transaction.authorizedAmount}
        refundedAmount={transaction.refundedAmount}
        chargedAmount={transaction.chargedAmount}
        onTransactionAction={onTransactionAction}
        showActions={showActions}
      />
      <TransactionEvents events={events} />
      {cardFooter}
    </Card>
  );
};

export default OrderTransaction;
