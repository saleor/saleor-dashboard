// @ts-strict-ignore
import { FulfillmentStatus } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { orderPaymentRefundUrl } from "@dashboard/orders/urls";
import { CardActions } from "@material-ui/core";
import { Button, Text } from "@saleor/macaw-ui-next";
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
  onTrackingCodeAdd: () => any;
  onApprove: () => any;
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
  const navigate = useNavigator();
  const hasTrackingNumber = !!trackingNumber;

  const handleRefundClick = () => {
    navigate(orderPaymentRefundUrl(orderId));
  };

  if (!statusesToShow.includes(status)) {
    return null;
  }

  if (status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    const cannotFulfill = !orderIsPaid && !fulfillmentAllowUnpaid;

    return (
      <CardActions className={classes.actions}>
        <Button variant="primary" onClick={onApprove} disabled={cannotFulfill}>
          <FormattedMessage {...buttonMessages.approve} />
        </Button>
        {cannotFulfill && (
          <Text color="critical1" size={2} fontWeight="light">
            <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
          </Text>
        )}
      </CardActions>
    );
  }

  if (status === FulfillmentStatus.RETURNED && !hasTransactions) {
    return (
      <CardActions>
        <Button onClick={handleRefundClick} variant="primary">
          <FormattedMessage {...actionButtonsMessages.refund} />
        </Button>
      </CardActions>
    );
  }

  return hasTrackingNumber ? (
    <CardActions className={classes.actions}>
      <Button data-test-id="edit-tracking-button" variant="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.editTracking} />
      </Button>
    </CardActions>
  ) : (
    <CardActions className={classes.actions}>
      <Button variant="primary" onClick={onTrackingCodeAdd} data-test-id="add-tracking-button">
        <FormattedMessage {...actionButtonsMessages.addTracking} />
      </Button>
    </CardActions>
  );
};

export default ActionButtons;
