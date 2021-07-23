import { Button, CardActions, Typography } from "@material-ui/core";
import { buttonMessages } from "@saleor/intl";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage } from "react-intl";

import { actionButtonsMessages } from "./messages";

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
  FulfillmentStatus.WAITING_FOR_APPROVAL
];

const ActionButtons: React.FC<AcionButtonsProps> = ({
  status,
  trackingNumber,
  orderIsPaid,
  fulfillmentAllowUnpaid,
  onTrackingCodeAdd,
  onRefund,
  onApprove
}) => {
  const hasTrackingNumber = !!trackingNumber;

  if (!statusesToShow.includes(status)) {
    return null;
  }

  if (status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    const cannotFulfill = !orderIsPaid && !fulfillmentAllowUnpaid;

    return (
      <CardActions>
        <Button color="primary" onClick={onApprove} disabled={cannotFulfill}>
          <FormattedMessage {...buttonMessages.approve} />
        </Button>
        {cannotFulfill && (
          <Typography color="error" variant="caption">
            <FormattedMessage
              {...actionButtonsMessages.cannotFullfillWarning}
            />
          </Typography>
        )}
      </CardActions>
    );
  }

  if (status === FulfillmentStatus.RETURNED) {
    return (
      <CardActions>
        <Button color="primary" onClick={onRefund}>
          <FormattedMessage {...actionButtonsMessages.refund} />
        </Button>
      </CardActions>
    );
  }

  return hasTrackingNumber ? (
    <CardActions>
      <Button color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.editTracking} />
      </Button>
    </CardActions>
  ) : (
    <CardActions>
      <Button color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.addTracking} />
      </Button>
    </CardActions>
  );
};

export default ActionButtons;
