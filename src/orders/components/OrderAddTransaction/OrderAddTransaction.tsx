import Skeleton from "@saleor/components/Skeleton";
import { OrderAction, OrderDetailsFragment } from "@saleor/graphql";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { addTransactionMessages } from "./messages";

interface OrderAddTransactionProps {
  order: OrderDetailsFragment;
  // TODO: Add transactions by staff members
  // onAddTransaction: () => void;
}

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: theme.spacing(2),
    },
  }),
  { name: "OrderAddTransaction" },
);

const OrderAddTransaction: React.FC<OrderAddTransactionProps> = ({ order }) => {
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
    // TODO: Add transaction by staff members
    <div className={classes.wrapper}>
      <Button variant="primary">
        <FormattedMessage {...addTransactionMessages.captureTransaction} />
      </Button>
    </div>
  );
};

export default OrderAddTransaction;
