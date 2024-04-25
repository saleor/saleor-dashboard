// @ts-strict-ignore
import { TransactionActionEnum, TransactionItemFragment } from "@dashboard/graphql";
import { FakeTransaction, TransactionFakeEvent } from "@dashboard/orders/types";
import { Card } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

import { CardTitle } from "./components";
import { TransactionEvents } from "./components/TransactionEvents";
import { useStyles } from "./styles";
import { getTransactionEvents } from "./utils";

export interface OrderTransactionProps {
  transaction: TransactionItemFragment | FakeTransaction;
  fakeEvents?: TransactionFakeEvent[];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => void;
  showActions?: boolean;
  cardFooter?: React.ReactNode;
  disabled?: boolean;
}

const OrderTransaction: React.FC<OrderTransactionProps> = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
  disabled = false,
}) => {
  const classes = useStyles();
  const events = getTransactionEvents(transaction, fakeEvents);

  if (!transaction) {
    return null;
  }

  return (
    <Card
      className={clsx(classes.card, disabled && classes.disabled)}
      data-test-id="orderTransactionsList"
    >
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
