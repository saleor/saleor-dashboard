import { Button, CardActions } from "@material-ui/core";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage } from "react-intl";

interface AcionButtonsProps {
  status: FulfillmentStatus;
  trackingNumber?: string;
  onTrackingCodeAdd();
  onRefund();
}

const statusesToShow = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED
];

const ActionButtons: React.FC<AcionButtonsProps> = ({
  status,
  onTrackingCodeAdd,
  trackingNumber,
  onRefund
}) => {
  const hasTrackingNumber = !!trackingNumber;

  if (!statusesToShow.includes(status)) {
    return null;
  }

  if (status === FulfillmentStatus.RETURNED) {
    return (
      <CardActions>
        <Button color="primary" onClick={onRefund}>
          <FormattedMessage
            defaultMessage="Refund"
            description="refund button"
          />
        </Button>
      </CardActions>
    );
  }

  return hasTrackingNumber ? (
    <CardActions>
      <Button color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage
          defaultMessage="Edit tracking"
          description="edit tracking button"
        />
      </Button>
    </CardActions>
  ) : (
    <CardActions>
      <Button color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage
          defaultMessage="Add tracking"
          description="add tracking button"
        />
      </Button>
    </CardActions>
  );
};

export default ActionButtons;
