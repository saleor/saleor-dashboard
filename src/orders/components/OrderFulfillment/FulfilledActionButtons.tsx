import { Button, CardActions } from "@material-ui/core";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage } from "react-intl";

interface FulfilledActionButtonsProps {
  status: FulfillmentStatus;
  trackingNumber?: string;
  onTrackingCodeAdd();
}

const FulfilledActionButtons: React.FC<FulfilledActionButtonsProps> = ({
  status,
  onTrackingCodeAdd,
  trackingNumber
}) => {
  if (status !== FulfillmentStatus.FULFILLED) {
    return null;
  }

  const hasTrackingNumber = !!trackingNumber;

  return hasTrackingNumber ? (
    <CardActions>
      <Button color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage
          defaultMessage="Edit tracking"
          description="fulfillment group tracking number"
        />
      </Button>
    </CardActions>
  ) : (
    <CardActions>
      <Button color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage
          defaultMessage="Add tracking"
          description="fulfillment group tracking number"
        />
      </Button>
    </CardActions>
  );
};

export default FulfilledActionButtons;
