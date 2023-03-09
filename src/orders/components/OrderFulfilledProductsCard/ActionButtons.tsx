import { Button } from "@dashboard/components/Button";
import { FulfillmentStatus } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { orderPaymentRefundUrl } from "@dashboard/orders/urls";
import { CardActions, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { actionButtonsMessages } from "./messages";
import useStyles from "./styles";

interface AcionButtonsProps {
  orderId: string;
  status: FulfillmentStatus;
  trackingNumber?: string;
  orderIsPaid?: boolean;
  fulfillmentAllowUnpaid: boolean;
  hasTransactions: boolean;
  onTrackingCodeAdd();
  onApprove();
}

const statusesToShow = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
];

const ActionButtons: React.FC<AcionButtonsProps> = ({
  orderId,
  status,
  trackingNumber,
  orderIsPaid,
  fulfillmentAllowUnpaid,
  hasTransactions,
  onTrackingCodeAdd,
  onApprove,
}) => {
  const classes = useStyles();

  const hasTrackingNumber = !!trackingNumber;

  if (!statusesToShow.includes(status)) {
    return null;
  }

  if (status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    const cannotFulfill = !orderIsPaid && !fulfillmentAllowUnpaid;

    return (
      <CardActions className={classes.actions}>
        <Button color="primary" onClick={onApprove} disabled={cannotFulfill}>
          <FormattedMessage {...buttonMessages.approve} />
        </Button>
        {cannotFulfill && (
          <Typography color="error" variant="caption">
            <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
          </Typography>
        )}
      </CardActions>
    );
  }

  if (status === FulfillmentStatus.RETURNED && !hasTransactions) {
    return (
      <CardActions>
        <Button variant="primary" href={orderPaymentRefundUrl(orderId)}>
          <FormattedMessage {...actionButtonsMessages.refund} />
        </Button>
      </CardActions>
    );
  }

  return hasTrackingNumber ? (
    <CardActions className={classes.actions}>
      <Button variant="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.editTracking} />
      </Button>
    </CardActions>
  ) : (
    <CardActions className={classes.actions}>
      <Button variant="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.addTracking} />
      </Button>
    </CardActions>
  );
};

export default ActionButtons;
