import { makeStyles, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { Alert } from "@saleor/macaw-ui";
import { orderMessages } from "@saleor/orders/messages";
import { orderGrantRefundUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage } from "react-intl";

import { orderUngratedRefundMessages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    alert: {
      marginBottom: theme.spacing(2),
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "flex-end",
    },
  }),
  { name: "OrderUngrantedRefunds" },
);

interface OrderUngrantedRefundsProps {
  orderId: string;
}

export const OrderUngrantedRefunds: React.FC<OrderUngrantedRefundsProps> = ({
  orderId,
}) => {
  const classes = useStyles();

  return (
    <Alert variant="info" close className={classes.alert}>
      <Typography>
        <FormattedMessage {...orderUngratedRefundMessages.boxText} />
      </Typography>
      <div className={classes.buttonWrapper}>
        <Button variant="secondary" href={orderGrantRefundUrl(orderId)}>
          <FormattedMessage {...orderMessages.grantRefund} />
        </Button>
      </div>
    </Alert>
  );
};
