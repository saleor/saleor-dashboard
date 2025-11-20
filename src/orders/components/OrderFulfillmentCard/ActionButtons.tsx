// @ts-strict-ignore
import { FulfillmentStatus } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { DEFAULT_ICON_SIZE } from "@dashboard/icons/utils";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { orderPaymentRefundUrl } from "@dashboard/orders/urls";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { CheckIcon, TruckIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { RefundedIcon } from "../../../icons/RefundedIcon";
import { actionButtonsMessages } from "./messages";

interface ActionButtonsProps {
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

export const ActionButtons = ({
  orderId,
  status,
  trackingNumber,
  orderIsPaid,
  fulfillmentAllowUnpaid,
  hasTransactions,
  onTrackingCodeAdd,
  onApprove,
}: ActionButtonsProps) => {
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
      <Box>
        <Button variant="primary" onClick={onApprove} disabled={cannotFulfill}>
          <CheckIcon size={DEFAULT_ICON_SIZE} />
          <FormattedMessage {...buttonMessages.approve} />
        </Button>
        {cannotFulfill && (
          <Text color="critical1" size={2} fontWeight="light">
            <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
          </Text>
        )}
      </Box>
    );
  }

  if (status === FulfillmentStatus.RETURNED && !hasTransactions) {
    return (
      <Box>
        <Button onClick={handleRefundClick} variant="primary">
          <RefundedIcon size={DEFAULT_ICON_SIZE} />
          <FormattedMessage {...actionButtonsMessages.refund} />
        </Button>
      </Box>
    );
  }

  return hasTrackingNumber ? (
    <Box>
      <Button data-test-id="edit-tracking-button" variant="primary" onClick={onTrackingCodeAdd}>
        <TruckIcon size={DEFAULT_ICON_SIZE} />
        <FormattedMessage {...actionButtonsMessages.editTracking} />
      </Button>
    </Box>
  ) : (
    <Box>
      <Button variant="primary" onClick={onTrackingCodeAdd} data-test-id="add-tracking-button">
        <TruckIcon size={DEFAULT_ICON_SIZE} />
        <FormattedMessage {...actionButtonsMessages.addTracking} />
      </Button>
    </Box>
  );
};
