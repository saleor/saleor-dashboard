// @ts-strict-ignore
import { FulfillmentStatus } from "@dashboard/graphql";
import { DEFAULT_ICON_SIZE } from "@dashboard/icons/utils";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Box, Button, Tooltip } from "@saleor/macaw-ui-next";
import { CheckIcon, TruckIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { RefundedIcon } from "../../../icons/RefundedIcon";
import { actionButtonsMessages } from "./messages";

interface ActionButtonsProps {
  status: FulfillmentStatus;
  trackingNumber?: string;
  orderIsPaid?: boolean;
  fulfillmentAllowUnpaid: boolean;
  onTrackingCodeAdd: () => any;
  onApprove: () => any;
  onRefund?: () => void;
}

const statusesToShow = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
];

export const ActionButtons = ({
  status,
  trackingNumber,
  orderIsPaid,
  fulfillmentAllowUnpaid,
  onTrackingCodeAdd,
  onApprove,
  onRefund,
}: ActionButtonsProps) => {
  const hasTrackingNumber = !!trackingNumber;

  if (!statusesToShow.includes(status)) {
    return null;
  }

  if (status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    const cannotFulfill = !orderIsPaid && !fulfillmentAllowUnpaid;

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <Box>
            <Button variant="primary" onClick={onApprove} disabled={cannotFulfill}>
              <CheckIcon size={DEFAULT_ICON_SIZE} />
              <FormattedMessage {...buttonMessages.approve} />
            </Button>
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {cannotFulfill && <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  if (status === FulfillmentStatus.RETURNED && onRefund) {
    return (
      <Box>
        <Button onClick={onRefund} variant="primary">
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
