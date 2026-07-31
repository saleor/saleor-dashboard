import { type OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Box, Button } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { transactionActionMessages } from "../OrderTransaction/messages";

type Props = {
  order: OrderDetailsFragment;
  onCapture?: () => void;
  onRefund?: () => void;
  onVoid?: () => void;
  onMarkAsPaid?: () => void;
};

/** Summary actions owned by the Legacy Payments API view. */
export const LegacyPaymentsApiButtons = ({
  order,
  onCapture,
  onRefund,
  onVoid,
  onMarkAsPaid,
}: Props): ReactNode => {
  const intl = useIntl();
  const canCapture = OrderDetailsViewModel.canOrderCapture(order.actions);
  const canVoid = OrderDetailsViewModel.canOrderVoid(order.actions);
  const canRefund = OrderDetailsViewModel.canOrderRefund(order.actions);
  const canMarkAsPaid = OrderDetailsViewModel.canOrderBeMarkedAsPaid(order.actions);

  const showButtons =
    order.status !== OrderStatus.CANCELED &&
    (canCapture || canRefund || canVoid || (canMarkAsPaid && onMarkAsPaid));

  if (!showButtons) {
    return null;
  }

  return (
    <Box display="flex" gap={2}>
      {canCapture && (
        <Button variant="secondary" onClick={onCapture}>
          {intl.formatMessage(transactionActionMessages.capture)}
        </Button>
      )}
      {canRefund && (
        <Button variant="secondary" onClick={onRefund} data-test-id="refund-button">
          {intl.formatMessage(transactionActionMessages.refund)}
        </Button>
      )}
      {canVoid && (
        <Button variant="secondary" onClick={onVoid}>
          {intl.formatMessage(transactionActionMessages.void)}
        </Button>
      )}
      {canMarkAsPaid && onMarkAsPaid && (
        <Button variant="secondary" onClick={onMarkAsPaid} data-test-id="mark-as-paid-button">
          {intl.formatMessage(transactionActionMessages.markAsPaid)}
        </Button>
      )}
    </Box>
  );
};
