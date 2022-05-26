import { CardActions, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { FulfillmentStatus } from "@saleor/graphql";
import { buttonMessages, commonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

import { actionButtonsMessages } from "./messages";
import useStyles from "./styles";

interface AcionButtonsProps {
  status: FulfillmentStatus;
  trackingNumber?: string;
  orderIsPaid?: boolean;
  fulfillmentAllowUnpaid: boolean;
  onTrackingCodeAdd();
  onRefund();
  onApprove();
}

const statusesToShow = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
];

const ActionButtons: React.FC<AcionButtonsProps> = ({
  status,
  trackingNumber,
  orderIsPaid,
  fulfillmentAllowUnpaid,
  onTrackingCodeAdd,
  onRefund,
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

  if (status === FulfillmentStatus.RETURNED) {
    return (
      <CardActions>
        <Button variant="primary" onClick={onRefund}>
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
