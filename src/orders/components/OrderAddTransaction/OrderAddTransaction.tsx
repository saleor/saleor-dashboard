import Skeleton from "@dashboard/components/Skeleton";
import { OrderAction, OrderDetailsFragment } from "@dashboard/graphql";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { addTransactionMessages } from "./messages";

interface OrderAddTransactionProps {
  order: OrderDetailsFragment;
  onAddTransaction: () => void;
}

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "OrderAddTransaction" },
);

const OrderAddTransaction: React.FC<OrderAddTransactionProps> = ({
  order,
  onAddTransaction,
}) => {
  const classes = useStyles();

  if (!order) {
    return (
      <div className={classes.wrapper}>
        <Skeleton />
      </div>
    );
  }

  const canMarkAsPaid = order.actions.includes(OrderAction.MARK_AS_PAID);

  if (canMarkAsPaid) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      <Button variant="primary" onClick={onAddTransaction}>
        <FormattedMessage {...addTransactionMessages.captureTransaction} />
      </Button>
    </div>
  );
};

export default OrderAddTransaction;
