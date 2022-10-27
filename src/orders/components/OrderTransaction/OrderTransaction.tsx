import { Card } from "@material-ui/core";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@saleor/graphql";
import React from "react";

import { CardTitle } from "./components";
import { TransactionEvents } from "./components/TransactionEvents";
import { useStyles } from "./styles";

export interface OrderTransactionProps {
  transaction: TransactionItemFragment;
  onTransactionAction: (
    transactionId: string,
    actionType: TransactionActionEnum,
  ) => void;
  showActions?: boolean;
  cardFooter?: React.ReactNode;
}

const OrderTransaction: React.FC<OrderTransactionProps> = ({
  transaction,
  onTransactionAction,
  showActions,
  cardFooter,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardTitle
        title={transaction.type}
        // TODO: Add transaction link
        // link={}
        id={transaction.id}
        actions={transaction.actions}
        authorizedAmount={transaction.authorizedAmount}
        refundedAmount={transaction.refundedAmount}
        chargedAmount={transaction.chargedAmount}
        onTransactionAction={onTransactionAction}
        showActions={showActions}
      />
      <TransactionEvents events={transaction.events} />
      {cardFooter}
    </Card>
  );
};

export default OrderTransaction;
