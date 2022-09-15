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
  onMarkAsPaid: () => void;
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

const OrderAddTransaction: React.FC<OrderAddTransactionProps> = ({
  order,
  onMarkAsPaid,
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

  if (order.transactions.length === 0) {
    // order uses old payments
    if (canMarkAsPaid) {
      return (
        <div className={classes.wrapper}>
          <Button variant="primary" onClick={() => onMarkAsPaid()}>
            <FormattedMessage {...addTransactionMessages.markAsPaid} />
          </Button>
        </div>
      );
    }

    if (order.payments.length > 0) {
      // When payments are used, we don't create transactions
      return null;
    }
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
